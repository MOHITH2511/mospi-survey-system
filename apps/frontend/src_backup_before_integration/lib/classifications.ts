/**
 * MoSPI Metadata Standards and Classification Codes
 * Includes NCO, NIC, ISIC and Economic Indicators
 */

export interface ClassificationCode {
  code: string;
  label: { en: string; hi: string };
  description?: { en: string; hi: string };
  category?: string;
}

/**
 * NCO - National Classification of Occupations (Based on NCO-2015)
 * Aligned with ISCO-08
 */
export const NCO_CODES: ClassificationCode[] = [
  // Major Group 1: Managers
  { code: "NCO-1000", label: { en: "Managers", hi: "प्रबंधक" }, category: "Major Group 1" },
  { code: "NCO-1110", label: { en: "Chief Executives, Senior Officials and Legislators", hi: "मुख्य कार्यकारी, वरिष्ठ अधिकारी और विधायक" }, category: "Chief Executives" },
  { code: "NCO-1120", label: { en: "Administrative and Commercial Managers", hi: "प्रशासनिक और वाणिज्यिक प्रबंधक" }, category: "Managers" },
  { code: "NCO-1211", label: { en: "Finance Managers", hi: "वित्त प्रबंधक" }, category: "Functional Managers" },
  { code: "NCO-1212", label: { en: "Human Resource Managers", hi: "मानव संसाधन प्रबंधक" }, category: "Functional Managers" },
  { code: "NCO-1213", label: { en: "Policy and Planning Managers", hi: "नीति और योजना प्रबंधक" }, category: "Functional Managers" },
  { code: "NCO-1219", label: { en: "Business Services and Administration Managers", hi: "व्यवसाय सेवा और प्रशासन प्रबंधक" }, category: "Managers" },
  
  // Major Group 2: Professionals
  { code: "NCO-2000", label: { en: "Professionals", hi: "पेशेवर" }, category: "Major Group 2" },
  { code: "NCO-2111", label: { en: "Physicists and Astronomers", hi: "भौतिक विज्ञानी और खगोलविद" }, category: "Science Professionals" },
  { code: "NCO-2120", label: { en: "Mathematicians, Actuaries and Statisticians", hi: "गणितज्ञ, बीमांकक और सांख्यिकीविद" }, category: "Science Professionals" },
  { code: "NCO-2141", label: { en: "Industrial and Production Engineers", hi: "औद्योगिक और उत्पादन इंजीनियर" }, category: "Engineering Professionals" },
  { code: "NCO-2142", label: { en: "Civil Engineers", hi: "सिविल इंजीनियर" }, category: "Engineering Professionals" },
  { code: "NCO-2143", label: { en: "Environmental Engineers", hi: "पर्यावरण इंजीनियर" }, category: "Engineering Professionals" },
  { code: "NCO-2144", label: { en: "Mechanical Engineers", hi: "यांत्रिक इंजीनियर" }, category: "Engineering Professionals" },
  { code: "NCO-2145", label: { en: "Chemical Engineers", hi: "रासायनिक इंजीनियर" }, category: "Engineering Professionals" },
  { code: "NCO-2146", label: { en: "Mining Engineers and Metallurgists", hi: "खनन इंजीनियर और धातुकर्मी" }, category: "Engineering Professionals" },
  { code: "NCO-2149", label: { en: "Engineering Professionals Not Elsewhere Classified", hi: "इंजीनियरिंग पेशेवर अन्यत्र वर्गीकृत नहीं" }, category: "Engineering Professionals" },
  { code: "NCO-2211", label: { en: "Generalist Medical Practitioners", hi: "सामान्य चिकित्सक" }, category: "Health Professionals" },
  { code: "NCO-2212", label: { en: "Specialist Medical Practitioners", hi: "विशेषज्ञ चिकित्सक" }, category: "Health Professionals" },
  { code: "NCO-2221", label: { en: "Nursing Professionals", hi: "नर्सिंग पेशेवर" }, category: "Health Professionals" },
  { code: "NCO-2310", label: { en: "University and Higher Education Teachers", hi: "विश्वविद्यालय और उच्च शिक्षा शिक्षक" }, category: "Teaching Professionals" },
  { code: "NCO-2320", label: { en: "Vocational Education Teachers", hi: "व्यावसायिक शिक्षा शिक्षक" }, category: "Teaching Professionals" },
  { code: "NCO-2330", label: { en: "Secondary Education Teachers", hi: "माध्यमिक शिक्षा शिक्षक" }, category: "Teaching Professionals" },
  { code: "NCO-2341", label: { en: "Primary School Teachers", hi: "प्राथमिक विद्यालय शिक्षक" }, category: "Teaching Professionals" },
  { code: "NCO-2342", label: { en: "Early Childhood Educators", hi: "प्रारंभिक बचपन शिक्षक" }, category: "Teaching Professionals" },
  { code: "NCO-2511", label: { en: "Systems Analysts", hi: "सिस्टम विश्लेषक" }, category: "ICT Professionals" },
  { code: "NCO-2512", label: { en: "Software Developers", hi: "सॉफ्टवेयर डेवलपर्स" }, category: "ICT Professionals" },
  { code: "NCO-2513", label: { en: "Web and Multimedia Developers", hi: "वेब और मल्टीमीडिया डेवलपर्स" }, category: "ICT Professionals" },
  { code: "NCO-2514", label: { en: "Applications Programmers", hi: "एप्लिकेशन प्रोग्रामर" }, category: "ICT Professionals" },
  { code: "NCO-2519", label: { en: "Software and Applications Developers and Analysts", hi: "सॉफ्टवेयर और एप्लिकेशन डेवलपर्स और विश्लेषक" }, category: "ICT Professionals" },
  { code: "NCO-2611", label: { en: "Lawyers", hi: "वकील" }, category: "Legal Professionals" },
  { code: "NCO-2619", label: { en: "Legal Professionals Not Elsewhere Classified", hi: "कानूनी पेशेवर अन्यत्र वर्गीकृत नहीं" }, category: "Legal Professionals" },
  
  // Major Group 3: Technicians and Associate Professionals
  { code: "NCO-3000", label: { en: "Technicians and Associate Professionals", hi: "तकनीशियन और सहयोगी पेशेवर" }, category: "Major Group 3" },
  { code: "NCO-3111", label: { en: "Chemical and Physical Science Technicians", hi: "रासायनिक और भौतिक विज्ञान तकनीशियन" }, category: "Science Technicians" },
  { code: "NCO-3112", label: { en: "Civil Engineering Technicians", hi: "सिविल इंजीनियरिंग तकनीशियन" }, category: "Engineering Technicians" },
  { code: "NCO-3113", label: { en: "Electrical Engineering Technicians", hi: "विद्युत इंजीनियरिंग तकनीशियन" }, category: "Engineering Technicians" },
  { code: "NCO-3114", label: { en: "Electronics Engineering Technicians", hi: "इलेक्ट्रॉनिक्स इंजीनियरिंग तकनीशियन" }, category: "Engineering Technicians" },
  { code: "NCO-3115", label: { en: "Mechanical Engineering Technicians", hi: "यांत्रिक इंजीनियरिंग तकनीशियन" }, category: "Engineering Technicians" },
  { code: "NCO-3211", label: { en: "Medical Imaging and Therapeutic Equipment Technicians", hi: "चिकित्सा इमेजिंग और चिकित्सीय उपकरण तकनीशियन" }, category: "Health Associate Professionals" },
  { code: "NCO-3221", label: { en: "Nursing Associate Professionals", hi: "नर्सिंग सहयोगी पेशेवर" }, category: "Health Associate Professionals" },
  { code: "NCO-3251", label: { en: "Dental Assistants and Therapists", hi: "दंत चिकित्सा सहायक और चिकित्सक" }, category: "Health Associate Professionals" },
  { code: "NCO-3311", label: { en: "Securities and Finance Dealers and Brokers", hi: "प्रतिभूति और वित्त डीलर और दलाल" }, category: "Business Associate Professionals" },
  { code: "NCO-3312", label: { en: "Credit and Loans Officers", hi: "क्रेडिट और ऋण अधिकारी" }, category: "Business Associate Professionals" },
  { code: "NCO-3313", label: { en: "Accounting Associate Professionals", hi: "लेखा सहयोगी पेशेवर" }, category: "Business Associate Professionals" },
  { code: "NCO-3511", label: { en: "ICT Operations Technicians", hi: "आईसीटी संचालन तकनीशियन" }, category: "ICT Technicians" },
  { code: "NCO-3512", label: { en: "ICT User Support Technicians", hi: "आईसीटी उपयोगकर्ता सहायता तकनीशियन" }, category: "ICT Technicians" },
  
  // Major Group 4: Clerical Support Workers
  { code: "NCO-4000", label: { en: "Clerical Support Workers", hi: "लिपिक सहायता कार्यकर्ता" }, category: "Major Group 4" },
  { code: "NCO-4110", label: { en: "General Office Clerks", hi: "सामान्य कार्यालय क्लर्क" }, category: "Office Clerks" },
  { code: "NCO-4120", label: { en: "Secretaries (general)", hi: "सचिव (सामान्य)" }, category: "Office Clerks" },
  { code: "NCO-4131", label: { en: "Typists and Word Processing Operators", hi: "टाइपिस्ट और वर्ड प्रोसेसिंग ऑपरेटर" }, category: "Office Clerks" },
  { code: "NCO-4132", label: { en: "Data Entry Clerks", hi: "डेटा एंट्री क्लर्क" }, category: "Office Clerks" },
  { code: "NCO-4211", label: { en: "Bank Tellers and Related Clerks", hi: "बैंक टेलर और संबंधित क्लर्क" }, category: "Customer Service Clerks" },
  { code: "NCO-4212", label: { en: "Bookmakers, Croupiers and Related Gaming Workers", hi: "सट्टेबाज, क्रूपियर और संबंधित गेमिंग कार्यकर्ता" }, category: "Customer Service Clerks" },
  { code: "NCO-4213", label: { en: "Pawnbrokers and Money-lenders", hi: "गिरवी रखने वाले और साहूकार" }, category: "Customer Service Clerks" },
  { code: "NCO-4214", label: { en: "Debt-collectors and Related Workers", hi: "ऋण वसूलने वाले और संबंधित कार्यकर्ता" }, category: "Customer Service Clerks" },
  { code: "NCO-4221", label: { en: "Travel Consultants and Clerks", hi: "यात्रा सलाहकार और क्लर्क" }, category: "Customer Service Clerks" },
  { code: "NCO-4222", label: { en: "Contact Centre Information Clerks", hi: "संपर्क केंद्र सूचना क्लर्क" }, category: "Customer Service Clerks" },
  { code: "NCO-4223", label: { en: "Telephone Switchboard Operators", hi: "टेलीफोन स्विचबोर्ड ऑपरेटर" }, category: "Customer Service Clerks" },
  
  // Major Group 5: Service and Sales Workers
  { code: "NCO-5000", label: { en: "Service and Sales Workers", hi: "सेवा और बिक्री कार्यकर्ता" }, category: "Major Group 5" },
  { code: "NCO-5111", label: { en: "Travel Attendants and Travel Stewards", hi: "यात्रा परिचारक और यात्रा प्रबंधक" }, category: "Personal Service Workers" },
  { code: "NCO-5112", label: { en: "Transport Conductors", hi: "परिवहन कंडक्टर" }, category: "Personal Service Workers" },
  { code: "NCO-5113", label: { en: "Travel Guides", hi: "यात्रा गाइड" }, category: "Personal Service Workers" },
  { code: "NCO-5120", label: { en: "Cooks", hi: "रसोइया" }, category: "Personal Service Workers" },
  { code: "NCO-5131", label: { en: "Waiters", hi: "वेटर" }, category: "Personal Service Workers" },
  { code: "NCO-5132", label: { en: "Bartenders", hi: "बारटेंडर" }, category: "Personal Service Workers" },
  { code: "NCO-5151", label: { en: "Cleaning and Housekeeping Supervisors in Offices, Hotels", hi: "कार्यालयों, होटलों में सफाई और गृहस्थी पर्यवेक्षक" }, category: "Personal Service Workers" },
  { code: "NCO-5152", label: { en: "Domestic Housekeepers", hi: "घरेलू गृहकर्मी" }, category: "Personal Service Workers" },
  { code: "NCO-5153", label: { en: "Building Caretakers", hi: "भवन रखवाले" }, category: "Personal Service Workers" },
  { code: "NCO-5161", label: { en: "Astrologers, Fortune-tellers and Related Workers", hi: "ज्योतिषी, भविष्य बताने वाले और संबंधित कार्यकर्ता" }, category: "Personal Service Workers" },
  { code: "NCO-5162", label: { en: "Companions and Valets", hi: "साथी और सेवक" }, category: "Personal Service Workers" },
  { code: "NCO-5163", label: { en: "Undertakers and Embalmers", hi: "अंत्येष्टि करने वाले और शव संरक्षक" }, category: "Personal Service Workers" },
  { code: "NCO-5164", label: { en: "Pet Groomers and Animal Care Workers", hi: "पालतू पशु संवारने वाले और पशु देखभाल कार्यकर्ता" }, category: "Personal Service Workers" },
  { code: "NCO-5165", label: { en: "Driving Instructors", hi: "ड्राइविंग प्रशिक्षक" }, category: "Personal Service Workers" },
  { code: "NCO-5169", label: { en: "Personal Services Workers Not Elsewhere Classified", hi: "व्यक्तिगत सेवा कार्यकर्ता अन्यत्र वर्गीकृत नहीं" }, category: "Personal Service Workers" },
  { code: "NCO-5211", label: { en: "Stall and Market Salespersons", hi: "स्टॉल और बाजार विक्रेता" }, category: "Sales Workers" },
  { code: "NCO-5212", label: { en: "Street Food Salespersons", hi: "स्ट्रीट फूड विक्रेता" }, category: "Sales Workers" },
  { code: "NCO-5221", label: { en: "Shop Keepers", hi: "दुकानदार" }, category: "Sales Workers" },
  { code: "NCO-5222", label: { en: "Shop Supervisors", hi: "दुकान पर्यवेक्षक" }, category: "Sales Workers" },
  { code: "NCO-5223", label: { en: "Shop Sales Assistants", hi: "दुकान बिक्री सहायक" }, category: "Sales Workers" },
  { code: "NCO-5230", label: { en: "Cashiers and Ticket Clerks", hi: "कैशियर और टिकट क्लर्क" }, category: "Sales Workers" },
  { code: "NCO-5241", label: { en: "Fashion and Other Models", hi: "फैशन और अन्य मॉडल" }, category: "Sales Workers" },
  { code: "NCO-5242", label: { en: "Sales Demonstrators", hi: "बिक्री प्रदर्शनकर्ता" }, category: "Sales Workers" },
  { code: "NCO-5243", label: { en: "Door to Door Salespersons", hi: "घर-घर बिक्री करने वाले" }, category: "Sales Workers" },
  { code: "NCO-5244", label: { en: "Contact Centre Salespersons", hi: "संपर्क केंद्र विक्रेता" }, category: "Sales Workers" },
  { code: "NCO-5245", label: { en: "Service Station Attendants", hi: "सेवा केंद्र परिचारक" }, category: "Sales Workers" },
  { code: "NCO-5246", label: { en: "Food Service Counter Attendants", hi: "खाद्य सेवा काउंटर परिचारक" }, category: "Sales Workers" },
  
  // Major Group 6: Skilled Agricultural and Fishery Workers
  { code: "NCO-6000", label: { en: "Skilled Agricultural and Fishery Workers", hi: "कुशल कृषि और मत्स्य पालन कार्यकर्ता" }, category: "Major Group 6" },
  { code: "NCO-6111", label: { en: "Field Crop and Vegetable Growers", hi: "खेती और सब्जी उत्पादक" }, category: "Agricultural Workers" },
  { code: "NCO-6112", label: { en: "Tree and Shrub Crop Growers", hi: "वृक्ष और झाड़ी फसल उत्पादक" }, category: "Agricultural Workers" },
  { code: "NCO-6113", label: { en: "Gardeners, Horticultural and Nursery Growers", hi: "माली, बागवानी और नर्सरी उत्पादक" }, category: "Agricultural Workers" },
  { code: "NCO-6114", label: { en: "Mixed Crop Growers", hi: "मिश्रित फसल उत्पादक" }, category: "Agricultural Workers" },
  { code: "NCO-6121", label: { en: "Livestock and Dairy Producers", hi: "पशुधन और डेयरी उत्पादक" }, category: "Animal Producers" },
  { code: "NCO-6122", label: { en: "Poultry Producers", hi: "मुर्गी पालन उत्पादक" }, category: "Animal Producers" },
  { code: "NCO-6123", label: { en: "Apiarists and Sericulturists", hi: "मधुमक्खी पालक और रेशम उत्पादक" }, category: "Animal Producers" },
  { code: "NCO-6210", label: { en: "Forestry and Related Workers", hi: "वानिकी और संबंधित कार्यकर्ता" }, category: "Forestry Workers" },
  { code: "NCO-6221", label: { en: "Aquaculture Workers", hi: "जलीय कृषि कार्यकर्ता" }, category: "Fishery Workers" },
  { code: "NCO-6222", label: { en: "Inland and Coastal Waters Fishery Workers", hi: "अंतर्देशीय और तटीय जल मत्स्य पालन कार्यकर्ता" }, category: "Fishery Workers" },
  { code: "NCO-6223", label: { en: "Deep-Sea Fishery Workers", hi: "गहरे समुद्र मत्स्य पालन कार्यकर्ता" }, category: "Fishery Workers" },
  { code: "NCO-6224", label: { en: "Hunters and Trappers", hi: "शिकारी और जाल लगाने वाले" }, category: "Fishery Workers" },
  { code: "NCO-6310", label: { en: "Subsistence Crop Farmers", hi: "निर्वाह फसल किसान" }, category: "Subsistence Farmers" },
  { code: "NCO-6320", label: { en: "Subsistence Livestock Farmers", hi: "निर्वाह पशुधन किसान" }, category: "Subsistence Farmers" },
  
  // Major Group 7: Craft and Related Trades Workers
  { code: "NCO-7000", label: { en: "Craft and Related Trades Workers", hi: "शिल्प और संबंधित व्यापार कार्यकर्ता" }, category: "Major Group 7" },
  { code: "NCO-7111", label: { en: "House Builders", hi: "घर निर्माता" }, category: "Building Workers" },
  { code: "NCO-7112", label: { en: "Bricklayers and Related Workers", hi: "राजमिस्त्री और संबंधित कार्यकर्ता" }, category: "Building Workers" },
  { code: "NCO-7113", label: { en: "Stonemasons, Stone Cutters, Splitters and Carvers", hi: "पत्थर का काम करने वाले, पत्थर काटने वाले, फाड़ने वाले और नक्काशी करने वाले" }, category: "Building Workers" },
  { code: "NCO-7114", label: { en: "Concrete Placers, Concrete Finishers and Related Workers", hi: "कंक्रीट लगाने वाले, कंक्रीट फिनिशर और संबंधित कार्यकर्ता" }, category: "Building Workers" },
  { code: "NCO-7115", label: { en: "Carpenters and Joiners", hi: "बढ़ई और जोड़ लगाने वाले" }, category: "Building Workers" },
  { code: "NCO-7119", label: { en: "Building Frame and Related Trades Workers", hi: "भवन फ्रेम और संबंधित व्यापार कार्यकर्ता" }, category: "Building Workers" },
  { code: "NCO-7121", label: { en: "Roofers", hi: "छत बनाने वाले" }, category: "Building Finishers" },
  { code: "NCO-7122", label: { en: "Floor Layers and Tile Setters", hi: "फर्श बिछाने वाले और टाइल लगाने वाले" }, category: "Building Finishers" },
  { code: "NCO-7123", label: { en: "Plasterers", hi: "प्लास्टर करने वाले" }, category: "Building Finishers" },
  { code: "NCO-7124", label: { en: "Insulation Workers", hi: "इन्सुलेशन कार्यकर्ता" }, category: "Building Finishers" },
  { code: "NCO-7125", label: { en: "Glaziers", hi: "कांच लगाने वाले" }, category: "Building Finishers" },
  { code: "NCO-7126", label: { en: "Plumbers and Pipe Fitters", hi: "नलसाज और पाइप फिटर" }, category: "Building Finishers" },
  { code: "NCO-7127", label: { en: "Air Conditioning and Refrigeration Mechanics", hi: "एयर कंडीशनिंग और रेफ्रिजरेशन मैकेनिक" }, category: "Building Finishers" },
  { code: "NCO-7211", label: { en: "Metal Moulders and Coremakers", hi: "धातु साँचा बनाने वाले और कोर बनाने वाले" }, category: "Metal Workers" },
  { code: "NCO-7212", label: { en: "Welders and Flamecutters", hi: "वेल्डर और फ्लेमकटर" }, category: "Metal Workers" },
  { code: "NCO-7213", label: { en: "Sheet Metal Workers", hi: "शीट मेटल कार्यकर्ता" }, category: "Metal Workers" },
  { code: "NCO-7214", label: { en: "Structural Metal Preparers and Erectors", hi: "संरचनात्मक धातु तैयार करने वाले और खड़ा करने वाले" }, category: "Metal Workers" },
  { code: "NCO-7215", label: { en: "Riggers and Cable Splicers", hi: "रिगर और केबल जोड़ने वाले" }, category: "Metal Workers" },
  
  // Major Group 8: Plant and Machine Operators
  { code: "NCO-8000", label: { en: "Plant and Machine Operators and Assemblers", hi: "संयंत्र और मशीन ऑपरेटर और असेंबलर" }, category: "Major Group 8" },
  { code: "NCO-8111", label: { en: "Miners and Quarriers", hi: "खनिक और खदान कार्यकर्ता" }, category: "Stationary Plant Operators" },
  { code: "NCO-8112", label: { en: "Mineral and Stone Processing Plant Operators", hi: "खनिज और पत्थर प्रसंस्करण संयंत्र ऑपरेटर" }, category: "Stationary Plant Operators" },
  { code: "NCO-8113", label: { en: "Well Drillers and Borers and Related Workers", hi: "कुआं ड्रिलर और बोर करने वाले और संबंधित कार्यकर्ता" }, category: "Stationary Plant Operators" },
  { code: "NCO-8121", label: { en: "Metal Processing Plant Operators", hi: "धातु प्रसंस्करण संयंत्र ऑपरेटर" }, category: "Stationary Plant Operators" },
  { code: "NCO-8131", label: { en: "Chemical Products Plant and Machine Operators", hi: "रासायनिक उत्पाद संयंत्र और मशीन ऑपरेटर" }, category: "Stationary Plant Operators" },
  { code: "NCO-8160", label: { en: "Power Production Plant Operators", hi: "विद्युत उत्पादन संयंत्र ऑपरेटर" }, category: "Stationary Plant Operators" },
  { code: "NCO-8311", label: { en: "Locomotive Engine Drivers", hi: "लोकोमोटिव इंजन चालक" }, category: "Drivers and Mobile Plant Operators" },
  { code: "NCO-8312", label: { en: "Railway Brake, Signal and Switch Operators", hi: "रेलवे ब्रेक, सिग्नल और स्विच ऑपरेटर" }, category: "Drivers and Mobile Plant Operators" },
  { code: "NCO-8321", label: { en: "Motorcycle Drivers", hi: "मोटरसाइकिल चालक" }, category: "Drivers and Mobile Plant Operators" },
  { code: "NCO-8322", label: { en: "Car, Taxi and Van Drivers", hi: "कार, टैक्सी और वैन चालक" }, category: "Drivers and Mobile Plant Operators" },
  { code: "NCO-8323", label: { en: "Bus and Tram Drivers", hi: "बस और ट्राम चालक" }, category: "Drivers and Mobile Plant Operators" },
  { code: "NCO-8324", label: { en: "Heavy Truck and Lorry Drivers", hi: "भारी ट्रक और लॉरी चालक" }, category: "Drivers and Mobile Plant Operators" },
  
  // Major Group 9: Elementary Occupations
  { code: "NCO-9000", label: { en: "Elementary Occupations", hi: "प्राथमिक व्यवसाय" }, category: "Major Group 9" },
  { code: "NCO-9111", label: { en: "Domestic Cleaners and Helpers", hi: "घरेलू सफाई कर्मचारी और सहायक" }, category: "Cleaners and Helpers" },
  { code: "NCO-9112", label: { en: "Cleaners and Helpers in Offices, Hotels", hi: "कार्यालयों, होटलों में सफाई कर्मचारी और सहायक" }, category: "Cleaners and Helpers" },
  { code: "NCO-9121", label: { en: "Hand Launderers and Pressers", hi: "हाथ से कपड़े धोने वाले और प्रेस करने वाले" }, category: "Cleaners and Helpers" },
  { code: "NCO-9122", label: { en: "Vehicle Cleaners", hi: "वाहन सफाई कर्मचारी" }, category: "Cleaners and Helpers" },
  { code: "NCO-9123", label: { en: "Window Cleaners", hi: "खिड़की सफाई कर्मचारी" }, category: "Cleaners and Helpers" },
  { code: "NCO-9129", label: { en: "Other Cleaning Workers", hi: "अन्य सफाई कार्यकर्ता" }, category: "Cleaners and Helpers" },
  { code: "NCO-9211", label: { en: "Crop Farm Labourers", hi: "फसल खेत मजदूर" }, category: "Agricultural Labourers" },
  { code: "NCO-9212", label: { en: "Livestock Farm Labourers", hi: "पशुधन खेत मजदूर" }, category: "Agricultural Labourers" },
  { code: "NCO-9213", label: { en: "Mixed Crop and Livestock Farm Labourers", hi: "मिश्रित फसल और पशुधन खेत मजदूर" }, category: "Agricultural Labourers" },
  { code: "NCO-9214", label: { en: "Gardening and Horticultural Labourers", hi: "बागवानी और उद्यान मजदूर" }, category: "Agricultural Labourers" },
  { code: "NCO-9215", label: { en: "Forestry Labourers", hi: "वानिकी मजदूर" }, category: "Agricultural Labourers" },
  { code: "NCO-9216", label: { en: "Fishery and Aquaculture Labourers", hi: "मत्स्य पालन और जलीय कृषि मजदूर" }, category: "Agricultural Labourers" },
  { code: "NCO-9311", label: { en: "Mining and Quarrying Labourers", hi: "खनन और खदान मजदूर" }, category: "Labourers in Mining" },
  { code: "NCO-9312", label: { en: "Construction and Maintenance Labourers", hi: "निर्माण और रखरखाव मजदूर" }, category: "Labourers in Construction" },
  { code: "NCO-9313", label: { en: "Manufacturing Labourers", hi: "विनिर्माण मजदूर" }, category: "Labourers in Manufacturing" },
  { code: "NCO-9321", label: { en: "Hand Packers", hi: "हाथ से पैकिंग करने वाले" }, category: "Transport and Storage Labourers" },
  { code: "NCO-9329", label: { en: "Manufacturing Labourers Not Elsewhere Classified", hi: "विनिर्माण मजदूर अन्यत्र वर्गीकृत नहीं" }, category: "Transport and Storage Labourers" },
  { code: "NCO-9411", label: { en: "Fast Food Preparers", hi: "फास्ट फूड तैयार करने वाले" }, category: "Food Preparation Assistants" },
  { code: "NCO-9412", label: { en: "Kitchen Helpers", hi: "रसोई सहायक" }, category: "Food Preparation Assistants" },
  { code: "NCO-9510", label: { en: "Street and Related Services Workers", hi: "सड़क और संबंधित सेवा कार्यकर्ता" }, category: "Street Services Workers" },
  { code: "NCO-9520", label: { en: "Street Vendors (excluding Food)", hi: "सड़क विक्रेता (भोजन को छोड़कर)" }, category: "Street Services Workers" },
  { code: "NCO-9611", label: { en: "Garbage and Recycling Collectors", hi: "कचरा और पुनर्चक्रण संग्रहकर्ता" }, category: "Refuse Workers" },
  { code: "NCO-9612", label: { en: "Refuse Sorters", hi: "कचरा छाँटने वाले" }, category: "Refuse Workers" },
  { code: "NCO-9613", label: { en: "Sweepers and Related Labourers", hi: "सफाई कर्मचारी और संबंधित मजदूर" }, category: "Refuse Workers" },
  { code: "NCO-9621", label: { en: "Messengers, Package Deliverers and Luggage Porters", hi: "संदेशवाहक, पैकेज वितरण कर्ता और सामान ढोने वाले" }, category: "Other Elementary Workers" },
  { code: "NCO-9622", label: { en: "Odd Job Persons", hi: "अजीब काम करने वाले व्यक्ति" }, category: "Other Elementary Workers" },
  { code: "NCO-9623", label: { en: "Meter Readers and Vending-machine Collectors", hi: "मीटर पाठक और वेंडिंग-मशीन संग्रहकर्ता" }, category: "Other Elementary Workers" },
  { code: "NCO-9624", label: { en: "Water and Firewood Collectors", hi: "पानी और जलाऊ लकड़ी संग्रहकर्ता" }, category: "Other Elementary Workers" },
];

