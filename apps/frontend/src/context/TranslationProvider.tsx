import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";

interface TranslationContextType {
  t: (text: string) => string;
  translateBatch: (texts: string[]) => Promise<void>;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Fallback dictionary for instant UI translation when backend is unavailable
const MOCK_DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    "Dashboard Overview": "डैशबोर्ड अवलोकन",
    "AI Survey Builder": "एआई सर्वेक्षण निर्माता",
    "Survey Import Center": "सर्वेक्षण आयात केंद्र",
    "Question Bank": "प्रश्न बैंक",
    "Survey Registry": "सर्वेक्षण रजिस्ट्री",
    "Deployment Center": "परिनियोजन केंद्र",
    "Monitoring Hub": "निगरानी केंद्र",
    "AI Insights": "एआई अंतर्दृष्टि",
    "User Management": "उपयोगकर्ता प्रबंधन",
    "Survey Quality Controls": "सर्वेक्षण गुणवत्ता नियंत्रण",
    "Sign Out": "साइन आउट",
    "Portal Settings": "पोर्टल सेटिंग्स",
    "National Data Gateway": "राष्ट्रीय डेटा गेटवे",
    "Create New Survey": "नया सर्वेक्षण बनाएं",
    "Official User": "आधिकारिक उपयोगकर्ता",
    "admin Session Active": "व्यवस्थापक सत्र सक्रिय",
    "supervisor Session Active": "पर्यवेक्षक सत्र सक्रिय",
    "enumerator Session Active": "प्रगणक सत्र सक्रिय",
    "citizen Session Active": "नागरिक सत्र सक्रिय",
    "Back": "पीछे",
    "Nodal Officer Panel": "नोडल अधिकारी पैनल",
    "System": "सिस्टम",
    "Digital India": "डिजिटल इंडिया",
    "Survey Portal": "सर्वेक्षण पोर्टल",
    "Login": "लॉगिन",
    "Dashboard": "डैशबोर्ड",
    "Active Surveys": "सक्रिय सर्वेक्षण",
    "Published Surveys": "प्रकाशित सर्वेक्षण",
    "Total Responses": "कुल प्रतिक्रियाएं",
    "District Coverage": "जिला कवरेज",
    "Active Enumerators": "सक्रिय प्रगणक",
    "National Economic Survey Q1": "राष्ट्रीय आर्थिक सर्वेक्षण Q1",
    "Rural Health Assessment": "ग्रामीण स्वास्थ्य मूल्यांकन",
    "Agricultural Equipment Census": "कृषि उपकरण जनगणना",
    "Urban Employment Index": "शहरी रोजगार सूचकांक",
    "Education Infrastructure": "शिक्षा अवसंरचना",
    "Survey Details": "सर्वेक्षण विवरण",
    "Version": "संस्करण",
    "Status": "स्थिति",
    "Created By": "द्वारा बनाया गया",
    "Responses": "प्रतिक्रियाएं",
    "Published": "प्रकाशित",
    "Actions": "कार्रवाई",
    "Search surveys...": "सर्वेक्षण खोजें...",
    "Preview": "पूर्वावलोकन",
    "Survey Settings": "सर्वेक्षण सेटिंग्स",
    "Save Draft": "ड्राफ्ट सहेजें",
    "Publish Survey": "सर्वेक्षण प्रकाशित करें",
    "Generate with AI": "एआई के साथ उत्पन्न करें",
    "Question Types": "प्रश्न प्रकार",
    "Add Section": "अनुभाग जोड़ें",
    "Survey Title": "सर्वेक्षण का शीर्षक",
    "Start Building Your Survey": "अपने सर्वेक्षण का निर्माण शुरू करें",
    "Drafts": "ड्राफ्ट",
    "Closed": "बंद",
    "Archived": "अभिलेखागार",
    "All": "सभी",
    "MoSPI Standard: Household Survey": "MoSPI मानक: घरेलू सर्वेक्षण",
    "Deployment Configuration": "परिनियोजन विन्यास",
    "Delivery Channels": "वितरण चैनल",
    "Quick Select": "త్వరిత ఎంపిక",
    "National Rollout": "राष्ट्रीय रोलआउट",
    "Entire South Zone": "संपूर्ण दक्षिण क्षेत्र",
    "Entire North Zone": "संपूर्ण उत्तर क्षेत्र",
    "Clear Selection": "चयन स्पष्ट करें",
    "Geographic Tree Selection": "भौगोलिक पेड़ चयन",
    "Deploy Survey": "सर्वेक्षण तैनात करें",
    "Survey Response Heatmap": "सर्वेक्षण प्रतिक्रिया हीटमैप",
    "Assigned Regions": "सौंपे गए क्षेत्र",
    "Active Data Collection": "सक्रिय डेटा संग्रह",
    "Short Text": "छोटा पाठ",
    "Long Text": "लंबा पाठ",
    "Number": "संख्या",
    "Single Select": "एकल चयन",
    "Multi Select": "बहु चयन",
    "Dropdown": "ड्रॉपडाउन",
    "Date": "तारीख",
    "GPS Location": "जीपीएस स्थान",
    "Image Upload": "छवि अपलोड",
    "Audio Response": "ऑडियो प्रतिक्रिया",
    "Matrix Question": "मैट्रिक्स प्रश्न"
  },
  ta: {},
  te: {}
};

