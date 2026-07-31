import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { getTranslation } from '../../lib/i18n';
import type { Language } from '../../types';

// Note: toast notifications removed to avoid import issues
// Can be added back if needed with proper sonner setup

interface VoiceInterfaceProps {
  language: Language;
  onTranscript?: (text: string) => void;
  questionText?: string;
  autoSpeak?: boolean;
}

export default function VoiceInterface({
  language,
  onTranscript,
  questionText,
  autoSpeak = false,
}: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    if (!SpeechRecognition || !SpeechSynthesis) {
      setIsSupported(false);
      console.warn('Voice features not supported in this browser');
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice input started');
    };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPart + ' ';
        } else {
          interimText += transcriptPart;
        }
      }

      if (finalText) {
        setTranscript(prev => prev + finalText);
        if (onTranscript) {
          onTranscript(finalText.trim());
        }
      }
      
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = language === 'en' 
        ? 'Voice input error. Please try again.'
        : 'वॉयस इनपुट त्रुटि। कृपया पुनः प्रयास करें।';
      
      if (event.error === 'no-speech') {
        errorMessage = language === 'en'
          ? 'No speech detected. Please try speaking again.'
          : 'कोई भाषण नहीं मिला। कृपया फिर से बोलने का प्रयास करें।';
      } else if (event.error === 'not-allowed') {
        errorMessage = language === 'en'
          ? 'Microphone access denied. Please allow microphone access.'
          : 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया माइक्रोफ़ोन एक्सेस की अनुमति दें।';
      }
      
      console.error(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    synthRef.current = SpeechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]);

  // Auto-speak question when it changes
  useEffect(() => {
    if (autoSpeak && questionText && synthRef.current) {
      speakText(questionText);
    }
  }, [questionText, autoSpeak]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;

    try {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    try {
      // Get available voices
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(language === 'hi' ? 'hi' : 'en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  if (!isSupported) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            {language === 'en'
              ? 'Voice features are not supported in this browser. Please use Chrome, Edge, or Safari for voice capabilities.'
              : 'इस ब्राउज़र में वॉयस सुविधाएँ समर्थित नहीं हैं। वॉयस क्षमताओं के लिए कृपया Chrome, Edge, या Safari का उपयोग करें।'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Control Buttons */}
      <div className="flex gap-3 items-center">
        {/* Speech Recognition */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={isListening ? 'destructive' : 'outline'}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            className="relative"
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Stop' : 'रोकें'}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Voice Input' : 'वॉयस इनपुट'}
              </>
            )}
          </Button>
          
          {transcript && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearTranscript}
            >
              {language === 'en' ? 'Clear' : 'साफ़ करें'}
            </Button>
          )}
        </div>

        {/* Text to Speech */}
        {questionText && (
          <Button
            type="button"
            variant={isSpeaking ? 'destructive' : 'outline'}
            size="lg"
            onClick={isSpeaking ? stopSpeaking : () => speakText(questionText)}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Stop Reading' : 'पढ़ना बंद करें'}
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 mr-2" />
                {language === 'en' ? 'Read Question' : 'प्रश्न पढ़ें'}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        {isListening && (
          <Badge variant="destructive" className="animate-pulse">
            <Mic className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Listening...' : 'सुन रहे हैं...'}
          </Badge>
        )}
        {isSpeaking && (
          <Badge variant="default" className="animate-pulse">
            <Volume2 className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Speaking...' : 'बोल रहे हैं...'}
          </Badge>
        )}
      </div>

      {/* Transcript Display */}
      {(transcript || interimTranscript) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-700">
                  {language === 'en' ? 'Voice Input:' : 'वॉयस इनपुट:'}
                </span>
                {isListening && (
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                )}
              </div>
              <p className="text-sm text-slate-800">
                {transcript}
                {interimTranscript && (
                  <span className="text-slate-500 italic">
                    {interimTranscript}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {isListening && (
        <p className="text-xs text-slate-600 animate-pulse">
          {language === 'en'
            ? '🎤 Speak clearly into your microphone. Your speech will be converted to text automatically.'
            : '🎤 अपने माइक्रोफ़ोन में स्पष्ट रूप से बोलें। आपका भाषण स्वचालित रूप से पाठ में परिवर्तित हो जाएगा।'}
        </p>
      )}
    </div>
  );
}
