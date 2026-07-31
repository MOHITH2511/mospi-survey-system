import { useState } from 'react';
import { DashboardShell } from '../../components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Users, Plus, Filter, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';

export default function AdminSupervisors() {
  const { users } = useStore();
  const supervisors = users.filter(u => u.role === 'supervisor');
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    email: '',
    phone: '',
    region: ''
  });

  return (
    <DashboardShell 
      role="admin" 
      breadcrumbs={[
        { label: 'Admin', href: '#/admin/dashboard' },
        { label: 'Supervisors' }
      ]}
    >
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0D2C7A]">Supervisors</h1>
            <p className="text-slate-600 mt-1">Manage field supervisors and their teams</p>
          </div>
          <Button 
            className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Supervisor
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-[#0D2C7A] mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Total Supervisors</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">{supervisors.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Active</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">{supervisors.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Regions Covered</p>
                <h3 className="text-3xl font-bold text-[#0D2C7A] mt-2">24</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supervisor List</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Regions</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {supervisors.map((supervisor) => (
                  <tr 
                    key={supervisor.id} 
                    className="border-b hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedSupervisor(supervisor)}
                  >
                    <td className="px-4 py-4 font-medium">{supervisor.name}</td>
                    <td className="px-4 py-4 text-slate-600">{supervisor.email}</td>
                    <td className="px-4 py-4 text-slate-600">{supervisor.phone}</td>
                    <td className="px-4 py-4 text-slate-600">{supervisor.regionCodes.length} regions</td>
                    <td className="px-4 py-4">
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Add Supervisor Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supervisor</DialogTitle>
              <DialogDescription>
                Create a new supervisor account and assign regions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter full name"
                  value={newSupervisor.name}
                  onChange={(e) => setNewSupervisor({...newSupervisor, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="supervisor@mospi.gov.in"
                  value={newSupervisor.email}
                  onChange={(e) => setNewSupervisor({...newSupervisor, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="+91 XXXXX XXXXX"
                  value={newSupervisor.phone}
                  onChange={(e) => setNewSupervisor({...newSupervisor, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Assigned Region</Label>
                <Input 
                  id="region" 
                  placeholder="e.g., North, Delhi, UP"
                  value={newSupervisor.region}
                  onChange={(e) => setNewSupervisor({...newSupervisor, region: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white"
                onClick={() => {
                  // TODO: Add supervisor to store
                  console.log('Adding supervisor:', newSupervisor);
                  setIsAddDialogOpen(false);
                  setNewSupervisor({ name: '', email: '', phone: '', region: '' });
                }}
              >
                Add Supervisor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Supervisor Dialog */}
        <Dialog open={!!selectedSupervisor} onOpenChange={() => setSelectedSupervisor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Supervisor Details</DialogTitle>
            </DialogHeader>
            {selectedSupervisor && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-600">Name</Label>
                    <p className="font-medium text-lg">{selectedSupervisor.name}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Status</Label>
                    <div className="mt-1">
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <div>
                      <Label className="text-slate-600 text-xs">Email</Label>
                      <p className="text-sm">{selectedSupervisor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div>
                      <Label className="text-slate-600 text-xs">Phone</Label>
                      <p className="text-sm">{selectedSupervisor.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-600 flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Assigned Regions
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupervisor.regionCodes.map((code: string) => (
                      <Badge key={code} variant="outline" className="text-sm">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#0D2C7A]">156</p>
                        <p className="text-xs text-slate-600">Enumerators</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">1,234</p>
                        <p className="text-xs text-slate-600">Surveys Completed</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">78</p>
                        <p className="text-xs text-slate-600">Pending</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSupervisor(null)}>
                Close
              </Button>
              <Button className="bg-[#0D2C7A] hover:bg-[#081B4D] text-white">
                Edit Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
