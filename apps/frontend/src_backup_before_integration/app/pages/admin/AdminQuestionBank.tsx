import { useState } from 'react';
import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  TrendingUp,
  Filter,
  Sparkles,
  Book,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';
import { toast } from 'sonner';
import { NCO_CODES, NIC_CODES, ISIC_CODES, ECONOMIC_INDICATORS, searchClassificationCodes } from '../../../lib/classifications';

export default function AdminQuestionBank() {
  const { language, questionBank } = useStore();
  const t = (key: any) => getTranslation(key, language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [classificationSearch, setClassificationSearch] = useState('');
  const [selectedClassificationType, setSelectedClassificationType] = useState<'nco' | 'nic' | 'isic' | 'economic'>('nco');

  const categories = [
    'All Categories',
    'Demographics',
    'Housing',
    'Education',
    'Employment',
    'Health',
    'Income',
  ];

  const filteredQuestions = questionBank.filter((q) => {
    const matchesSearch =
      q.label.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.label.hi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.standardCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'all' ||
      q.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleUseQuestion = (questionId: string) => {
    toast.success('Question added to clipboard. Use it in the survey builder.');
  };

  const handleCopyCode = (code: string, description: string) => {
    navigator.clipboard.writeText(`${code} - ${description}`);
    toast.success('Classification code copied to clipboard');
  };

  const getClassificationData = () => {
    switch (selectedClassificationType) {
      case 'nco': return NCO_CODES;
      case 'nic': return NIC_CODES;
      case 'isic': return ISIC_CODES;
      case 'economic': return ECONOMIC_INDICATORS;
    }
  };

  const filteredClassifications = classificationSearch
    ? searchClassificationCodes(classificationSearch, selectedClassificationType)
    : getClassificationData();

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Question Bank', href: '#/admin/question-bank' }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0D2C7A]">Question Bank</h1>
            <p className="text-slate-600 mt-1">Standardized survey questions and MoSPI classification codes</p>
          </div>
          <Button className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Question
          </Button>
        </div>

        {/* Tabs for Questions and Classifications */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="questions">
              <Book className="h-4 w-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="classifications">
              <Sparkles className="h-4 w-4 mr-2" />
              MoSPI Codes
            </TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6 mt-6">

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Total Questions</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{questionBank.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{categories.length - 1}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Most Used</p>
                <h3 className="text-2xl font-bold text-[#0D2C7A] mt-2">DEM-001</h3>
                <p className="text-xs text-slate-500 mt-1">Age Question</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Total Usage</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">1,234</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by question text or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="demographics">Demographics</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="employment">Employment</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Code</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Question</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Type</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-700 text-sm">Usage</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question, idx) => (
                    <tr 
                      key={question.id} 
                      className={`border-b border-slate-100 hover:bg-slate-50 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="font-mono text-xs border-[#0D2C7A] text-[#0D2C7A]">
                          {question.standardCode}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{question.label.en}</p>
                          <p className="text-sm text-slate-500 mt-1">{question.label.hi}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className="bg-blue-100 text-blue-700">
                          {question.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold text-[#0D2C7A]">{question.usageCount}</span>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUseQuestion(question.id)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No questions found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Classifications Tab */}
          <TabsContent value="classifications" className="space-y-6 mt-6">
            {/* Stats Cards for Classifications */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">NCO Codes</p>
                    <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{NCO_CODES.length}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">NIC Codes</p>
                    <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{NIC_CODES.length}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">ISIC Codes</p>
                    <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{ISIC_CODES.length}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">Economic Indicators</p>
                    <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{ECONOMIC_INDICATORS.length}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Classification Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Select value={selectedClassificationType} onValueChange={(val: any) => setSelectedClassificationType(val)}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Classification Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nco">NCO-2015 (Occupation)</SelectItem>
                      <SelectItem value="nic">NIC-2008 (Industry)</SelectItem>
                      <SelectItem value="isic">ISIC Rev.4 (International)</SelectItem>
                      <SelectItem value="economic">Economic Indicators</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search classification codes..."
                      value={classificationSearch}
                      onChange={(e) => setClassificationSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification Codes Table */}
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Code</th>
                        <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Description</th>
                        {selectedClassificationType !== 'economic' && (
                          <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Category</th>
                        )}
                        <th className="text-right px-4 py-3 font-medium text-slate-700 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClassifications.slice(0, 50).map((item, idx) => (
                        <tr 
                          key={item.code} 
                          className={`border-b border-slate-100 hover:bg-slate-50 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          }`}
                        >
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="font-mono text-xs border-purple-600 text-purple-700">
                              {item.code}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">{item.description}</p>
                          </td>
                          {selectedClassificationType !== 'economic' && (
                            <td className="px-4 py-4">
                              <Badge className="bg-purple-100 text-purple-700">
                                {item.category}
                              </Badge>
                            </td>
                          )}
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyCode(item.code, item.description)}
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredClassifications.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No classification codes found</p>
                  </div>
                )}
                
                {filteredClassifications.length > 50 && (
                  <div className="text-center py-4 text-sm text-slate-500">
                    Showing 50 of {filteredClassifications.length} results. Refine your search to see more.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
