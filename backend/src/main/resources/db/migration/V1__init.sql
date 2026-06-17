CREATE TABLE survey (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    version INTEGER,
    status VARCHAR(50),
    schema_json JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255)
);

CREATE INDEX idx_survey_schema ON survey USING GIN (schema_json);

CREATE TABLE survey_version (
    id UUID PRIMARY KEY,
    survey_id UUID REFERENCES survey(id),
    version INTEGER,
    schema_json JSONB,
    created_at TIMESTAMP
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY,
    survey_id UUID,
    action VARCHAR(50),
    timestamp TIMESTAMP
);

CREATE TABLE question_bank (
    id UUID PRIMARY KEY
);
