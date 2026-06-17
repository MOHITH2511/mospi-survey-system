package com.mospi.parser.service;

import com.mospi.parser.dto.DictionaryItem;
import com.mospi.parser.dto.SurveyNode;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SurveyTextParser {

    private static final Pattern SECTION_PATTERN = Pattern.compile("^\\s*\\[([\\d\\.]+)\\]\\s*(.*)");
    private static final Pattern MULTI_COL_PATTERN = Pattern.compile("(\\d+)\\.\\s+(.*?)\\s+(?=\\d+\\.)");
    private static final Pattern LAST_COL_PATTERN = Pattern.compile("(\\d+)\\.\\s+(.*)");
    private static final Pattern DICTIONARY_PATTERN = Pattern.compile("^(.*?)\\s+-(\\d+)$");
    private static final Pattern HEADER_FOOTER_PATTERN = Pattern.compile("(?i)(government of india|national sample survey|annexure|schedule \\d+:\\d+)");

    public List<SurveyNode> parseText(String text) {
        Map<String, SurveyNode> sectionsMap = new LinkedHashMap<>();
        String[] lines = text.split("\\r?\\n");

        SurveyNode currentSection = null;
        StringBuilder currentSectionContent = new StringBuilder();

        for (String line : lines) {
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty()) continue;
            
            // 1. Remove PDF page headers and footers
            if (HEADER_FOOTER_PATTERN.matcher(trimmedLine).find() || trimmedLine.matches("^\\d+$")) {
                continue; // Ignore headers, footers, and standalone page numbers
            }

            Matcher matcher = SECTION_PATTERN.matcher(trimmedLine);
            if (matcher.find()) {
                if (currentSection != null) {
                    parseSectionContent(currentSection, currentSectionContent.toString());
                    String key = currentSection.getTitle().toLowerCase();
                    if (sectionsMap.containsKey(key)) {
                        SurveyNode existing = sectionsMap.get(key);
                        existing.getChildren().addAll(currentSection.getChildren());
                        existing.getColumns().addAll(currentSection.getColumns());
                        existing.getRows().addAll(currentSection.getRows());
                        if (existing.getSectionType() == null || existing.getSectionType().equals("FORM")) {
                            existing.setSectionType(currentSection.getSectionType());
                        }
                    } else {
                        sectionsMap.put(key, currentSection);
                    }
                }

                String blockIdRaw = matcher.group(1).trim(); 
                String blockId = "block_" + blockIdRaw.replace(".", "_");
                String title = matcher.group(2).trim();
                
                String computedTitle = title.isEmpty() ? "Block " + blockIdRaw : title;
                
                currentSection = SurveyNode.builder()
                        .id(blockId)
                        .type("section")
                        .title(computedTitle)
                        .children(new ArrayList<>())
                        .columns(new ArrayList<>())
                        .rows(new ArrayList<>())
                        .build();
                currentSectionContent = new StringBuilder();
            } else {
                if (currentSection != null) {
                    if (currentSection.getTitle().startsWith("Block") && currentSection.getTitle().length() < 10) {
                        currentSection.setTitle(currentSection.getTitle() + " - " + trimmedLine);
                    } else {
                        currentSectionContent.append(line).append("\n");
                    }
                }
            }
        }

        if (currentSection != null) {
            parseSectionContent(currentSection, currentSectionContent.toString());
            String key = currentSection.getTitle().toLowerCase();
            if (sectionsMap.containsKey(key)) {
                SurveyNode existing = sectionsMap.get(key);
                existing.getChildren().addAll(currentSection.getChildren());
                existing.getColumns().addAll(currentSection.getColumns());
                existing.getRows().addAll(currentSection.getRows());
            } else {
                sectionsMap.put(key, currentSection);
            }
        }

        return new ArrayList<>(sectionsMap.values());
    }

    private void parseSectionContent(SurveyNode section, String content) {
        // 8. Preserve raw table text in content field
        section.setContent(content.trim());
        String lowerContent = content.toLowerCase();

        // 3 & 4. Specific Form overrides
        if (lowerContent.contains("household characteristics") || lowerContent.contains("follow-up questions")) {
            section.setSectionType("FORM");
            extractQuestions(section, content);
            return;
        }

        // 2 & 5. Table Detection heuristics
        boolean isTable = lowerContent.contains("col.") || lowerContent.contains("code") || lowerContent.contains("expenditure");

        if (isTable) {
            section.setSectionType("TABLE");
            extractTableContent(section, content);
        } else {
            section.setSectionType("FORM");
            extractQuestions(section, content);
        }
    }

    private void extractTableContent(SurveyNode section, String content) {
        String[] lines = content.split("\\n");
        for (String line : lines) {
            line = line.trim();
            if (line.length() <= 2) continue; // Ignore single character headers
            
            if (line.matches("^\\d+\\..*")) {
                section.getRows().add(line);
            } else if (line.length() < 50 && !line.contains("-")) {
                section.getColumns().add(line);
            }
        }
    }

    private void extractQuestions(SurveyNode section, String content) {
        String[] lines = content.split("\\n");
        List<DictionaryItem> currentDictionary = new ArrayList<>();
        SurveyNode lastQuestion = null;

        for (String line : lines) {
            line = line.trim();
            if (line.length() <= 2) continue; // Ignore single character lines

            Matcher dictMatcher = DICTIONARY_PATTERN.matcher(line);
            if (dictMatcher.find()) {
                currentDictionary.add(new DictionaryItem(dictMatcher.group(2), dictMatcher.group(1).trim()));
                continue;
            }

            if (line.matches(".*\\d+\\..*\\d+\\..*")) {
                Matcher m = MULTI_COL_PATTERN.matcher(line);
                int lastEnd = 0;
                while (m.find()) {
                    lastEnd = m.end();
                    String qNum = m.group(1);
                    String qText = m.group(2).trim();
                    if (qText.isEmpty()) continue;
                    
                    SurveyNode q = SurveyNode.builder()
                            .id("question_" + UUID.randomUUID().toString())
                            .type("question")
                            .label(qNum + ". " + qText)
                            .questionType("TEXT")
                            .required(true)
                            .build();
                    section.getChildren().add(q);
                    lastQuestion = q;
                }
                String remainder = line.substring(lastEnd).trim();
                Matcher lastM = LAST_COL_PATTERN.matcher(remainder);
                if (lastM.find()) {
                    String lastText = lastM.group(2).trim();
                    if (!lastText.isEmpty()) {
                        SurveyNode q = SurveyNode.builder()
                                .id("question_" + UUID.randomUUID().toString())
                                .type("question")
                                .label(lastM.group(1) + ". " + lastText)
                                .questionType("TEXT")
                                .required(true)
                                .build();
                        section.getChildren().add(q);
                        lastQuestion = q;
                    }
                }
            } else if (line.matches("^\\d+\\..*")) {
                SurveyNode q = SurveyNode.builder()
                        .id("question_" + UUID.randomUUID().toString())
                        .type("question")
                        .label(line)
                        .questionType("TEXT")
                        .required(true)
                        .build();
                section.getChildren().add(q);
                lastQuestion = q;
                
                if (!currentDictionary.isEmpty()) {
                    q.setDictionary(new ArrayList<>(currentDictionary));
                    q.setQuestionType("SELECT");
                    currentDictionary.clear();
                }
            } else {
                if (lastQuestion != null && !currentDictionary.isEmpty()) {
                    if (lastQuestion.getDictionary() == null) {
                        lastQuestion.setDictionary(new ArrayList<>());
                        lastQuestion.setQuestionType("SELECT");
                    }
                    lastQuestion.getDictionary().addAll(currentDictionary);
                    currentDictionary.clear();
                }
            }
        }
        
        if (!section.getChildren().isEmpty() && section.getChildren().stream().anyMatch(q -> q.getDictionary() != null && !q.getDictionary().isEmpty())) {
            section.setSectionType("MIXED");
        }
    }
}
