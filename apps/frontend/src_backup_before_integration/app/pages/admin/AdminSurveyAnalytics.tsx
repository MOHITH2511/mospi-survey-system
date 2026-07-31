import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  BarChart3,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { IndiaMapLeaflet } from '../../components/IndiaMapLeaflet';

interface AdminSurveyAnalyticsProps {
  surveyId: string;
}

export default function AdminSurveyAnalytics({ surveyId }: AdminSurveyAnalyticsProps) {
  const { language, getSurveyById, getResponsesBySurveyId } = useStore();
  const t = (key: any) => getTranslation(key, language);
  
  const survey = getSurveyById(surveyId);
  const responses = getResponsesBySurveyId(surveyId);

  if (!survey) {
    return (
      <DashboardShell role="admin" breadcrumbs={[]}>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900">Survey not found</h2>
        </div>
      </DashboardShell>
    );
  }

  // Mock analytics data
  const dailyResponses = [
    { date: 'Feb 2', responses: 45 },
    { date: 'Feb 3', responses: 62 },
    { date: 'Feb 4', responses: 58 },
    { date: 'Feb 5', responses: 73 },
    { date: 'Feb 6', responses: 89 },
    { date: 'Feb 7', responses: 95 },
    { date: 'Feb 8', responses: 112 },
  ];

  const channelData = [
    { name: 'Web Portal', value: 245, color: '#0D2C7A' },
    { name: 'Mobile App', value: 189, color: '#FF7722' },
    { name: 'SMS', value: 134, color: '#138808' },
    { name: 'IVR', value: 98, color: '#6366F1' },
  ];

  const completionByState = [
    { regionCode: 'MH', regionName: 'Maharashtra', completed: 234, pending: 66, completionRate: 78.0 },
    { regionCode: 'DL', regionName: 'Delhi', completed: 178, pending: 34, completionRate: 83.9 },
    { regionCode: 'KA', regionName: 'Karnataka', completed: 201, pending: 49, completionRate: 80.4 },
    { regionCode: 'TN', regionName: 'Tamil Nadu', completed: 189, pending: 45, completionRate: 80.8 },
    { regionCode: 'UP', regionName: 'Uttar Pradesh', completed: 156, pending: 144, completionRate: 52.0 },
    { regionCode: 'GJ', regionName: 'Gujarat', completed: 167, pending: 58, completionRate: 74.2 },
    { regionCode: 'RJ', regionName: 'Rajasthan', completed: 134, pending: 78, completionRate: 63.2 },
    { regionCode: 'WB', regionName: 'West Bengal', completed: 145, pending: 67, completionRate: 68.4 },
  ];

  const qualityMetrics = [
    { metric: 'Valid Responses', count: 534, percentage: 94.2, color: 'text-green-600' },
    { metric: 'Flagged for Review', count: 23, percentage: 4.1, color: 'text-yellow-600' },
    { metric: 'Rejected', count: 10, percentage: 1.7, color: 'text-red-600' },
  ];

  const totalResponses = 666;
  const completionRate = 72.4;
  const avgTime = '12.5 min';
  const qualityScore = 94.2;

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Surveys', href: '#/admin/surveys' },
        { label: survey.title.en, href: `#/admin/surveys/${surveyId}/analytics` }
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.hash = '/admin/surveys'}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#0D2C7A]">{survey.title[language]}</h1>
              <p className="text-slate-600 mt-1">Survey Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-600 text-white">Live</Badge>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button
              className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white"
              onClick={() => window.location.hash = `/admin/surveys/${surveyId}/edit`}
            >
              Edit Survey
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Responses</p>
                  <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{totalResponses}</h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +23 today
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#0D2C7A]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                  <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{completionRate}%</h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +2.3% vs last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Time</p>
                  <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{avgTime}</h3>
                  <p className="text-xs text-slate-500 mt-2">Per response</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Quality Score</p>
                  <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{qualityScore}%</h3>
                  <p className="text-xs text-red-600 mt-2">33 flagged</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Response Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#0D2C7A]">
                Response Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyResponses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#64748B" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="responses" stroke="#0D2C7A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#0D2C7A]">
                Channel Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <IndiaMapLeaflet data={completionByState} />

        {/* State-wise Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#0D2C7A]">
              State-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">State</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Completed</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Pending</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {completionByState.map((state, idx) => (
                    <tr key={state.regionCode} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-3 font-medium">{state.regionName}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">
                        {state.completed}
                      </td>
                      <td className="px-4 py-3 text-right text-orange-600 font-medium">
                        {state.pending}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge 
                          className={`${
                            state.completionRate >= 75 ? 'bg-green-600' :
                            state.completionRate >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                          } text-white`}
                        >
                          {state.completionRate.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#0D2C7A]">
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {qualityMetrics.map((metric) => (
                <div key={metric.metric} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{metric.metric}</p>
                    <p className={`text-2xl font-bold ${metric.color} mt-1`}>{metric.count}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">{metric.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
