import { useState, useEffect } from 'react';
import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  CheckCircle, 
  Shield,
  Download,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';
import { toast } from 'sonner';
import type { SurveyBlock } from '../../../types';
import VoiceInterface from '../../components/VoiceInterface';
import { autoCodeOccupation, autoCodeIndustry } from '../../../lib/autoCoding';
import { comprehensiveValidation } from '../../../lib/enhancedValidation';
import { encryptSurveyResponse } from '../../../lib/encryption';
import { inferRespondentTraits, generateAdaptiveQuestions } from '../../../lib/adaptiveQuestioning';

interface CitizenSurveyFillProps {
  surveyId: string;
}

export default function CitizenSurveyFill({ surveyId }: CitizenSurveyFillProps) {
  const { language, getSurveyById, createResponse, currentUser } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const survey = getSurveyById(surveyId);
  const [step, setStep] = useState<'consent' | 'prefill' | 'survey' | 'receipt'>('consent');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [prefilledData] = useState({
    'block-2': 'Anjali Verma',
    'block-3': 32,
  });
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({});
  const [receiptId] = useState(`RCT-${Date.now()}`);
  const [startTime] = useState(new Date());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [autoCodeSuggestions, setAutoCodeSuggestions] = useState<Record<string, any>>({});
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<SurveyBlock[]>([]);
  const [encryptedResponse, setEncryptedResponse] = useState<string>('');

  // Auto-detect and suggest codes for occupation/industry
  useEffect(() => {
    const detectAndAutoCode = async () => {
      const currentBlock = surveyBlocks[currentBlockIndex];
      const answer = answers[currentBlock.id];
      
      if (answer && typeof answer === 'string' && answer.length > 2) {
        const labelLower = currentBlock.label.en.toLowerCase();
        
        if (labelLower.includes('occupation') || labelLower.includes('profession')) {
          const result = autoCodeOccupation(answer);
          if (result.confidence > 0.7) {
            setAutoCodeSuggestions(prev => ({ ...prev, [currentBlock.id]: result }));
          }
        } else if (labelLower.includes('industry') || labelLower.includes('business')) {
          const result = autoCodeIndustry(answer);
          if (result.confidence > 0.7) {
            setAutoCodeSuggestions(prev => ({ ...prev, [currentBlock.id]: result }));
          }
        }
      }
    };
    
    detectAndAutoCode();
  }, [answers, currentBlockIndex, surveyBlocks]);

  // Generate adaptive questions based on answers
  useEffect(() => {
    if (Object.keys(answers).length > 2) {
      const traits = inferRespondentTraits(answers);
      const adaptiveQs = generateAdaptiveQuestions(answers, surveyBlocks);
      
      // Filter out already answered questions
      const newQuestions = adaptiveQs
        .filter(q => !surveyBlocks.find(b => b.label.en === q.label.en))
        .slice(0, 3); // Add max 3 adaptive questions
      
      setAdaptiveQuestions(newQuestions);
    }
  }, [answers]);

  if (!survey) {
    return <div>Survey not found</div>;
  }

  const surveyBlocks = survey.blocks.filter(b => b.type !== 'consent');
  const totalBlocks = surveyBlocks.length;
  const progress = ((currentBlockIndex + 1) / totalBlocks) * 100;

  // Consent Step
  const ConsentStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">{t('consentTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg space-y-4 text-sm">
            <h3 className="font-semibold">
              {language === 'en' ? 'Survey Information' : 'सर्वेक्षण जानकारी'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {language === 'en' ? 'Survey:' : 'सर्वेक्षण:'}
                </span>
                <span className="font-medium">{survey.title[language]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {language === 'en' ? 'Conducted by:' : 'द्वारा संचालित:'}
                </span>
                <span className="font-medium">
                  {language === 'en' ? 'Ministry of Statistics' : 'सांख्यिकी मंत्रालय'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {language === 'en' ? 'Estimated time:' : 'अनुमानित समय:'}
                </span>
                <span className="font-medium">15-20 {language === 'en' ? 'minutes' : 'मिनट'}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-slate-700">{t('consentMessage')}</p>
            
            <ul className="space-y-2 text-slate-700">
              <li>
                {language === 'en' 
                  ? 'Your participation is voluntary and you may withdraw at any time'
                  : 'आपकी भागीदारी स्वैच्छिक है और आप किसी भी समय वापस ले सकते हैं'}
              </li>
              <li>
                {language === 'en'
                  ? 'Your responses will be kept strictly confidential'
                  : 'आपकी प्रतिक्रियाएं सख्ती से गोपनीय रखी जाएंगी'}
              </li>
              <li>
                {language === 'en'
                  ? 'Data will be used only for statistical purposes'
                  : 'डेटा का उपयोग केवल सांख्यिकीय उद्देश्यों के लिए किया जाएगा'}
              </li>
              <li>
                {language === 'en'
                  ? 'You will receive an acknowledgement receipt upon completion'
                  : 'पूर्ण होने पर आपको पावती रसीद मिलेगी'}
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Checkbox 
              id="consent" 
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
            />
            <div className="flex-1">
              <label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                {t('consentMessage')}
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.location.hash = '/citizen/dashboard'}
            >
              {t('cancel')}
            </Button>
            <Button 
              className="flex-1"
              disabled={!consentGiven}
              onClick={() => setStep('prefill')}
            >
              {t('agreeAndProceed')}
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {t('downloadConsent')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Prefill Verification Step
  const PrefillStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Verify Prefilled Information' : 'पूर्व भरी गई जानकारी सत्यापित करें'}
          </CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            {language === 'en'
              ? 'Some information has been prefilled from government records. Please verify and update if needed.'
              : 'कुछ जानकारी सरकारी रिकॉर्ड से पूर्व भरी गई है। कृपया सत्यापित करें और यदि आवश्यक हो तो अपडेट करें।'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(prefilledData).map(([blockId, value]) => {
            const block = survey.blocks.find(b => b.id === blockId);
            if (!block) return null;

            const isVerified = verifiedFields[blockId];

            return (
              <div key={blockId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Label className="text-base">{block.label[language]}</Label>
                    <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-700">
                      {t('prefilled')}
                    </Badge>
                  </div>
                  <Button
                    variant={isVerified ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVerifiedFields({ ...verifiedFields, [blockId]: !isVerified })}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Verified' : 'सत्यापित'}
                      </>
                    ) : (
                      t('verify')
                    )}
                  </Button>
                </div>
                <Input 
                  value={answers[blockId] || value}
                  onChange={(e) => setAnswers({ ...answers, [blockId]: e.target.value })}
                />
              </div>
            );
          })}

          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900">
              {language === 'en'
                ? 'Please verify all prefilled information before proceeding. You can edit any field if the information is incorrect.'
                : 'आगे बढ़ने से पहले सभी पूर्व भरी गई जानकारी सत्यापित करें। यदि जानकारी गलत है तो आप किसी भी फ़ील्ड को संपादित कर सकते हैं।'}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep('consent')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Back' : 'वापस'}
            </Button>
            <Button 
              className="flex-1"
              disabled={Object.keys(verifiedFields).length !== Object.keys(prefilledData).length}
              onClick={() => setStep('survey')}
            >
              {language === 'en' ? 'Continue to Survey' : 'सर्वेक्षण पर जारी रखें'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Survey Step
  const renderQuestionInput = (block: SurveyBlock) => {
    const value = answers[block.id];
    const autoCodeSuggestion = autoCodeSuggestions[block.id];

    switch (block.type) {
      case 'short-text':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={value || ''}
                onChange={(e) => setAnswers({ ...answers, [block.id]: e.target.value })}
                placeholder={language === 'en' ? 'Enter your answer' : 'अपना उत्तर दर्ज करें'}
                className="flex-1"
              />
            </div>
            
            {/* Voice Interface */}
            <VoiceInterface
              onTranscriptChange={(transcript) => {
                setAnswers({ ...answers, [block.id]: transcript });
              }}
              language={language}
              questionText={block.label[language]}
            />
            
            {/* Auto-code suggestion */}
            {autoCodeSuggestion && (
              <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <div className="text-purple-900 font-medium mb-1">
                    {language === 'en' ? 'Auto-detected code:' : 'स्वचालित रूप से पहचाना गया कोड:'}
                  </div>
                  <div className="text-purple-700">
                    {autoCodeSuggestion.code} - {autoCodeSuggestion.description}
                    <Badge className="ml-2" variant="secondary">
                      {Math.round(autoCodeSuggestion.confidence * 100)}% {language === 'en' ? 'confidence' : 'विश्वास'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'long-text':
        return (
          <div className="space-y-3">
            <Textarea
              value={value || ''}
              onChange={(e) => setAnswers({ ...answers, [block.id]: e.target.value })}
              placeholder={language === 'en' ? 'Enter your answer' : 'अपना उत्तर दर्ज करें'}
              rows={4}
            />
            
            {/* Voice Interface for long text */}
            <VoiceInterface
              onTranscriptChange={(transcript) => {
                setAnswers({ ...answers, [block.id]: transcript });
              }}
              language={language}
              questionText={block.label[language]}
            />
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [block.id]: e.target.value })}
            placeholder={language === 'en' ? 'Enter number' : 'संख्या दर्ज करें'}
          />
        );

      case 'single-choice':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => setAnswers({ ...answers, [block.id]: val })}
          >
            {block.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option.value} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label[language]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multi-choice':
        return (
          <div className="space-y-2">
            {block.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={option.id}
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const current = value || [];
                    const updated = checked
                      ? [...current, option.value]
                      : current.filter((v: string) => v !== option.value);
                    setAnswers({ ...answers, [block.id]: updated });
                  }}
                />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label[language]}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [block.id]: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">
              {language === 'en' ? 'Select an option' : 'एक विकल्प चुनें'}
            </option>
            {block.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label[language]}
              </option>
            ))}
          </select>
        );

      case 'yes-no':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => setAnswers({ ...answers, [block.id]: val })}
          >
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="cursor-pointer">
                  {language === 'en' ? 'Yes' : 'हां'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="cursor-pointer">
                  {language === 'en' ? 'No' : 'नहीं'}
                </Label>
              </div>
            </div>
          </RadioGroup>
        );

      default:
        return <Input disabled placeholder="Not implemented" />;
    }
  };

  const SurveyStep = () => {
    const currentBlock = surveyBlocks[currentBlockIndex];
    const isLastBlock = currentBlockIndex === totalBlocks - 1;
    const isFirstBlock = currentBlockIndex === 0;

    const handleNext = () => {
      if (!answers[currentBlock.id] && currentBlock.required) {
        toast.error(language === 'en' ? 'This question is required' : 'यह प्रश्न आवश्यक है');
        return;
      }

      if (isLastBlock) {
        handleSubmit();
      } else {
        setCurrentBlockIndex(currentBlockIndex + 1);
      }
    };

    const handleSubmit = async () => {
      // Run comprehensive validation
      const validation = comprehensiveValidation(answers);
      
      if (validation.criticalErrors.length > 0) {
        toast.error(
          language === 'en' 
            ? `Validation failed: ${validation.criticalErrors[0].message}` 
            : `मान्यता विफल: ${validation.criticalErrors[0].message}`
        );
        setValidationErrors(validation.criticalErrors.map(e => e.message));
        return;
      }
      
      if (validation.warnings.length > 0) {
        toast.warning(
          language === 'en' 
            ? `${validation.warnings.length} warnings detected. Please review.` 
            : `${validation.warnings.length} चेतावनियां मिलीं। कृपया समीक्षा करें।`
        );
      }

      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      const response = {
        id: `resp-${Date.now()}`,
        surveyId: survey.id,
        userId: currentUser!.id,
        answers,
        status: 'completed' as const,
        consentGiven: true,
        consentTimestamp: startTime,
        startedAt: startTime,
        submittedAt: endTime,
        paradata: {
          startTime,
          endTime,
          duration,
          location: {
            latitude: 19.0760,
            longitude: 72.8777,
            accuracy: 10,
          },
          deviceInfo: {
            type: 'desktop' as const,
            os: 'Windows 11',
            browser: 'Chrome',
            deviceId: 'device-web-001',
          },
          networkStatus: 'online' as const,
          revisionCount: 0,
        },
        qualityFlags: validation.qualityFlags || [],
      };

      // Encrypt sensitive data
      try {
        const encrypted = await encryptSurveyResponse(response);
        setEncryptedResponse(encrypted);
        
        createResponse(response);
        setStep('receipt');
        toast.success(language === 'en' ? 'Survey submitted successfully!' : 'सर्वेक्षण सफलतापूर्वक सबमिट किया गया!');
      } catch (error) {
        toast.error(language === 'en' ? 'Encryption failed' : 'एन्क्रिप्शन विफल');
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">
                {language === 'en' ? 'Question' : 'प्रश्न'} {currentBlockIndex + 1} {language === 'en' ? 'of' : 'का'} {totalBlocks}
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  {currentBlock.label[language]}
                  {currentBlock.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </CardTitle>
                {currentBlock.helpText && (
                  <p className="text-sm text-slate-500">
                    {currentBlock.helpText[language]}
                  </p>
                )}
              </div>
              {currentBlock.isAISuggested && (
                <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                  {t('aiSuggested')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Display validation errors */}
            {validationErrors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-900 mb-1">
                      {language === 'en' ? 'Validation Errors:' : 'मान्यता त्रुटियाँ:'}
                    </div>
                    {validationErrors.map((error, idx) => (
                      <div key={idx} className="text-sm text-red-700">{error}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {renderQuestionInput(currentBlock)}
            
            {/* Show adaptive questions suggestion */}
            {adaptiveQuestions.length > 0 && currentBlockIndex === totalBlocks - 1 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-900 mb-2">
                      {language === 'en' ? 'AI suggests additional relevant questions:' : 'AI अतिरिक्त प्रासंगिक प्रश्नों का सुझाव देता है:'}
                    </div>
                    <div className="space-y-1 text-sm text-blue-700">
                      {adaptiveQuestions.map((q, idx) => (
                        <div key={idx}>• {q.label[language]}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                disabled={isFirstBlock}
                onClick={() => setCurrentBlockIndex(currentBlockIndex - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Previous' : 'पिछला'}
              </Button>
              <Button className="flex-1" onClick={handleNext}>
                {isLastBlock 
                  ? (language === 'en' ? 'Submit Survey' : 'सर्वेक्षण जमा करें')
                  : (language === 'en' ? 'Next' : 'अगला')
                }
                {!isLastBlock && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {language === 'en' ? 'Time spent:' : 'व्यतीत समय:'} {Math.floor((Date.now() - startTime.getTime()) / 60000)}m
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>
                  {language === 'en' ? 'Location captured' : 'स्थान कैप्चर किया गया'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Receipt Step
  const ReceiptStep = () => {
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              {language === 'en' ? 'Survey Completed!' : 'सर्वेक्षण पूर्ण!'}
            </CardTitle>
            <p className="text-slate-600 mt-2">
              {language === 'en'
                ? 'Thank you for your participation. Your responses have been recorded.'
                : 'आपकी भागीदारी के लिए धन्यवाद। आपकी प्रतिक्रियाएं रिकॉर्ड कर ली गई हैं।'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg space-y-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">{receiptId}</div>
                <div className="text-sm text-slate-600">{t('receiptId')}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-600">{language === 'en' ? 'Survey:' : 'सर्वेक्षण:'}</div>
                  <div className="font-medium">{survey.title[language]}</div>
                </div>
                <div>
                  <div className="text-slate-600">{language === 'en' ? 'Submitted:' : 'जमा:'}</div>
                  <div className="font-medium">{endTime.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-600">{language === 'en' ? 'Time taken:' : 'लिया गया समय:'}</div>
                  <div className="font-medium">{duration} {language === 'en' ? 'minutes' : 'मिनट'}</div>
                </div>
                <div>
                  <div className="text-slate-600">{language === 'en' ? 'Responses:' : 'प्रतिक्रियाएं:'}</div>
                  <div className="font-medium">{Object.keys(answers).length}</div>
                </div>
              </div>
              
              {/* Encryption indicator */}
              {encryptedResponse && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mt-4">
                  <Lock className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-700">
                    <div className="font-semibold mb-1">
                      {language === 'en' ? 'Data Encrypted & Secured' : 'डेटा एन्क्रिप्टेड और सुरक्षित'}
                    </div>
                    <div className="text-xs text-green-600">
                      {language === 'en' 
                        ? 'Your responses are encrypted with AES-256 encryption' 
                        : 'आपकी प्रतिक्रियाएं AES-256 एन्क्रिप्शन के साथ एन्क्रिप्ट की गई हैं'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {t('download')} {t('acknowledgement')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.hash = '/citizen/dashboard'}
              >
                {language === 'en' ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस'}
              </Button>
            </div>

            <div className="text-center text-xs text-slate-500 pt-4 border-t">
              {language === 'en'
                ? 'Keep this receipt for your records. You can access it anytime from your dashboard.'
                : 'अपने रिकॉर्ड के लिए इस रसीद को रखें। आप इसे अपने डैशबोर्ड से किसी भी समय एक्सेस कर सकते हैं।'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <DashboardShell 
      role="citizen" 
      breadcrumbs={[
        { label: 'Citizen', href: '#/citizen/dashboard' },
        { label: survey.title[language] }
      ]}
    >
      <div className="p-6">
        {step === 'consent' && <ConsentStep />}
        {step === 'prefill' && <PrefillStep />}
        {step === 'survey' && <SurveyStep />}
        {step === 'receipt' && <ReceiptStep />}
      </div>
    </DashboardShell>
  );
}
