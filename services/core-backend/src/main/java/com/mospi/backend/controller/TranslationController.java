package com.mospi.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/translations", produces = "application/json; charset=UTF-8")
@CrossOrigin(origins = "*")
public class TranslationController {

    private static final Map<String, Map<String, String>> DICTIONARY = new HashMap<>();

    static {
        // Hindi Translations
        Map<String, String> hi = new HashMap<>();
        hi.put("Dashboard Overview", "डैशबोर्ड अवलोकन");
        hi.put("AI Survey Builder", "एआई सर्वेक्षण निर्माता");
        hi.put("Survey Import Center", "सर्वेक्षण आयात केंद्र");
        hi.put("Question Bank", "प्रश्न बैंक");
        hi.put("Survey Registry", "सर्वेक्षण रजिस्ट्री");
        hi.put("Deployment Center", "परिनियोजन केंद्र");
        hi.put("Monitoring Hub", "निगरानी केंद्र");
        hi.put("AI Insights", "एआई अंतर्दृष्टि");
        hi.put("User Management", "उपयोगकर्ता प्रबंधन");
        hi.put("Survey Quality Controls", "सर्वेक्षण गुणवत्ता नियंत्रण");
        hi.put("Sign Out", "साइन आउट");
        hi.put("Portal Settings", "पोर्टल सेटिंग्स");
        hi.put("National Data Gateway", "राष्ट्रीय डेटा गेटवे");
        hi.put("Create New Survey", "नया सर्वेक्षण बनाएं");
        hi.put("Official User", "आधिकारिक उपयोगकर्ता");
        hi.put("admin Session Active", "व्यवस्थापक सत्र सक्रिय");
        hi.put("supervisor Session Active", "पर्यवेक्षक सत्र सक्रिय");
        hi.put("enumerator Session Active", "प्रगणक सत्र सक्रिय");
        hi.put("citizen Session Active", "नागरिक सत्र सक्रिय");
        hi.put("Back", "पीछे");
        hi.put("Nodal Officer Panel", "नोडल अधिकारी पैनल");
        hi.put("System", "सिस्टम");
        hi.put("Digital India", "डिजिटल इंडिया");
        hi.put("Survey Portal", "सर्वेक्षण पोर्टल");
        hi.put("Login", "लॉगिन");
        hi.put("Dashboard", "डैशबोर्ड");
        hi.put("Active Surveys", "सक्रिय सर्वेक्षण");
        hi.put("Published Surveys", "प्रकाशित सर्वेक्षण");
        hi.put("Total Responses", "कुल प्रतिक्रियाएं");
        hi.put("District Coverage", "जिला कवरेज");
        hi.put("Active Enumerators", "सक्रिय प्रगणक");
        hi.put("National Economic Survey Q1", "राष्ट्रीय आर्थिक सर्वेक्षण Q1");
        hi.put("Rural Health Assessment", "ग्रामीण स्वास्थ्य मूल्यांकन");
        hi.put("Agricultural Equipment Census", "कृषि उपकरण जनगणना");
        hi.put("Urban Employment Index", "शहरी रोजगार सूचकांक");
        hi.put("Education Infrastructure", "शिक्षा अवसंरचना");
        hi.put("Survey Details", "सर्वेक्षण विवरण");
        hi.put("Version", "संस्करण");
        hi.put("Status", "स्थिति");
        hi.put("Created By", "द्वारा बनाया गया");
        hi.put("Responses", "प्रतिक्रियाएं");
        hi.put("Published", "प्रकाशित");
        hi.put("Actions", "कार्रवाई");
        hi.put("Search surveys...", "सर्वेक्षण खोजें...");
        hi.put("Preview", "पूर्वावलोकन");
        hi.put("Survey Settings", "सर्वेक्षण सेटिंग्स");
        hi.put("Save Draft", "ड्राफ्ट सहेजें");
        hi.put("Publish Survey", "सर्वेक्षण प्रकाशित करें");
        hi.put("Generate with AI", "एआई के साथ उत्पन्न करें");
        hi.put("Question Types", "प्रश्न प्रकार");
        hi.put("Add Section", "अनुभाग जोड़ें");
        hi.put("Survey Title", "सर्वेक्षण का शीर्षक");
        hi.put("Start Building Your Survey", "अपने सर्वेक्षण का निर्माण शुरू करें");
        hi.put("Drafts", "ड्राफ्ट");
        hi.put("Closed", "बंद");
        hi.put("Archived", "अभिलेखागार");
        hi.put("All", "सभी");
        hi.put("MoSPI Standard: Household Survey", "MoSPI मानक: घरेलू सर्वेक्षण");
        hi.put("Deployment Configuration", "परिनियोजन विन्यास");
        hi.put("Delivery Channels", "वितरण चैनल");
        hi.put("Quick Select", "త్వరిత ఎంపిక");
        hi.put("National Rollout", "राष्ट्रीय रोलआउट");
        hi.put("Entire South Zone", "संपूर्ण दक्षिण क्षेत्र");
        hi.put("Entire North Zone", "संपूर्ण उत्तर क्षेत्र");
        hi.put("Clear Selection", "चयन स्पष्ट करें");
        hi.put("Geographic Tree Selection", "भौगोलिक पेड़ चयन");
        hi.put("Deploy Survey", "सर्वेक्षण तैनात करें");
        hi.put("Survey Response Heatmap", "सर्वेक्षण प्रतिक्रिया हीटमैप");
        hi.put("Assigned Regions", "सौंपे गए क्षेत्र");
        hi.put("Active Data Collection", "सक्रिय डेटा संग्रह");
        hi.put("Short Text", "छोटा पाठ");
        hi.put("Long Text", "लंबा पाठ");
        hi.put("Number", "संख्या");
        hi.put("Single Select", "एकल चयन");
        hi.put("Multi Select", "बहु चयन");
        hi.put("Dropdown", "ड्रॉपडाउन");
        hi.put("Date", "तारीख");
        hi.put("GPS Location", "जीपीएस स्थान");
        hi.put("Image Upload", "छवि अपलोड");
        hi.put("Audio Response", "ऑडियो प्रतिक्रिया");
        hi.put("Matrix Question", "मैट्रिक्स प्रश्न");
        DICTIONARY.put("hi", hi);

        // Tamil translations
        Map<String, String> ta = new HashMap<>();
        ta.put("Dashboard Overview", "டாஷ்போர்டு கண்ணோட்டம்");
        ta.put("AI Survey Builder", "AI கணக்கெடுப்பு உருவாக்குபவர்");
        ta.put("Survey Import Center", "கணக்கெடுப்பு இறக்குமதி மையம்");
        ta.put("Question Bank", "கேள்வி வங்கி");
        ta.put("Survey Registry", "கணக்கெடுப்பு பதிவேடு");
        ta.put("Deployment Center", "வரிசைப்படுத்தல் மையம்");
        ta.put("Monitoring Hub", "கண்காணிப்பு மையம்");
        ta.put("AI Insights", "AI நுண்ணறிவு");
        ta.put("User Management", "பயனர் மேలాண்மை");
        ta.put("Survey Quality Controls", "கணக்கெடுப்பு தர கட்டுப்பாடுகள்");
        ta.put("Sign Out", "வெளியேறு");
        ta.put("Portal Settings", "போர்டல் அமைப்புகள்");
        ta.put("National Data Gateway", "தேசிய தரவு நுழைவாயில்");
        ta.put("Create New Survey", "புதிய கணக்கெடுப்பை உருவாக்கு");
        ta.put("Official User", "அதிகாரப்பூர்வ பயனர்");
        ta.put("admin Session Active", "நிர்வாகி அமர்வு செயலில் உள்ளது");
        ta.put("Back", "பின்னால்");
        ta.put("Nodal Officer Panel", "நோடல் அதிகாரி குழு");
        ta.put("System", "கணினி");
        ta.put("Digital India", "டிஜிட்டல் இந்தியா");
        ta.put("Survey Portal", "கணக்கெடுப்பு போர்டல்");
        ta.put("Login", "உள்நுழை");
        ta.put("Dashboard", "டாஷ்போர்டு");
        ta.put("Active Surveys", "செயலில் உள்ள கணக்கெடுப்புகள்");
        ta.put("Published Surveys", "வெளியிடப்பட்ட கணக்கெடுப்புகள்");
        ta.put("Total Responses", "மொத்த பதில்கள்");
        ta.put("District Coverage", "மாவட்ட கவரேஜ்");
        ta.put("Active Enumerators", "செயலில் உள்ள கணக்கெடுப்பாளர்கள்");
        ta.put("National Economic Survey Q1", "தேசிய பொருளாதார ஆய்வு Q1");
        ta.put("Rural Health Assessment", "கிராமப்புற சுகாதார மதிப்பீடு");
        ta.put("Agricultural Equipment Census", "விவசாய உபகரணங்கள் கணக்கெடுப்பு");
        ta.put("Urban Employment Index", "நகர்ப்புற வேலைவாய்ப்பு குறியீடு");
        ta.put("Education Infrastructure", "கல்வி உள்கட்டமைப்பு");
        ta.put("Survey Details", "கணக்கெடுப்பு விவரங்கள்");
        ta.put("Version", "பதிப்பு");
        ta.put("Status", "நிலைமை");
        ta.put("Created By", "உருவாக்கியவர்");
        ta.put("Responses", "பதில்கள்");
        ta.put("Published", "வெளியிடப்பட்டது");
        ta.put("Actions", "நடவடிக்கைகள்");
        ta.put("Search surveys...", "கணக்கெடுப்புகளைத் தேடுங்கள்...");
        ta.put("Preview", "முன்னோட்டம்");
        ta.put("Survey Settings", "கணக்கெடுப்பு அமைப்புகள்");
        ta.put("Save Draft", "வரைவைச் சேமி");
        ta.put("Publish Survey", "கணக்கெடுப்பை வெளியிடு");
        ta.put("Generate with AI", "AI மூலம் உருவாக்கு");
        ta.put("Question Types", "கேள்வி வகைகள்");
        ta.put("Add Section", "பிரிவைச் சேர்");
        ta.put("Survey Title", "கணக்கெடுப்பு தலைப்பு");
        ta.put("Start Building Your Survey", "உங்கள் கணக்கெடுப்பை உருவாக்கத் தொடங்குங்கள்");
        ta.put("Drafts", "வரைவுகள்");
        ta.put("Closed", "மூடப்பட்டது");
        ta.put("Archived", "காப்பகப்படுத்தப்பட்டது");
        ta.put("All", "அனைத்தும்");
        ta.put("MoSPI Standard: Household Survey", "MoSPI தரம்: வீட்டு கணக்கெடுப்பு");
        ta.put("Deployment Configuration", "வரிசைப்படுத்தல் உள்ளமைப்பு");
        ta.put("Delivery Channels", "விநியோக சேனல்கள்");
        ta.put("Quick Select", "விரைவு தேர்வு");
        ta.put("National Rollout", "தேசிய வெளியீடு");
        ta.put("Entire South Zone", "தெற்கு மண்டலம் முழுவதும்");
        ta.put("Entire North Zone", "வடக்கு மண்டலம் முழுவதும்");
        ta.put("Clear Selection", "தேர்வை நீக்கு");
        ta.put("Geographic Tree Selection", "புவியியல் மரத் தேர்வு");
        ta.put("Deploy Survey", "கணக்கெடுப்பை வரிசைப்படுத்து");
        ta.put("Survey Response Heatmap", "கணக்கெடுப்பு பதில் வரைபடம்");
        ta.put("Assigned Regions", "ஒதுக்கப்பட்ட பகுதிகள்");
        ta.put("Active Data Collection", "செயலில் உள்ள தரவு சேகరిப்பு");
        ta.put("Short Text", "சிறிய உரை");
        ta.put("Long Text", "நீண்ட உரை");
        ta.put("Number", "எண்");
        ta.put("Single Select", "ஒற்றை தேர்வு");
        ta.put("Multi Select", "பல தேர்வு");
        ta.put("Dropdown", "கீழ்தோன்றும்");
        ta.put("Date", "தேதி");
        ta.put("GPS Location", "ஜிபிஎஸ் இடம்");
        ta.put("Image Upload", "படம் பதிவேற்றம்");
        ta.put("Audio Response", "ஆடியோ பதில்");
        ta.put("Matrix Question", "அணி கேள்வி");
        DICTIONARY.put("ta", ta);

        // Telugu translations
        Map<String, String> te = new HashMap<>();
        te.put("Dashboard Overview", "డాష్‌బోర్డ్ అవలోకనం");
        te.put("AI Survey Builder", "AI సర్వే బిల్డర్");
        te.put("Survey Import Center", "సర్వే దిగుమతి కేంద్రం");
        te.put("Question Bank", "ప్రశ్నల బ్యాంక్");
        te.put("Survey Registry", "సర్వే రిజిస్ట్రీ");
        te.put("Deployment Center", "విస్తరణ కేంద్రం");
        te.put("Monitoring Hub", "పర్యవేక్షణ కేంద్రం");
        te.put("AI Insights", "AI అంతర్దృష్టులు");
        te.put("User Management", "వినియోగదారు నిర్వహణ");
        te.put("Survey Quality Controls", "సర్వే నాణ్యత నియంత్రణలు");
        te.put("Sign Out", "నిష్క్రమించు");
        te.put("Portal Settings", "పోర్టల్ సెట్టింగులు");
        te.put("National Data Gateway", "జాతీయ డేటా గేట్‌వే");
        te.put("Create New Survey", "కొత్త సర్వే సృష్టించు");
        te.put("Official User", "అధికారిక వినియోగదారు");
        te.put("admin Session Active", "అడ్మిన్ సెషన్ యాక్టివ్");
        te.put("Back", "వెనుకకు");
        te.put("Nodal Officer Panel", "నోడల్ అధికారి ప్యానెల్");
        te.put("System", "సిస్టమ్");
        te.put("Digital India", "డిజిల్ ఇండియా");
        te.put("Survey Portal", "సర్వే పోర్టల్");
        te.put("Login", "లాగిన్");
        te.put("Dashboard", "డాష్‌బోర్డ్");
        te.put("Active Surveys", "యాక్టివ్ సర్వేలు");
        te.put("Published Surveys", "ప్రచురించిన సర్వేలు");
        te.put("Total Responses", "మొత్తం ప్రతిస్పందనలు");
        te.put("District Coverage", "జిల్లా కవరేజ్");
        te.put("Active Enumerators", "యాక్టివ్ ఎన్యూమరేటర్లు");
        te.put("National Economic Survey Q1", "జాతీయ ఆర్థిక సర్వే Q1");
        te.put("Rural Health Assessment", "గ్రామీణ ఆరోగ్య అంచనా");
        te.put("Agricultural Equipment Census", "వ్యవసాయ పరికరాల జనాభా గణన");
        te.put("Urban Employment Index", "పట్టణ ఉపాధి సూచిక");
        te.put("Education Infrastructure", "విద్యా మౌలిక సదుపాయాలు");
        te.put("Survey Details", "సర్వే వివరాలు");
        te.put("Version", "వెర్షన్");
        te.put("Status", "స్థితి");
        te.put("Created By", "సృష్టించినది");
        te.put("Responses", "ప్రతిస్పందనలు");
        te.put("Published", "ప్రచురించబడింది");
        te.put("Actions", "చర్యలు");
        te.put("Search surveys...", "సర్వేలను శోధించండి...");
        te.put("Preview", "ప్రివ్యూ");
        te.put("Survey Settings", "సర్వే సెట్టింగులు");
        te.put("Save Draft", "డ్రాఫ్ట్ సేవ్ చేయి");
        te.put("Publish Survey", "సర్వే ప్రచురించు");
        te.put("Generate with AI", "AI తో సృష్టించు");
        te.put("Question Types", "ప్రశ్న రకాలు");
        te.put("Add Section", "విభాగం జోడించు");
        te.put("Survey Title", "సర్వే శీర్షిక");
        te.put("Start Building Your Survey", "మీ సర్వే నిర్మించడం ప్రారంభించండి");
        te.put("Drafts", "డ్రాఫ్ట్‌లు");
        te.put("Closed", "మూసివేయబడింది");
        te.put("Archived", "ఆర్కైవ్ చేయబడింది");
        te.put("All", "అన్నీ");
        te.put("MoSPI Standard: Household Survey", "MoSPI ప్రమాణం: గృహ సర్వే");
        te.put("Deployment Configuration", "విస్తరణ కాన్ఫిగరేషన్");
        te.put("Delivery Channels", "డెలివరీ ఛానెల్‌లు");
        te.put("Quick Select", "త్వరిత ఎంపిక");
        te.put("National Rollout", "జాతీయ రోలౌట్");
        te.put("Entire South Zone", "దక్షిణ జోన్ మొత్తం");
        te.put("Entire North Zone", "ఉత్తర జోన్ మొత్తం");
        te.put("Clear Selection", "ఎంపికను క్లియర్ చేయి");
        te.put("Geographic Tree Selection", "భౌగోళిక వృక్ష ఎంపిక");
        te.put("Deploy Survey", "సర్వే ప్రచురించు");
        te.put("Survey Response Heatmap", "సర్వే ప్రతిస్పందన హీట్‌మ్యాప్");
        te.put("Assigned Regions", "కేటాయించిన ప్రాంతాలు");
        te.put("Active Data Collection", "యాక్టివ్ డేటా సేకరణ");
        te.put("Short Text", "చిన్న వచనం");
        te.put("Long Text", "పొడవైన వచనం");
        te.put("Number", "సంఖ్య");
        te.put("Single Select", "ఒకే ఎంపిక");
        te.put("Multi Select", "బహుళ ఎంపిక");
        te.put("Dropdown", "డ్రాప్‌డౌన్");
        te.put("Date", "తేదీ");
        te.put("GPS Location", "GPS స్థానం");
        te.put("Image Upload", "చిత్రం అప్‌లోడ్");
        te.put("Audio Response", "ఆడియో ప్రతిస్పందన");
        te.put("Matrix Question", "మాతృక ప్రశ్న");
        DICTIONARY.put("te", te);
    }

    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> translateBatch(@RequestBody Map<String, Object> payload) {
        List<String> texts = (List<String>) payload.get("texts");
        String targetLanguage = (String) payload.get("targetLanguage");

        List<String> translations = new ArrayList<>();
        Map<String, String> langDict = DICTIONARY.get(targetLanguage);

        if (texts != null) {
            for (String text : texts) {
                if (text == null) {
                    translations.add("");
                    continue;
                }
                String clean = text.trim();
                String translated = null;
                if (langDict != null) {
                    translated = langDict.get(clean);
                    if (translated == null) {
                        // case-insensitive check
                        String lower = clean.toLowerCase();
                        for (Map.Entry<String, String> entry : langDict.entrySet()) {
                            if (entry.getKey().toLowerCase().equals(lower)) {
                                translated = entry.getValue();
                                break;
                            }
                        }
                    }
                }
                translations.add(translated != null ? translated : text);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("translations", translations);
        return ResponseEntity.ok(response);
    }
}
