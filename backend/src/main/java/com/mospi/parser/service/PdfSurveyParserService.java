package com.mospi.parser.service;

import com.mospi.parser.dto.SurveyDto;
import com.mospi.parser.dto.SurveyNode;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class PdfSurveyParserService {

    private final SurveyTextParser textParser;

    public PdfSurveyParserService(SurveyTextParser textParser) {
        this.textParser = textParser;
    }

    public SurveyDto parsePdf(byte[] pdfBytes, String filename) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            
            List<SurveyNode> sections = textParser.parseText(text);
            
            return SurveyDto.builder()
                    .title("Parsed Survey: " + filename)
                    .sections(sections)
                    .build();
        }
    }
}
