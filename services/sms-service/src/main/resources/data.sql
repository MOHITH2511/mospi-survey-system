-- Insert a dummy survey
INSERT INTO survey (id, title, survey_link) VALUES (1, 'National Sample Survey', 'https://mospi.gov.in/survey/123');

-- Insert a dummy Aadhar record
-- NOTE: Please replace the phone_number with your verified number if using a Twilio trial account!
INSERT INTO aadhar_record (id, name, phone_number, state, city) VALUES (1, 'Sabesh', '+919943296099', 'Maharashtra', 'Mumbai'),(2, 'Mohith', '+919123542368', 'Haryana', 'Faridabad'),(3, 'Thithiksaa', '+919489431540', 'Tamilnadu', 'Chennai');
