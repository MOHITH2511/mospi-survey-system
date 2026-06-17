package com.mospi.parser.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveyNode {
    private String id;
    private String type; // "section" | "question" | "table" | "column" | "dictionary"
    private String title;
    private String label;
    private String sectionType; // "FORM", "TABLE", "DICTIONARY", "MIXED"
    private String questionType;
    private Boolean required;
    
    // Unified children for nested structures
    @Builder.Default
    private List<SurveyNode> children = new ArrayList<>();
    
    // Specifically for tables
    @Builder.Default
    private List<String> columns = new ArrayList<>();
    @Builder.Default
    private List<String> rows = new ArrayList<>();
    
    // Metadata
    private List<DictionaryItem> dictionary;
    private String content; 
}
