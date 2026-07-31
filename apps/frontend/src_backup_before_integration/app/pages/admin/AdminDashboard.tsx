import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { IndiaMapLeaflet } from '../../components/IndiaMapLeaflet';
import { 
  FileText, 
  Activity, 
  CheckCircle, 
  Clock, 
  Flag,
  TrendingUp,
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { useStore } from '../../../store/useStore';
import { mockMapData } from '../../../store/mockData';
import { getTranslation } from '../../../lib/i18n';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export default function AdminDashboard() {
  const { language, surveys, responses } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const liveSurveys = surveys.filter(s => s.status === 'live');
  const totalResponses = responses.length;
  const completedResponses = responses.filter(r => r.status === 'completed').length;
  const pendingResponses = responses.filter(r => r.status !== 'completed').length;
  const qualityFlags = responses.reduce((sum, r) => sum + r.qualityFlags.length, 0);
  const avgCompletionTime = responses.length > 0 
    ? responses.reduce((sum, r) => sum + (r.paradata.duration || 0), 0) / responses.length 
    : 0;

  const stats = [
    {
      title: t('totalSurveys'),
      value: surveys.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('liveSurveys'),
      value: liveSurveys.length,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('responsesReceived'),
      value: completedResponses,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('pending'),
      value: pendingResponses,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: t('qualityFlags'),
      value: qualityFlags,
      icon: Flag,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: t('avgCompletionTime'),
      value: `${Math.round(avgCompletionTime / 60)}m`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  // Mock data for charts
  const responseTrendData = [
    { date: 'Feb 1', responses: 245 },
    { date: 'Feb 2', responses: 389 },
    { date: 'Feb 3', responses: 512 },
    { date: 'Feb 4', responses: 678 },
    { date: 'Feb 5', responses: 843 },
    { date: 'Feb 6', responses: 967 },
    { date: 'Feb 7', responses: 1124 },
    { date: 'Feb 8', responses: 1289 },
  ];

  const channelData = [
    { name: 'Web', value: 45, color: '#3b82f6' },
    { name: 'WhatsApp', value: 30, color: '#10b981' },
    { name: 'SMS', value: 15, color: '#f59e0b' },
    { name: 'IVR', value: 10, color: '#8b5cf6' },
  ];

  const qualityFlagsData = [
    { type: 'Inconsistent', count: 23 },
    { type: 'Too Fast', count: 18 },
    { type: 'GPS Mismatch', count: 12 },
    { type: 'Duplicate', count: 8 },
  ];

  const enumeratorPerformance = [
    { name: 'Sunita Devi', completed: 145, pending: 23, avgTime: '17m', flags: 2 },
    { name: 'Ramesh Yadav', completed: 132, pending: 31, avgTime: '19m', flags: 5 },
    { name: 'Deepak Kumar', completed: 128, pending: 19, avgTime: '16m', flags: 1 },
    { name: 'Anita Sharma', completed: 119, pending: 27, avgTime: '18m', flags: 3 },
  ];

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Dashboard' }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Trend */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Response Trend (Last 7 Days)' : 'प्रतिक्रिया प्रवृत्ति (पिछले 7 दिन)'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={responseTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="responses" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Completion by Channel' : 'चैनल द्वारा पूर्णता'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
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

        {/* Map and Quality Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IndiaMapLeaflet 
              data={mockMapData} 
              onRegionClick={(region) => {
                console.log('Region clicked:', region);
              }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Quality Flags' : 'गुणवत्ता फ्लैग'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={qualityFlagsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enumerator Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Top Enumerator Performance' : 'शीर्ष गणनाकर्ता प्रदर्शन'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'Name' : '��ाम'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Completed' : 'पूर्ण'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Pending' : 'लंबित'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Avg Time' : 'औसत समय'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Flags' : 'फ्लैग'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enumeratorPerformance.map((enum_perf) => (
                  <TableRow key={enum_perf.name}>
                    <TableCell className="font-medium">{enum_perf.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {enum_perf.completed}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                        {enum_perf.pending}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{enum_perf.avgTime}</TableCell>
                    <TableCell className="text-right">
                      {enum_perf.flags > 0 ? (
                        <Badge variant="secondary" className="bg-red-50 text-red-700">
                          {enum_perf.flags}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}