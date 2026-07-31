import { useState, useEffect } from 'react';
import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Settings,
  Eye,
  Save,
  Sparkles,
  Database,
  Send,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';
import type { SurveyBlock, QuestionType, QuestionOption } from '../../../types';
import { toast } from 'sonner';

interface AdminSurveyBuilderProps {
  surveyId?: string;
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multi-choice', label: 'Multiple Choice' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'rating', label: 'Rating' },
  { value: 'yes-no', label: 'Yes/No' },
  { value: 'consent', label: 'Consent' },
  { value: 'location', label: 'Location' },
  { value: 'household-roster', label: 'Household Roster' },
];

interface SortableBlockProps {
  block: SurveyBlock;
  onEdit: (block: SurveyBlock) => void;
  onDelete: (id: string) => void;
  onDuplicate: (block: SurveyBlock) => void;
  language: 'en' | 'hi';
}

function SortableBlock({ block, onEdit, onDelete, onDuplicate, language }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 space-y-3"
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              {block.isAISuggested && (
                <Badge variant="secondary" className="mb-2 bg-purple-50 text-purple-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Suggested
                </Badge>
              )}
              {block.isNewQuestion && (
                <Badge variant="secondary" className="mb-2 ml-2 bg-blue-50 text-blue-700">
                  NEW
                </Badge>
              )}
              <div className="font-medium text-sm">{language === 'en' ? block.label.en : block.label.hi}</div>
            </div>
            <Badge variant="outline" className="text-xs">
              {questionTypes.find(t => t.value === block.type)?.label}
            </Badge>
          </div>

          {block.options && block.options.length > 0 && (
            <div className="text-sm text-slate-600 space-y-1">
              {block.options.slice(0, 3).map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-slate-300 rounded-sm" />
                  <span>{language === 'en' ? opt.label.en : opt.label.hi}</span>
                </div>
              ))}
              {block.options.length > 3 && (
                <div className="text-xs text-slate-400">
                  +{block.options.length - 3} more options
                </div>
              )}
            </div>
          )}

          {block.required && (
            <Badge variant="secondary" className="mt-2 text-xs">Required</Badge>
          )}
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(block)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDuplicate(block)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(block.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface EditQuestionDialogProps {
  block: SurveyBlock | null;
  open: boolean;
  onClose: () => void;
  onSave: (block: SurveyBlock) => void;
  language: 'en' | 'hi';
}

function EditQuestionDialog({ block, open, onClose, onSave, language }: EditQuestionDialogProps) {
  const [editedBlock, setEditedBlock] = useState<SurveyBlock | null>(block);
  const [options, setOptions] = useState<QuestionOption[]>(block?.options || []);

  // Reset state when block changes
  useEffect(() => {
    if (block) {
      setEditedBlock(block);
      setOptions(block.options || []);
    }
  }, [block, open]);

  if (!editedBlock) return null;

  const hasOptions = ['single-choice', 'multi-choice', 'dropdown'].includes(editedBlock.type);

  const handleAddOption = () => {
    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      label: { en: `Option ${options.length + 1}`, hi: `विकल्प ${options.length + 1}` },
      value: `opt${options.length + 1}`,
    };
    setOptions([...options, newOption]);
  };

  const handleRemoveOption = (optionId: string) => {
    if (options.length <= 2) {
      toast.error('At least 2 options are required');
      return;
    }
    setOptions(options.filter(opt => opt.id !== optionId));
  };

  const handleOptionChange = (optionId: string, field: 'en' | 'hi', value: string) => {
    setOptions(options.map(opt => 
      opt.id === optionId 
        ? { ...opt, label: { ...opt.label, [field]: value } }
        : opt
    ));
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...options];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= options.length) return;
    [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
    setOptions(newOptions);
  };

  const handleTypeChange = (newType: QuestionType) => {
    setEditedBlock({ ...editedBlock, type: newType });
    
    // Auto-add default options when switching to choice/dropdown type
    const needsOptions = ['single-choice', 'multi-choice', 'dropdown'].includes(newType);
    if (needsOptions && options.length === 0) {
      setOptions([
        { id: `opt-${Date.now()}-1`, label: { en: 'Option 1', hi: 'विकल्प 1' }, value: 'opt1' },
        { id: `opt-${Date.now()}-2`, label: { en: 'Option 2', hi: 'विकल्प 2' }, value: 'opt2' },
      ]);
    }
  };

  const handleSave = () => {
    const currentLangLabel = language === 'en' ? editedBlock.label.en : editedBlock.label.hi;
    if (!currentLangLabel.trim()) {
      toast.error(language === 'en' ? 'Question text is required' : 'प्रश्न पाठ आवश्यक है');
      return;
    }

    if (hasOptions && options.length < 2) {
      toast.error(language === 'en' ? 'At least 2 options are required' : 'कम से कम 2 विकल्प आवश्यक हैं');
      return;
    }

    // Check for empty option labels
    if (hasOptions) {
      const hasEmptyOption = options.some(opt => 
        language === 'en' ? !opt.label.en.trim() : !opt.label.hi.trim()
      );
      if (hasEmptyOption) {
        toast.error(language === 'en' ? 'All options must have text' : 'सभी विकल्पों में पाठ होना चाहिए');
        return;
      }
    }

    onSave({ ...editedBlock, options: hasOptions ? options : undefined });
    onClose();
    toast.success(language === 'en' ? 'Question updated' : 'प्रश्न अपडेट किया गया');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Edit Question' : 'प्रश्न संपादित करें'}</DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Customize your question and all its properties'
              : 'अपने प्रश्न और उसकी सभी विशेषताओं को अनुकूलित करें'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question Type */}
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
              value={editedBlock.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label>{language === 'en' ? 'Question Text *' : 'प्रश्न पाठ *'}</Label>
            <Textarea
              value={language === 'en' ? editedBlock.label.en : editedBlock.label.hi}
              onChange={(e) => 
                setEditedBlock({
                  ...editedBlock,
                  label: language === 'en' 
                    ? { ...editedBlock.label, en: e.target.value }
                    : { ...editedBlock.label, hi: e.target.value }
                })
              }
              rows={2}
              placeholder={language === 'en' ? 'Enter your question' : 'अपना प्रश्न दर्ज करें'}
            />
          </div>

          {/* Help Text */}
          <div className="space-y-2">
            <Label>{language === 'en' ? 'Help Text' : 'सहायता पाठ'}</Label>
            <Input
              value={language === 'en' ? (editedBlock.helpText?.en || '') : (editedBlock.helpText?.hi || '')}
              onChange={(e) => 
                setEditedBlock({
                  ...editedBlock,
                  helpText: language === 'en'
                    ? { en: e.target.value, hi: editedBlock.helpText?.hi || '' }
                    : { en: editedBlock.helpText?.en || '', hi: e.target.value }
                })
              }
              placeholder={language === 'en' ? 'Optional help text for respondents' : 'उत्तरदाताओं के लिए वैकल्पिक सहायता पाठ'}
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={editedBlock.required}
              onCheckedChange={(checked) => 
                setEditedBlock({ ...editedBlock, required: checked as boolean })
              }
            />
            <Label htmlFor="required" className="cursor-pointer">
              {language === 'en' ? 'Required question' : 'आवश्यक प्रश्न'}
            </Label>
          </div>

          {/* Options Management for Choice/Dropdown Questions */}
          {hasOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{language === 'en' ? `Options (${options.length})` : `विकल्प (${options.length})`}</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddOption}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'Add Option' : 'विकल्प जोड़ें'}
                </Button>
              </div>
              
              <div className="space-y-2 border rounded-lg p-4 bg-slate-50">
                {options.map((option, index) => (
                  <div key={option.id} className="flex gap-2 items-start bg-white p-3 rounded border">
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleMoveOption(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleMoveOption(index, 'down')}
                        disabled={index === options.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={language === 'en' ? option.label.en : option.label.hi}
                        onChange={(e) => handleOptionChange(option.id, language, e.target.value)}
                        placeholder={language === 'en' ? `Option ${index + 1}` : `विकल्प ${index + 1}`}
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                      onClick={() => handleRemoveOption(option.id)}
                      disabled={options.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                {language === 'en' 
                  ? 'Tip: Use arrow buttons to reorder options. At least 2 options required.'
                  : 'सुझाव: विकल्पों को पुनः क्रमित करने के लिए तीर बटन का उपयोग करें। कम से कम 2 विकल्प आवश्यक।'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {language === 'en' ? 'Cancel' : 'रद्द करें'}
          </Button>
          <Button onClick={handleSave}>
            {language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminSurveyBuilder({ surveyId }: AdminSurveyBuilderProps) {
  const { language, getSurveyById, createSurvey, updateSurvey, questionBank } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const existingSurvey = surveyId ? getSurveyById(surveyId) : null;

  const [surveyTitle, setSurveyTitle] = useState(existingSurvey?.title.en || '');
  const [surveyTitleHi, setSurveyTitleHi] = useState(existingSurvey?.title.hi || '');
  const [surveyDescription, setSurveyDescription] = useState(existingSurvey?.description.en || '');
  const [surveyDescriptionHi, setSurveyDescriptionHi] = useState(existingSurvey?.description.hi || '');
  const [blocks, setBlocks] = useState<SurveyBlock[]>(existingSurvey?.blocks || []);
  const [aiPrompt, setAiPrompt] = useState('');
  const [editingBlock, setEditingBlock] = useState<SurveyBlock | null>(null);
  const [questionBankOpen, setQuestionBankOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    }
  };

  const addBlock = (type: QuestionType) => {
    const newBlock: SurveyBlock = {
      id: `block-${Date.now()}`,
      type,
      label: { en: 'New Question', hi: 'नया प्रश्न' },
      required: false,
      validations: [],
      order: blocks.length,
      isNewQuestion: true,
    };

    if (['single-choice', 'multi-choice', 'dropdown'].includes(type)) {
      newBlock.options = [
        { id: 'opt-1', label: { en: 'Option 1', hi: 'विकल्प 1' }, value: 'opt1' },
        { id: 'opt-2', label: { en: 'Option 2', hi: 'विकल्प 2' }, value: 'opt2' },
      ];
    }

    setBlocks([...blocks, newBlock]);
    setEditingBlock(newBlock);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    toast.success(language === 'en' ? 'Question deleted' : 'प्रश्न हटाया गया');
  };

  const duplicateBlock = (block: SurveyBlock) => {
    const newBlock = {
      ...block,
      id: `block-${Date.now()}`,
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
    toast.success(language === 'en' ? 'Question duplicated' : 'प्रश्न डुप्लिकेट किया गया');
  };

  const handleEditQuestion = (updatedBlock: SurveyBlock) => {
    setBlocks(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
    setEditingBlock(null);
  };

  const handleGenerateFromPrompt = async () => {
    if (!aiPrompt.trim()) {
      toast.error(language === 'en' ? 'Please enter a prompt' : 'कृपया एक प्रॉम्प्ट दर्ज करें');
      return;
    }

    const toastId = toast.loading(language === 'en' ? 'Generating survey questions from MoSPI RAG pipeline...' : 'MoSPI RAG पाइपलाइन से सर्वेक्षण प्रश्न जनरेट किए जा रहे हैं...');
    try {
      const response = await fetch('http://localhost:8000/recommend-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          top_k: 10
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const newBlocks: SurveyBlock[] = [];
      let currentOrder = blocks.length;

      // Helper to guess type and options
      const parseQuestionToBlock = (q: any, isAISuggested: boolean, isNew: boolean): SurveyBlock => {
        const text = q.text.trim();
        const isYesNo = /^(do|is|are|have|has|did|can|will|should)\s/i.test(text) || text.endsWith('?');
        const type: QuestionType = isYesNo ? 'yes-no' : 'short-text';
        
        const block: SurveyBlock = {
          id: `block-${q.question_id || Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
          type,
          label: { en: text, hi: text },
          required: false,
          validations: [],
          order: currentOrder++,
          isAISuggested,
          isNewQuestion: isNew,
          category: q.category || 'demographics',
          section: q.section || 'Uncategorized'
        };

        if (type === 'yes-no') {
          block.options = [
            { id: `opt-yes-${Date.now()}`, label: { en: 'Yes', hi: 'हाँ' }, value: 'yes' },
            { id: `opt-no-${Date.now()}`, label: { en: 'No', hi: 'नहीं' }, value: 'no' }
          ];
        }

        return block;
      };

      // Add retrieved questions
      if (data.items) {
        data.items.forEach((item: any) => {
          newBlocks.push(parseQuestionToBlock(item, false, false));
        });
      }

      // Add generated questions
      if (data.generated_questions) {
        data.generated_questions.forEach((item: any) => {
          newBlocks.push(parseQuestionToBlock(item, true, true));
        });
      }

      if (newBlocks.length === 0) {
        toast.dismiss(toastId);
        toast.info(language === 'en' ? 'No matching questions found.' : 'कोई मिलान वाले प्रश्न नहीं मिले।');
        return;
      }

      setBlocks([...blocks, ...newBlocks]);
      setAiPrompt('');
      toast.dismiss(toastId);
      toast.success(language === 'en' ? `Successfully generated ${newBlocks.length} questions!` : `सफलतापूर्वक ${newBlocks.length} प्रश्न जनरेट किए गए!`);
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error(language === 'en' ? 'Failed to connect to the Survey Intelligence Service.' : 'सर्वेक्षण इंटेलिजेंस सेवा से जुड़ने में विफल।');
    }
  };

  const addFromQuestionBank = (item: any) => {
    const newBlock: SurveyBlock = {
      id: `block-${Date.now()}`,
      type: item.type,
      label: item.label,
      required: false,
      validations: [],
      options: item.options,
      questionBankId: item.id,
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
    toast.success(language === 'en' ? 'Added from Question Bank' : 'प्रश्न बैंक से जोड़ा गया');
  };

  const handleSave = () => {
    if (!surveyTitle.trim()) {
      toast.error(language === 'en' ? 'Survey title is required' : 'सर्वेक्षण शीर्षक आवश्यक है');
      return;
    }

    const survey = {
      id: surveyId || `survey-${Date.now()}`,
      title: { en: surveyTitle, hi: surveyTitleHi || surveyTitle },
      description: { en: surveyDescription, hi: surveyDescriptionHi || surveyDescription },
      objective: { en: '', hi: '' },
      status: 'draft' as const,
      version: existingSurvey?.version || 1,
      createdBy: 'admin-1',
      createdAt: existingSurvey?.createdAt || new Date(),
      updatedAt: new Date(),
      blocks,
      assignments: [],
    };

    if (surveyId) {
      updateSurvey(surveyId, survey);
      toast.success(language === 'en' ? 'Survey updated' : 'सर्वेक्षण अपडेट किया गया');
    } else {
      createSurvey(survey);
      toast.success(language === 'en' ? 'Survey created' : 'सर्वेक्षण बनाया गया');
    }
  };

  const handlePublish = () => {
    // Validation checks before publishing
    if (!surveyTitle.trim()) {
      toast.error(language === 'en' ? 'Survey title is required' : 'सर्वेक्षण शीर्षक आवश्यक है');
      return;
    }

    if (blocks.length === 0) {
      toast.error(language === 'en' ? 'Add at least one question before publishing' : 'प्रकाशित करने से पहले कम से कम एक प्रश्न जोड़ें');
      return;
    }

    // Check if any questions are still "New Question"
    const hasUnnamedQuestions = blocks.some(block => 
      block.label.en === 'New Question' || block.label.en.trim() === ''
    );

    if (hasUnnamedQuestions) {
      toast.error(language === 'en' 
        ? 'Please edit all questions before publishing. Click the ⚙️ icon to edit each question.' 
        : 'कृपया प्रकाशित करने से पहले सभी प्रश्नों को संपादित करें। प्रत्येक प्रश्न को संपादित करने के लिए ⚙️ आइकन पर क्लिक करें।'
      );
      return;
    }

    // Check if choice questions have valid options
    const invalidChoiceQuestions = blocks.filter(block => 
      ['single-choice', 'multi-choice', 'dropdown'].includes(block.type) &&
      (!block.options || block.options.length < 2 || block.options.some(opt => !opt.label.en.trim()))
    );

    if (invalidChoiceQuestions.length > 0) {
      toast.error(language === 'en'
        ? 'All choice questions must have at least 2 valid options. Please edit your questions.'
        : 'सभी विकल्प प्रश्नों में कम से कम 2 वैध विकल्प होने चाहिए। कृपया अपने प्रश्नों को संपादित करें।'
      );
      return;
    }

    const survey = {
      id: surveyId || `survey-${Date.now()}`,
      title: { en: surveyTitle, hi: surveyTitleHi || surveyTitle },
      description: { en: surveyDescription, hi: surveyDescriptionHi || surveyDescription },
      objective: { en: '', hi: '' },
      status: 'live' as const,
      version: existingSurvey?.version || 1,
      createdBy: 'admin-1',
      createdAt: existingSurvey?.createdAt || new Date(),
      updatedAt: new Date(),
      blocks,
      assignments: [],
    };

    if (surveyId) {
      updateSurvey(surveyId, survey);
    } else {
      createSurvey(survey);
    }

    toast.success(
      language === 'en' 
        ? '🎉 Survey published successfully! It is now live.' 
        : '🎉 सर्वेक्षण सफलतापूर्वक प्रकाशित हो गया! यह अब लाइव है।'
    );

    // Redirect to surveys page after a brief delay
    setTimeout(() => {
      window.location.hash = '#/admin/surveys';
    }, 1500);
  };

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Surveys', href: '#/admin/surveys' },
        { label: surveyId ? 'Edit Survey' : 'New Survey' }
      ]}
    >
      <div className="h-full flex flex-col">
        {/* Top Bar */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input 
                placeholder={language === 'en' ? 'Survey Title' : 'सर्वेक्षण शीर्षक'}
                value={language === 'en' ? surveyTitle : surveyTitleHi}
                onChange={(e) => language === 'en' ? setSurveyTitle(e.target.value) : setSurveyTitleHi(e.target.value)}
                className="w-80"
              />
              <Badge variant="secondary">Draft</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {t('preview')}
              </Button>
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {t('save')}
              </Button>
              <Button onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                {t('publish')}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Tools */}
          <div className="w-80 border-r bg-slate-50 overflow-y-auto">
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="builder" className="flex-1">Builder</TabsTrigger>
                <TabsTrigger value="ai" className="flex-1">AI</TabsTrigger>
                <TabsTrigger value="bank" className="flex-1">Bank</TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-sm">Add Question</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {questionTypes.slice(0, 8).map((type) => (
                      <Button
                        key={type.value}
                        variant="outline"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => addBlock(type.value)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    AI Survey Generator
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Describe your survey and let AI generate questions
                  </p>
                  <Textarea 
                    placeholder={language === 'en' 
                      ? 'E.g., "Create a household demographic survey with questions about family size, education, and income"'
                      : 'उदा., "परिवार के आकार, शिक्षा और आय के बारे में प्रश्नों के साथ एक घरेलू जनसांख्यिकीय सर्वेक्षण बनाएं"'}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={6}
                    className="mb-3"
                  />
                  <Button className="w-full" onClick={handleGenerateFromPrompt}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('generateDraft')}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    National Question Bank
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Add standardized questions from the national repository
                  </p>
                  <Input 
                    placeholder={language === 'en' ? 'Search questions...' : 'प्रश्न खोजें...'}
                    className="mb-3"
                  />
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {questionBank.slice(0, 10).map((item) => (
                        <Card key={item.id} className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-sm font-medium">{language === 'en' ? item.label.en : item.label.hi}</div>
                              <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            </div>
                            <div className="text-xs text-slate-500">{item.standardCode}</div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => addFromQuestionBank(item)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {language === 'en' ? 'Add' : 'जोड़ें'}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Survey Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{language === 'en' ? 'Title' : 'शीर्षक'}</Label>
                    <Input 
                      value={language === 'en' ? surveyTitle : surveyTitleHi}
                      onChange={(e) => language === 'en' ? setSurveyTitle(e.target.value) : setSurveyTitleHi(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{language === 'en' ? 'Description' : 'विवरण'}</Label>
                    <Textarea 
                      value={language === 'en' ? surveyDescription : surveyDescriptionHi}
                      onChange={(e) => language === 'en' ? setSurveyDescription(e.target.value) : setSurveyDescriptionHi(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Questions ({blocks.length})</span>
                    <span className="text-sm text-slate-500 font-normal">
                      Drag to reorder
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {blocks.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Database className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No questions yet</p>
                      <p className="text-sm">Add questions from the left panel</p>
                    </div>
                  ) : (
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={blocks.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {blocks.map((block) => (
                            <SortableBlock
                              key={block.id}
                              block={block}
                              onEdit={setEditingBlock}
                              onDelete={deleteBlock}
                              onDuplicate={duplicateBlock}
                              language={language}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Question Dialog */}
      <EditQuestionDialog
        block={editingBlock}
        open={editingBlock !== null}
        onClose={() => setEditingBlock(null)}
        onSave={handleEditQuestion}
        language={language}
      />
    </DashboardShell>
  );
}