/**
 * NIC - National Industrial Classification (Based on NIC-2008)
 * Aligned with ISIC Rev. 4
 */
export const NIC_CODES: ClassificationCode[] = [
  // Section A: Agriculture, Forestry and Fishing
  { code: "NIC-01", label: { en: "Crop and Animal Production, Hunting and Related Service Activities", hi: "फसल और पशु उत्पादन, शिकार और संबंधित सेवा गतिविधियाँ" }, category: "Section A" },
  { code: "NIC-011", label: { en: "Growing of Non-Perennial Crops", hi: "गैर-बारहमासी फसलों की खेती" }, category: "Agriculture" },
  { code: "NIC-012", label: { en: "Growing of Perennial Crops", hi: "बारहमासी फसलों की खेती" }, category: "Agriculture" },
  { code: "NIC-013", label: { en: "Plant Propagation", hi: "पौधा प्रसार" }, category: "Agriculture" },
  { code: "NIC-014", label: { en: "Animal Production", hi: "पशु उत्पादन" }, category: "Agriculture" },
  { code: "NIC-015", label: { en: "Mixed Farming", hi: "मिश्रित खेती" }, category: "Agriculture" },
  { code: "NIC-016", label: { en: "Support Activities to Agriculture and Post-Harvest Crop Activities", hi: "कृषि के लिए सहायता गतिविधियाँ और फसल कटाई के बाद की गतिविधियाँ" }, category: "Agriculture" },
  { code: "NIC-02", label: { en: "Forestry and Logging", hi: "वानिकी और लॉगिंग" }, category: "Section A" },
  { code: "NIC-03", label: { en: "Fishing and Aquaculture", hi: "मत्स्य पालन और जलीय कृषि" }, category: "Section A" },
  
  // Section B: Mining and Quarrying
  { code: "NIC-05", label: { en: "Mining of Coal and Lignite", hi: "कोयला और लिग्नाइट का खनन" }, category: "Section B" },
  { code: "NIC-06", label: { en: "Extraction of Crude Petroleum and Natural Gas", hi: "कच्चे पेट्रोलियम और प्राकृतिक गैस का निष्कर्षण" }, category: "Section B" },
  { code: "NIC-07", label: { en: "Mining of Metal Ores", hi: "धातु अयस्क का खनन" }, category: "Section B" },
  { code: "NIC-08", label: { en: "Other Mining and Quarrying", hi: "अन्य खनन और उत्खनन" }, category: "Section B" },
  { code: "NIC-09", label: { en: "Mining Support Service Activities", hi: "खनन सहायता सेवा गतिविधियाँ" }, category: "Section B" },
  
  // Section C: Manufacturing
  { code: "NIC-10", label: { en: "Manufacture of Food Products", hi: "खाद्य उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-11", label: { en: "Manufacture of Beverages", hi: "पेय पदार्थों का निर्माण" }, category: "Section C" },
  { code: "NIC-12", label: { en: "Manufacture of Tobacco Products", hi: "तंबाकू उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-13", label: { en: "Manufacture of Textiles", hi: "वस्त्र का निर्माण" }, category: "Section C" },
  { code: "NIC-14", label: { en: "Manufacture of Wearing Apparel", hi: "परिधान का निर्माण" }, category: "Section C" },
  { code: "NIC-15", label: { en: "Manufacture of Leather and Related Products", hi: "चमड़ा और संबंधित उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-16", label: { en: "Manufacture of Wood and Products of Wood and Cork", hi: "लकड़ी और लकड़ी और कॉर्क के उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-17", label: { en: "Manufacture of Paper and Paper Products", hi: "कागज और कागज उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-18", label: { en: "Printing and Reproduction of Recorded Media", hi: "मुद्रण और रिकॉर्ड मीडिया का पुनरुत्पादन" }, category: "Section C" },
  { code: "NIC-19", label: { en: "Manufacture of Coke and Refined Petroleum Products", hi: "कोक और परिष्कृत पेट्रोलियम उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-20", label: { en: "Manufacture of Chemicals and Chemical Products", hi: "रसायन और रासायनिक उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-21", label: { en: "Manufacture of Pharmaceuticals, Medicinal Chemical and Botanical Products", hi: "फार्मास्युटिकल्स, औषधीय रासायनिक और वनस्पति उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-22", label: { en: "Manufacture of Rubber and Plastics Products", hi: "रबर और प्लास्टिक उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-23", label: { en: "Manufacture of Other Non-Metallic Mineral Products", hi: "अन्य गैर-धातु खनिज उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-24", label: { en: "Manufacture of Basic Metals", hi: "मूल धातुओं का निर्माण" }, category: "Section C" },
  { code: "NIC-25", label: { en: "Manufacture of Fabricated Metal Products", hi: "निर्मित धातु उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-26", label: { en: "Manufacture of Computer, Electronic and Optical Products", hi: "कंप्यूटर, इलेक्ट्रॉनिक और ऑप्टिकल उत्पादों का निर्माण" }, category: "Section C" },
  { code: "NIC-27", label: { en: "Manufacture of Electrical Equipment", hi: "विद्युत उपकरण का निर्माण" }, category: "Section C" },
  { code: "NIC-28", label: { en: "Manufacture of Machinery and Equipment n.e.c.", hi: "मशीनरी और उपकरण का निर्माण" }, category: "Section C" },
  { code: "NIC-29", label: { en: "Manufacture of Motor Vehicles, Trailers and Semi-Trailers", hi: "मोटर वाहन, ट्रेलर और अर्ध-ट्रेलर का निर्माण" }, category: "Section C" },
  { code: "NIC-30", label: { en: "Manufacture of Other Transport Equipment", hi: "अन्य परिवहन उपकरण का निर्माण" }, category: "Section C" },
  { code: "NIC-31", label: { en: "Manufacture of Furniture", hi: "फर्नीचर का निर्माण" }, category: "Section C" },
  { code: "NIC-32", label: { en: "Other Manufacturing", hi: "अन्य विनिर्माण" }, category: "Section C" },
  { code: "NIC-33", label: { en: "Repair and Installation of Machinery and Equipment", hi: "मशीनरी और उपकरण की मरम्मत और स्थापना" }, category: "Section C" },
  
  // Section D: Electricity, Gas, Steam and Air Conditioning Supply
  { code: "NIC-35", label: { en: "Electricity, Gas, Steam and Air Conditioning Supply", hi: "बिजली, गैस, भाप और वातानुकूलन आपूर्ति" }, category: "Section D" },
  
  // Section E: Water Supply; Sewerage, Waste Management
  { code: "NIC-36", label: { en: "Water Collection, Treatment and Supply", hi: "जल संग्रह, उपचार और आपूर्ति" }, category: "Section E" },
  { code: "NIC-37", label: { en: "Sewerage", hi: "सीवरेज" }, category: "Section E" },
  { code: "NIC-38", label: { en: "Waste Collection, Treatment and Disposal Activities", hi: "कचरा संग्रह, उपचार और निपटान गतिविधियाँ" }, category: "Section E" },
  { code: "NIC-39", label: { en: "Remediation Activities and Other Waste Management Services", hi: "उपचार गतिविधियाँ और अन्य कचरा प्रबंधन सेवाएं" }, category: "Section E" },
  
  // Section F: Construction
  { code: "NIC-41", label: { en: "Construction of Buildings", hi: "भवनों का निर्माण" }, category: "Section F" },
  { code: "NIC-42", label: { en: "Civil Engineering", hi: "सिविल इंजीनियरिंग" }, category: "Section F" },
  { code: "NIC-43", label: { en: "Specialized Construction Activities", hi: "विशिष्ट निर्माण गतिविधियाँ" }, category: "Section F" },
  
  // Section G: Wholesale and Retail Trade
  { code: "NIC-45", label: { en: "Wholesale and Retail Trade and Repair of Motor Vehicles and Motorcycles", hi: "मोटर वाहन और मोटरसाइकिल का थोक और खुदरा व्यापार और मरम्मत" }, category: "Section G" },
  { code: "NIC-46", label: { en: "Wholesale Trade, Except of Motor Vehicles and Motorcycles", hi: "थोक व्यापार, मोटर वाहन और मोटरसाइकिल को छोड़कर" }, category: "Section G" },
  { code: "NIC-47", label: { en: "Retail Trade, Except of Motor Vehicles and Motorcycles", hi: "खुदरा व्यापार, मोटर वाहन और मोटरसाइकिल को छोड़कर" }, category: "Section G" },
  
  // Section H: Transportation and Storage
  { code: "NIC-49", label: { en: "Land Transport and Transport via Pipelines", hi: "भूमि परिवहन और पाइपलाइन के माध्यम से परिवहन" }, category: "Section H" },
  { code: "NIC-50", label: { en: "Water Transport", hi: "जल परिवहन" }, category: "Section H" },
  { code: "NIC-51", label: { en: "Air Transport", hi: "वायु परिवहन" }, category: "Section H" },
  { code: "NIC-52", label: { en: "Warehousing and Support Activities for Transportation", hi: "भंडारण और परिवहन के लिए सहायता गतिविधियाँ" }, category: "Section H" },
  { code: "NIC-53", label: { en: "Postal and Courier Activities", hi: "डाक और कूरियर गतिविधियाँ" }, category: "Section H" },
  
  // Section I: Accommodation and Food Service Activities
  { code: "NIC-55", label: { en: "Accommodation", hi: "आवास" }, category: "Section I" },
  { code: "NIC-56", label: { en: "Food and Beverage Service Activities", hi: "खाद्य और पेय सेवा गतिविधियाँ" }, category: "Section I" },
  
  // Section J: Information and Communication
  { code: "NIC-58", label: { en: "Publishing Activities", hi: "प्रकाशन गतिविधियाँ" }, category: "Section J" },
  { code: "NIC-59", label: { en: "Motion Picture, Video and Television Programme Production", hi: "मोशन पिक्चर, वीडियो और टेलीविजन कार्यक्रम उत्पादन" }, category: "Section J" },
  { code: "NIC-60", label: { en: "Programming and Broadcasting Activities", hi: "प्रोग्रामिंग और प्रसारण गतिविधियाँ" }, category: "Section J" },
  { code: "NIC-61", label: { en: "Telecommunications", hi: "दूरसंचार" }, category: "Section J" },
  { code: "NIC-62", label: { en: "Computer Programming, Consultancy and Related Activities", hi: "कंप्यूटर प्रोग्रामिंग, परामर्श और संबंधित गतिविधियाँ" }, category: "Section J" },
  { code: "NIC-63", label: { en: "Information Service Activities", hi: "सूचना सेवा गतिविधियाँ" }, category: "Section J" },
  
  // Section K: Financial and Insurance Activities
  { code: "NIC-64", label: { en: "Financial Service Activities, Except Insurance and Pension Funding", hi: "वित्तीय सेवा गतिविधियाँ, बीमा और पेंशन फंडिंग को छोड़कर" }, category: "Section K" },
  { code: "NIC-65", label: { en: "Insurance, Reinsurance and Pension Funding", hi: "बीमा, पुनर्बीमा और पेंशन फंडिंग" }, category: "Section K" },
  { code: "NIC-66", label: { en: "Activities Auxiliary to Financial Service and Insurance Activities", hi: "वित्तीय सेवा और बीमा गतिविधियों के लिए सहायक गतिविधियाँ" }, category: "Section K" },
  
  // Section L: Real Estate Activities
  { code: "NIC-68", label: { en: "Real Estate Activities", hi: "रियल एस्टेट गतिविधियाँ" }, category: "Section L" },
  
  // Section M: Professional, Scientific and Technical Activities
  { code: "NIC-69", label: { en: "Legal and Accounting Activities", hi: "कानूनी और लेखा गतिविधियाँ" }, category: "Section M" },
  { code: "NIC-70", label: { en: "Activities of Head Offices; Management Consultancy Activities", hi: "मुख्य कार्यालयों की गतिविधियाँ; प्रबंधन परामर्श गतिविधियाँ" }, category: "Section M" },
  { code: "NIC-71", label: { en: "Architectural and Engineering Activities", hi: "वास्तुकला और इंजीनियरिंग गतिविधियाँ" }, category: "Section M" },
  { code: "NIC-72", label: { en: "Scientific Research and Development", hi: "वैज्ञानिक अनुसंधान और विकास" }, category: "Section M" },
  { code: "NIC-73", label: { en: "Advertising and Market Research", hi: "विज्ञापन और बाजार अनुसंधान" }, category: "Section M" },
  { code: "NIC-74", label: { en: "Other Professional, Scientific and Technical Activities", hi: "अन्य पेशेवर, वैज्ञानिक और तकनीकी गतिविधियाँ" }, category: "Section M" },
  { code: "NIC-75", label: { en: "Veterinary Activities", hi: "पशु चिकित्सा गतिविधियाँ" }, category: "Section M" },
  
  // Section N: Administrative and Support Service Activities
  { code: "NIC-77", label: { en: "Rental and Leasing Activities", hi: "किराया और पट्टे की गतिविधियाँ" }, category: "Section N" },
  { code: "NIC-78", label: { en: "Employment Activities", hi: "रोजगार गतिविधियाँ" }, category: "Section N" },
  { code: "NIC-79", label: { en: "Travel Agency, Tour Operator and Other Reservation Service", hi: "यात्रा एजेंसी, टूर ऑपरेटर और अन्य आरक्षण सेवा" }, category: "Section N" },
  { code: "NIC-80", label: { en: "Security and Investigation Activities", hi: "सुरक्षा और जांच गतिविधियाँ" }, category: "Section N" },
  { code: "NIC-81", label: { en: "Services to Buildings and Landscape Activities", hi: "भवनों और परिदृश्य गतिविधियों की सेवाएं" }, category: "Section N" },
  { code: "NIC-82", label: { en: "Office Administrative, Office Support and Other Business Support Activities", hi: "कार्यालय प्रशासनिक, कार्यालय सहायता और अन्य व्यवसाय सहायता गतिविधियाँ" }, category: "Section N" },
  
  // Section O: Public Administration and Defence
  { code: "NIC-84", label: { en: "Public Administration and Defence; Compulsory Social Security", hi: "लोक प्रशासन और रक्षा; अनिवार्य सामाजिक सुरक्षा" }, category: "Section O" },
  
  // Section P: Education
  { code: "NIC-85", label: { en: "Education", hi: "शिक्षा" }, category: "Section P" },
  
  // Section Q: Human Health and Social Work Activities
  { code: "NIC-86", label: { en: "Human Health Activities", hi: "मानव स्वास्थ्य गतिविधियाँ" }, category: "Section Q" },
  { code: "NIC-87", label: { en: "Residential Care Activities", hi: "आवासीय देखभाल गतिविधियाँ" }, category: "Section Q" },
  { code: "NIC-88", label: { en: "Social Work Activities without Accommodation", hi: "आवास के बिना सामाजिक कार्य गतिविधियाँ" }, category: "Section Q" },
  
  // Section R: Arts, Entertainment and Recreation
  { code: "NIC-90", label: { en: "Creative, Arts and Entertainment Activities", hi: "रचनात्मक, कला और मनोरंजन गतिविधियाँ" }, category: "Section R" },
  { code: "NIC-91", label: { en: "Libraries, Archives, Museums and Other Cultural Activities", hi: "पुस्तकालय, अभिलेखागार, संग्रहालय और अन्य सांस्कृतिक गतिविधियाँ" }, category: "Section R" },
  { code: "NIC-92", label: { en: "Gambling and Betting Activities", hi: "जुआ और सट्टेबाजी गतिविधियाँ" }, category: "Section R" },
  { code: "NIC-93", label: { en: "Sports Activities and Amusement and Recreation Activities", hi: "खेल गतिविधियाँ और मनोरंजन और मनोरंजन गतिविधियाँ" }, category: "Section R" },
  
  // Section S: Other Service Activities
  { code: "NIC-94", label: { en: "Activities of Membership Organizations", hi: "सदस्यता संगठनों की गतिविधियाँ" }, category: "Section S" },
  { code: "NIC-95", label: { en: "Repair of Computers and Personal and Household Goods", hi: "कंप्यूटर और व्यक्तिगत और घरेलू सामान की मरम्मत" }, category: "Section S" },
  { code: "NIC-96", label: { en: "Other Personal Service Activities", hi: "अन्य व्यक्तिगत सेवा गतिविधियाँ" }, category: "Section S" },
  
  // Section T: Household Activities
  { code: "NIC-97", label: { en: "Activities of Households as Employers of Domestic Personnel", hi: "घरेलू कर्मियों के नियोक्ता के रूप में घरों की गतिविधियाँ" }, category: "Section T" },
  { code: "NIC-98", label: { en: "Undifferentiated Goods and Services Producing Activities of Households", hi: "घरों की अविभेदित वस्तुओं और सेवाओं का उत्पादन गतिविधियाँ" }, category: "Section T" },
  
  // Section U: Extraterritorial Organizations
  { code: "NIC-99", label: { en: "Activities of Extraterritorial Organizations and Bodies", hi: "अतिरिक्त क्षेत्रीय संगठनों और निकायों की गतिविधियाँ" }, category: "Section U" },
];

/**
 * ISIC - International Standard Industrial Classification (Rev. 4)
 */
export const ISIC_CODES: ClassificationCode[] = [
  { code: "ISIC-A", label: { en: "Agriculture, Forestry and Fishing", hi: "कृषि, वानिकी और मत्स्य पालन" }, category: "Section A" },
  { code: "ISIC-B", label: { en: "Mining and Quarrying", hi: "खनन और उत्खनन" }, category: "Section B" },
  { code: "ISIC-C", label: { en: "Manufacturing", hi: "विनिर्माण" }, category: "Section C" },
  { code: "ISIC-D", label: { en: "Electricity, Gas, Steam and Air Conditioning Supply", hi: "बिजली, गैस, भाप और वातानुकूलन आपूर्ति" }, category: "Section D" },
  { code: "ISIC-E", label: { en: "Water Supply; Sewerage, Waste Management and Remediation Activities", hi: "जल आपूर्ति; सीवरेज, कचरा प्रबंधन और उपचार गतिविधियाँ" }, category: "Section E" },
  { code: "ISIC-F", label: { en: "Construction", hi: "निर्माण" }, category: "Section F" },
  { code: "ISIC-G", label: { en: "Wholesale and Retail Trade; Repair of Motor Vehicles and Motorcycles", hi: "थोक और खुदरा व्यापार; मोटर वाहन और मोटरसाइकिल की मरम्मत" }, category: "Section G" },
  { code: "ISIC-H", label: { en: "Transportation and Storage", hi: "परिवहन और भंडारण" }, category: "Section H" },
  { code: "ISIC-I", label: { en: "Accommodation and Food Service Activities", hi: "आवास और खाद्य सेवा गतिविधियाँ" }, category: "Section I" },
  { code: "ISIC-J", label: { en: "Information and Communication", hi: "सूचना और संचार" }, category: "Section J" },
  { code: "ISIC-K", label: { en: "Financial and Insurance Activities", hi: "वित्तीय और बीमा गतिविधियाँ" }, category: "Section K" },
  { code: "ISIC-L", label: { en: "Real Estate Activities", hi: "रियल एस्टेट गतिविधियाँ" }, category: "Section L" },
  { code: "ISIC-M", label: { en: "Professional, Scientific and Technical Activities", hi: "पेशेवर, वैज्ञानिक और तकनीकी गतिविधियाँ" }, category: "Section M" },
  { code: "ISIC-N", label: { en: "Administrative and Support Service Activities", hi: "प्रशासनिक और सहायता सेवा गतिविधियाँ" }, category: "Section N" },
  { code: "ISIC-O", label: { en: "Public Administration and Defence; Compulsory Social Security", hi: "लोक प्रशासन और रक्षा; अनिवार्य सामाजिक सुरक्षा" }, category: "Section O" },
  { code: "ISIC-P", label: { en: "Education", hi: "शिक्षा" }, category: "Section P" },
  { code: "ISIC-Q", label: { en: "Human Health and Social Work Activities", hi: "मानव स्वास्थ्य और सामाजिक कार्य गतिविधियाँ" }, category: "Section Q" },
  { code: "ISIC-R", label: { en: "Arts, Entertainment and Recreation", hi: "कला, मनोरंजन और मनोरंजन" }, category: "Section R" },
  { code: "ISIC-S", label: { en: "Other Service Activities", hi: "अन्य सेवा गतिविधियाँ" }, category: "Section S" },
  { code: "ISIC-T", label: { en: "Activities of Households as Employers", hi: "नियोक्ताओं के रूप में घरों की गतिविधियाँ" }, category: "Section T" },
  { code: "ISIC-U", label: { en: "Activities of Extraterritorial Organizations and Bodies", hi: "अतिरिक्त क्षेत्रीय संगठनों और निकायों की गतिविधियाँ" }, category: "Section U" },
];

/**
 * Economic Indicators as per MoSPI standards
 */
export const ECONOMIC_INDICATORS: ClassificationCode[] = [
  { code: "EI-GDP", label: { en: "Gross Domestic Product", hi: "सकल घरेलू उत्पाद" }, category: "National Accounts" },
  { code: "EI-GNP", label: { en: "Gross National Product", hi: "सकल राष्ट्रीय उत्पाद" }, category: "National Accounts" },
  { code: "EI-NNP", label: { en: "Net National Product", hi: "शुद्ध राष्ट्रीय उत्पाद" }, category: "National Accounts" },
  { code: "EI-PCI", label: { en: "Per Capita Income", hi: "प्रति व्यक्ति आय" }, category: "National Accounts" },
  { code: "EI-CPI", label: { en: "Consumer Price Index", hi: "उपभोक्ता मूल्य सूचकांक" }, category: "Price Indices" },
  { code: "EI-WPI", label: { en: "Wholesale Price Index", hi: "थोक मूल्य सूचकांक" }, category: "Price Indices" },
  { code: "EI-IIP", label: { en: "Index of Industrial Production", hi: "औद्योगिक उत्पादन सूचकांक" }, category: "Industrial Statistics" },
  { code: "EI-LFP", label: { en: "Labour Force Participation Rate", hi: "श्रम बल भागीदारी दर" }, category: "Labour Statistics" },
  { code: "EI-UER", label: { en: "Unemployment Rate", hi: "बेरोजगारी दर" }, category: "Labour Statistics" },
  { code: "EI-LIT", label: { en: "Literacy Rate", hi: "साक्षरता दर" }, category: "Social Statistics" },
  { code: "EI-IMR", label: { en: "Infant Mortality Rate", hi: "शिशु मृत्यु दर" }, category: "Health Statistics" },
  { code: "EI-MMR", label: { en: "Maternal Mortality Rate", hi: "मातृ मृत्यु दर" }, category: "Health Statistics" },
  { code: "EI-TFR", label: { en: "Total Fertility Rate", hi: "कुल प्रजनन दर" }, category: "Demographic Statistics" },
  { code: "EI-SEX", label: { en: "Sex Ratio", hi: "लिंग अनुपात" }, category: "Demographic Statistics" },
  { code: "EI-POV", label: { en: "Poverty Rate", hi: "गरीबी दर" }, category: "Social Statistics" },
  { code: "EI-GINI", label: { en: "Gini Coefficient", hi: "गिनी गुणांक" }, category: "Inequality Measures" },
  { code: "EI-HDI", label: { en: "Human Development Index", hi: "मानव विकास सूचकांक" }, category: "Composite Indices" },
  { code: "EI-GII", label: { en: "Gender Inequality Index", hi: "लिंग असमानता सूचकांक" }, category: "Composite Indices" },
  { code: "EI-EXP", label: { en: "Exports", hi: "निर्यात" }, category: "Trade Statistics" },
  { code: "EI-IMP", label: { en: "Imports", hi: "आयात" }, category: "Trade Statistics" },
  { code: "EI-FDI", label: { en: "Foreign Direct Investment", hi: "प्रत्यक्ष विदेशी निवेश" }, category: "Investment Statistics" },
  { code: "EI-FER", label: { en: "Foreign Exchange Reserves", hi: "विदेशी मुद्रा भंडार" }, category: "Monetary Statistics" },
  { code: "EI-FRD", label: { en: "Fiscal Deficit", hi: "राजकोषीय घाटा" }, category: "Fiscal Statistics" },
  { code: "EI-CRD", label: { en: "Current Account Deficit", hi: "चालू खाता घाटा" }, category: "External Sector" },
];

/**
 * Helper function to search classification codes
 */
export function searchClassificationCodes(
  query: string,
  codeSet: ClassificationCode[],
  language: 'en' | 'hi' = 'en'
): ClassificationCode[] {
  const lowerQuery = query.toLowerCase();
  return codeSet.filter(code => 
    code.code.toLowerCase().includes(lowerQuery) ||
    code.label.en.toLowerCase().includes(lowerQuery) ||
    code.label.hi.includes(query) ||
    (code.category && code.category.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Helper function to get code by exact code string
 */
export function getCodeByCode(
  codeString: string,
  codeSet: ClassificationCode[]
): ClassificationCode | undefined {
  return codeSet.find(code => code.code === codeString);
}

/**
 * Helper function to get codes by category
 */
export function getCodesByCategory(
  category: string,
  codeSet: ClassificationCode[]
): ClassificationCode[] {
  return codeSet.filter(code => code.category === category);
}
