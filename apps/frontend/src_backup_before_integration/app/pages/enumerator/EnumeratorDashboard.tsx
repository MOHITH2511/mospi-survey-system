import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  PhoneCall,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { useStore } from '../../../store/useStore';
import { getTranslation } from '../../../lib/i18n';

export default function EnumeratorDashboard() {
  const { language } = useStore();
  const t = (key: any) => getTranslation(key, language);

  const stats = [
    {
      title: language === 'en' ? 'Assigned' : 'सौंपा गया',
      value: 45,
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('completed'),
      value: 32,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: language === 'en' ? 'Callbacks' : 'कॉलबैक',
      value: 8,
      icon: PhoneCall,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: language === 'en' ? 'Pending' : 'लंबित',
      value: 5,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const assignedHouseholds = [
    {
      id: 'HH-001',
      name: 'Sharma Family',
      address: 'Dadar, Mumbai',
      phone: '+91 98765 43210',
      status: 'not-contacted',
      priority: 'high',
    },
    {
      id: 'HH-002',
      name: 'Patel Family',
      address: 'Andheri, Mumbai',
      phone: '+91 98765 43211',
      status: 'contacted',
      scheduledCallback: new Date('2026-02-08T14:00:00'),
      priority: 'medium',
    },
    {
      id: 'HH-003',
      name: 'Kumar Family',
      address: 'Bandra, Mumbai',
      phone: '+91 98765 43212',
      status: 'completed',
      priority: 'low',
    },
    {
      id: 'HH-004',
      name: 'Verma Family',
      address: 'Colaba, Mumbai',
      phone: '+91 98765 43213',
      status: 'not-contacted',
      priority: 'high',
    },
    {
      id: 'HH-005',
      name: 'Singh Family',
      address: 'Powai, Mumbai',
      phone: '+91 98765 43214',
      status: 'refused',
      priority: 'low',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'not-contacted': { label: 'Not Contacted', className: 'bg-slate-100 text-slate-700' },
      'contacted': { label: 'Contacted', className: 'bg-blue-100 text-blue-700' },
      'completed': { label: 'Completed', className: 'bg-green-100 text-green-700' },
      'refused': { label: 'Refused', className: 'bg-red-100 text-red-700' },
    };
    return variants[status as keyof typeof variants] || variants['not-contacted'];
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'high': { className: 'bg-red-500' },
      'medium': { className: 'bg-orange-500' },
      'low': { className: 'bg-slate-400' },
    };
    return variants[priority as keyof typeof variants] || variants['low'];
  };

  return (
    <DashboardShell 
      role="enumerator" 
      breadcrumbs={[
        { label: 'Enumerator', href: '#/enumerator/dashboard' },
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Quick Actions' : 'त्वरित कार्य'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-auto py-6 flex-col gap-2"
                onClick={() => window.location.hash = '/enumerator/collect'}
              >
                <ClipboardList className="h-8 w-8" />
                <span>{language === 'en' ? 'Start New Survey' : 'नया सर्वेक्षण शुरू करें'}</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto py-6 flex-col gap-2"
                onClick={() => window.location.hash = '/enumerator/callbacks'}
              >
                <PhoneCall className="h-8 w-8" />
                <span>{language === 'en' ? 'View Callbacks' : 'कॉलबैक देखें'}</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto py-6 flex-col gap-2"
              >
                <MapPin className="h-8 w-8" />
                <span>{language === 'en' ? 'View Map' : 'मानचित्र देखें'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Households */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{language === 'en' ? 'Assigned Households' : 'सौंपे गए परिवार'}</CardTitle>
              <Button variant="outline" size="sm">
                {language === 'en' ? 'Filter' : 'फ़िल्टर'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'ID' : 'आईडी'}</TableHead>
                  <TableHead>{language === 'en' ? 'Household' : 'परिवार'}</TableHead>
                  <TableHead>{language === 'en' ? 'Contact' : 'संपर्क'}</TableHead>
                  <TableHead>{language === 'en' ? 'Status' : 'स्थिति'}</TableHead>
                  <TableHead>{language === 'en' ? 'Priority' : 'प्राथमिकता'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Actions' : 'कार्य'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedHouseholds.map((household) => (
                  <TableRow key={household.id}>
                    <TableCell className="font-medium">{household.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{household.name}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {household.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <PhoneCall className="h-3 w-3" />
                          {household.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getStatusBadge(household.status).className}
                      >
                        {getStatusBadge(household.status).label}
                      </Badge>
                      {household.scheduledCallback && (
                        <div className="text-xs text-slate-500 mt-1">
                          Callback: {new Date(household.scheduledCallback).toLocaleTimeString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadge(household.priority).className}>
                        {household.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {household.status === 'not-contacted' && (
                          <>
                            <Button size="sm" variant="outline">
                              <PhoneCall className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              SMS
                            </Button>
                          </>
                        )}
                        {household.status === 'contacted' && (
                          <Button size="sm">
                            Start Survey
                          </Button>
                        )}
                        {household.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        )}
                      </div>
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
