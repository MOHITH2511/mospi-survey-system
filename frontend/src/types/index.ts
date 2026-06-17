export interface DictionaryItem {
  code: string;
  label: string;
}

export interface SurveyNode {
  id: string;
  type: "section" | "question" | "table" | "column" | "dictionary";
  title?: string;
  label?: string;
  sectionType?: "FORM" | "TABLE" | "DICTIONARY" | "MIXED";
  questionType?: string;
  required?: boolean;
  
  children?: SurveyNode[];
  columns?: string[];
  rows?: string[];
  
  dictionary?: DictionaryItem[];
  content?: string;
}

export interface SurveyDto {
  surveyCode?: string;
  title: string;
  version?: number;
  sections: SurveyNode[];
}