// Cookie helpers
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  return null;
};

const setCookie = (name: string, value: string, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
};

export const TranslationProvider = ({ children, initialLanguage = "en" }: { children: React.ReactNode, initialLanguage?: string }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<string>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const queueRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize language from saved cookie/localStorage
  useEffect(() => {
    const savedLang = getCookie("NEXT_LOCALE") || localStorage.getItem("mospi_language");
    if (savedLang && savedLang !== "en") {
      setCurrentLanguageState(savedLang);
      const cached = localStorage.getItem(`translations_${savedLang}`);
      if (cached) {
        try {
          setTranslations(JSON.parse(cached));
        } catch {
          localStorage.removeItem(`translations_${savedLang}`);
        }
      }
    }
  }, []);

  // setLanguage will be defined below walkDOM so it can access it

  const fetchTranslations = useCallback(async (texts: string[], lang: string) => {
    if (lang === "en" || texts.length === 0) return;

    try {
      setIsLoading(true);
      const chunkSize = 15;
      const chunks: string[][] = [];
      for (let i = 0; i < texts.length; i += chunkSize) {
        chunks.push(texts.slice(i, i + chunkSize));
      }

      const results: Record<string, string> = {};

      await Promise.all(chunks.map(async (chunk) => {
        try {
          let untranslatedTexts: string[] = [...chunk];
          
          try {
            const res = await fetch("http://localhost:8080/api/translations/batch", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                texts: chunk,
                sourceLanguage: "en",
                targetLanguage: lang
              })
            });

            if (res.ok) {
              const data = await res.json();
              untranslatedTexts = [];
              
              chunk.forEach((text, i) => {
                const trans = data.translations[i] || text;
                if (trans === text) {
                  untranslatedTexts.push(text);
                } else {
                  results[text] = trans;
                }
              });
            }
          } catch (e) {
            console.warn("Translation backend unavailable, falling back directly to Google Translate API");
          }

          // Google Translate Fallback for any missing or backend failure
          if (untranslatedTexts.length > 0) {
            try {
              const gtPromises = untranslatedTexts.map(async (text) => {
                try {
                  const gtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
                  const gtRes = await fetch(gtUrl);
                  if (gtRes.ok) {
                    const gtData = await gtRes.json();
                    if (gtData && gtData[0]) {
                      return gtData[0].map((item: any) => item[0] || '').join('');
                    }
                  }
                } catch (e) {
                  // Ignore individual fetch errors
                }
                return text;
              });
              
              const gtResults = await Promise.all(gtPromises);
              untranslatedTexts.forEach((text, i) => {
                results[text] = gtResults[i]?.trim() || text;
              });
            } catch (e) {
              console.warn("GT fallback failed", e);
            }
            
            // Fill any still missing with local dictionary or original text
            untranslatedTexts.forEach(text => {
              if (!results[text] || results[text] === text) {
                const localMatch = MOCK_DICTIONARY[lang]?.[text];
                results[text] = localMatch || text;
              }
            });
          }
        } catch (globalErr) {
          console.error("Chunk translation completely failed", globalErr);
        }
      }));

      setTranslations(prev => {
        const next = { ...prev, ...results };
        localStorage.setItem(`translations_${lang}`, JSON.stringify(next));
        return next;
      });

    } catch (error) {
      console.error("Translation fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const translateBatch = useCallback(async (texts: string[]) => {
    await fetchTranslations(texts, currentLanguage);
  }, [fetchTranslations, currentLanguage]);

  const queueTranslation = useCallback((text: string) => {
    if (currentLanguage === "en" || translations[text]) return;

    queueRef.current.add(text);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const textsToTranslate = Array.from(queueRef.current);
      queueRef.current.clear();
      if (textsToTranslate.length > 0) {
        fetchTranslations(textsToTranslate, currentLanguage);
      }
    }, 50);
  }, [currentLanguage, translations, fetchTranslations]);

  const t = useCallback((text: string): string => {
    if (!text || currentLanguage === "en") return text;

    // 1. Check local instant dictionary (case-sensitive first)
    const localMatch = MOCK_DICTIONARY[currentLanguage]?.[text];
    if (localMatch) return localMatch;

    // 2. Case-insensitive local dictionary check
    const lowerText = text.toLowerCase();
    const langDict = MOCK_DICTIONARY[currentLanguage];
    if (langDict) {
      for (const [key, val] of Object.entries(langDict)) {
        if (key.toLowerCase() === lowerText) return val;
      }
    }

    // 3. Check fetched translations cache
    if (translations[text]) return translations[text];

    // 4. Queue for network translation and return original for now
    queueTranslation(text);
    return text;
  }, [currentLanguage, translations, queueTranslation]);

  const walkDOM = useCallback((root: Node) => {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (parent) {
            const tag = parent.tagName.toLowerCase();
            if (tag === "script" || tag === "style" || tag === "textarea") {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest("svg") || typeof parent.className !== "string") {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const val = textNode.nodeValue;
      if (!val) continue;

      let original = (textNode as any).__originalText;
      if (original === undefined) {
        original = val;
        (textNode as any).__originalText = val;
      }

      const cleanOriginal = original.trim();
      if (!cleanOriginal) continue;

      if (currentLanguage === "en") {
        if (val !== original) {
          textNode.nodeValue = original;
        }
      } else {
        const translated = t(cleanOriginal);
        if (translated && translated !== cleanOriginal) {
          const leadingSpace = original.match(/^\s*/)?.[0] || "";
          const trailingSpace = original.match(/\s*$/)?.[0] || "";
          const finalVal = leadingSpace + translated + trailingSpace;
          if (val !== finalVal) {
            (textNode as any).__isTranslating = true;
            (textNode as any).__lastTranslatedText = finalVal;
            textNode.nodeValue = finalVal;
          }
        }
      }
    }
  }, [currentLanguage, t]);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguageState(lang);
    setCookie("NEXT_LOCALE", lang, 365);
    localStorage.setItem("mospi_language", lang);

    if (lang === "en") {
      setTranslations({});
    } else {
      const cached = localStorage.getItem(`translations_${lang}`);
      if (cached) {
        try {
          setTranslations(JSON.parse(cached));
        } catch {
          localStorage.removeItem(`translations_${lang}`);
          setTranslations({});
        }
      } else {
        setTranslations({});
      }
    }
  }, [walkDOM]);

  useEffect(() => {
    walkDOM(document.body);

    const observer = new MutationObserver((mutations) => {
      let fullWalkNeeded = false;

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const addedNode = mutation.addedNodes[i];
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              walkDOM(addedNode as Element);
            } else if (addedNode.nodeType === Node.TEXT_NODE) {
              walkDOM(addedNode.parentNode as Element);
            }
          }
        } else if (mutation.type === "characterData") {
          const node = mutation.target as Text;
          
          if ((node as any).__isTranslating) {
            (node as any).__isTranslating = false;
            continue;
          }

          const parent = node.parentElement;
          if (parent && (parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.tagName === "TEXTAREA")) continue;
          
          let original = (node as any).__originalText;
          if (!original || node.nodeValue !== original) {
            if (node.nodeValue !== (node as any).__lastTranslatedText) {
              (node as any).__originalText = node.nodeValue;
              original = node.nodeValue;
            }
          }

          if (currentLanguage !== "en" && original) {
            const cleanOriginal = original.trim();
            if (cleanOriginal) {
              const translated = t(cleanOriginal);
              if (translated && translated !== cleanOriginal) {
                const leadingSpace = original.match(/^\s*/)?.[0] || "";
                const trailingSpace = original.match(/\s*$/)?.[0] || "";
                const finalVal = leadingSpace + translated + trailingSpace;
                if (node.nodeValue !== finalVal) {
                  (node as any).__isTranslating = true;
                  (node as any).__lastTranslatedText = finalVal;
                  node.nodeValue = finalVal;
                }
              }
            }
          } else if (currentLanguage === "en" && original) {
            if (node.nodeValue !== original) {
              (node as any).__isTranslating = true;
              (node as any).__lastTranslatedText = original;
              node.nodeValue = original;
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [currentLanguage, walkDOM, t]);

  return (
    <TranslationContext.Provider value={{ t, translateBatch, currentLanguage, setLanguage, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
