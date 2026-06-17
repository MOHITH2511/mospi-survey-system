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
public class SurveyDto {
    private String surveyCode;
    private String title;
    private Integer version;
    @Builder.Default
    private List<SurveyNode> sections = new ArrayList<>();
}
