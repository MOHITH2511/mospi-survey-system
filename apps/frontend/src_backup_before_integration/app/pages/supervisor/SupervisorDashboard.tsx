import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { IndiaMapLeaflet } from '../../components/IndiaMapLeaflet';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Flag,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useStore } from '../../../store/useStore';
import { mockMapData } from '../../../store/mockData';
import { getTranslation } from '../../../lib/i18n';
import { Button } from '../../components/ui/button';

export default function SupervisorDashboard() {
  const { language, surveys, responses } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const completedResponses = responses.filter(r => r.status === 'completed').length;
  const pendingResponses = responses.filter(r => r.status !== 'completed').length;
  const qualityFlags = responses.reduce((sum, r) => sum + r.qualityFlags.length, 0);

  const stats = [
    {
      title: language === 'en' ? 'Active Enumerators' : 'सक्रिय गणनाकर्ता',
      value: 8,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('completed'),
      value: completedResponses,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
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
  ];

  const trendData = [
    { date: 'Feb 1', completed: 145 },
    { date: 'Feb 2', completed: 289 },
    { date: 'Feb 3', completed: 412 },
    { date: 'Feb 4', completed: 578 },
    { date: 'Feb 5', completed: 743 },
    { date: 'Feb 6', completed: 867 },
    { date: 'Feb 7', completed: 1024 },
  ];

  const enumeratorPerformance = [
    { name: 'Sunita Devi', completed: 145, pending: 23, avgTime: '17m', flags: 2, status: 'active' },
    { name: 'Ramesh Yadav', completed: 132, pending: 31, avgTime: '19m', flags: 5, status: 'active' },
    { name: 'Deepak Kumar', completed: 128, pending: 19, avgTime: '16m', flags: 1, status: 'active' },
    { name: 'Anita Sharma', completed: 119, pending: 27, avgTime: '18m', flags: 3, status: 'offline' },
  ];

  const qualityAlerts = [
    { id: 1, type: 'GPS Mismatch', severity: 'high', enumerator: 'Ramesh Yadav', count: 3 },
    { id: 2, type: 'Too Fast', severity: 'medium', enumerator: 'Anita Sharma', count: 2 },
    { id: 3, type: 'Inconsistent', severity: 'low', enumerator: 'Sunita Devi', count: 1 },
  ];

  return (
    <DashboardShell 
      role="supervisor" 
      breadcrumbs={[
        { label: 'Supervisor', href: '#/supervisor/dashboard' },
        { label: 'Dashboard' }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Trend and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Completion Trend' : 'पूर्णता प्रवृत्ति'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Quality Alerts' : 'गुणवत्ता अलर्ट'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {qualityAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === 'high' ? 'text-red-500' :
                        alert.severity === 'medium' ? 'text-orange-500' :
                        'text-yellow-500'
                      }`} />
                      <div>
                        <div className="font-medium text-sm">{alert.type}</div>
                        <div className="text-xs text-slate-500">{alert.enumerator}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{alert.count}</Badge>
                      <Button size="sm" variant="ghost">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <IndiaMapLeaflet 
          data={mockMapData.filter(d => ['MH', 'DL'].includes(d.regionCode))} 
          onRegionClick={(region) => console.log('Region clicked:', region)}
        />

        {/* Enumerator Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Enumerator Performance' : 'गणनाकर्ता प्रदर्शन'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'Name' : 'नाम'}</TableHead>
                  <TableHead>{language === 'en' ? 'Status' : 'स्थिति'}</TableHead>
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
                    <TableCell>
                      <Badge variant={enum_perf.status === 'active' ? 'default' : 'secondary'}>
                        {enum_perf.status}
                      </Badge>
                    </TableCell>
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
