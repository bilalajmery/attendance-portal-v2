import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { 
  Users, 
  CheckCircle, 
  Coffee, 
  Clock, 
  Plus, 
  CalendarDays, 
  Settings,
  ArrowRight,
  UserCog,
  Banknote
} from 'lucide-react';
import { getAllEmployees, getAllAdmins, getAttendanceForDate } from '../../../lib/firestore';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../../types';

interface ActivityItem {
  uid: string;
  name: string;
  empId: string;
  time?: string;
  reason?: string;
  status: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [stats, setStats] = useState({
    present: 0,
    leave: 0,
    off: 0,
    absent: 0,
    late: 0,
    admins: 0,
    totalSalary: 0,
  });
  const [lateArrivals, setLateArrivals] = useState<ActivityItem[]>([]);
  const [onLeave, setOnLeave] = useState<ActivityItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all employees and admins in parallel
      const [employees, admins] = await Promise.all([
        getAllEmployees(),
        getAllAdmins()
      ]);
      
      setTotalEmployees(employees.length);
      
      // Calculate total monthly salary liability
      const totalSalary = employees.reduce((sum, emp) => sum + (emp.monthlySalary || 0), 0);

      // Create a map for quick employee lookup
      const empMap = new Map<string, Employee>();
      employees.forEach(emp => empMap.set(emp.uid, emp));

      // Get today's attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayRecords = await getAttendanceForDate(today);

      const newStats = {
        present: 0,
        leave: 0,
        off: 0,
        absent: 0,
        late: 0,
        admins: admins.length,
        totalSalary: totalSalary,
      };

      const lateList: ActivityItem[] = [];
      const leaveList: ActivityItem[] = [];
      const markedEmployees = new Set<string>();

      todayRecords.forEach(record => {
        markedEmployees.add(record.employeeUid);
        const emp = empMap.get(record.employeeUid);
        if (!emp) return;

        if (record.status === 'present') {
          newStats.present++;
        } else if (record.status === 'late') {
          newStats.present++; // Late is also present
          newStats.late++;
          lateList.push({
            uid: emp.uid,
            name: emp.name,
            empId: emp.empId,
            time: record.inTime ? format(record.inTime.toDate(), 'hh:mm a') : '-',
            status: 'late'
          });
        } else if (record.status === 'leave') {
          newStats.leave++;
          leaveList.push({
            uid: emp.uid,
            name: emp.name,
            empId: emp.empId,
            reason: record.leaveReason || 'No reason provided',
            status: 'leave'
          });
        } else if (record.status === 'off') {
          newStats.off++;
        }
      });

      newStats.absent = employees.length - markedEmployees.size;
      
      setStats(newStats);
      setLateArrivals(lateList);
      setOnLeave(leaveList);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, Admin</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening today, {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/employees')} variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Employees
          </Button>
          <Button onClick={() => navigate('/admin/attendance')}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Attendance
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">Active workforce</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalEmployees > 0 ? Math.round((stats.present / totalEmployees) * 100) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Late Arrivals</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground mt-1">Employees marked late</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Coffee className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.leave}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved leaves</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-gray-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unmarked Today</CardTitle>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground mt-1">Not yet checked in</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Admins</CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserCog className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.admins}</div>
            <p className="text-xs text-muted-foreground mt-1">System administrators</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Salary Liability</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Banknote className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalSalary)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total monthly payout</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Late Arrivals List */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Late Arrivals
                </CardTitle>
                <CardDescription>Employees who arrived late today</CardDescription>
              </div>
              {lateArrivals.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/admin/attendance')}>
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {lateArrivals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 text-green-100 mb-3" />
                <p>No late arrivals today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lateArrivals.slice(0, 5).map((item) => (
                  <div key={item.uid} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.empId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* On Leave List */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-purple-500" />
                  On Leave
                </CardTitle>
                <CardDescription>Employees on leave today</CardDescription>
              </div>
              {onLeave.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/admin/attendance')}>
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {onLeave.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 text-gray-100 mb-3" />
                <p>No employees on leave today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {onLeave.slice(0, 5).map((item) => (
                  <div key={item.uid} className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.empId}</p>
                      </div>
                    </div>
                    <div className="text-right max-w-[150px]">
                      <p className="text-xs text-muted-foreground truncate" title={item.reason}>
                        {item.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/admin/employees')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Add Employee</h3>
              <p className="text-sm text-muted-foreground">Register new staff member</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/admin/attendance')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Mark Attendance</h3>
              <p className="text-sm text-muted-foreground">Update daily records</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-100 cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/admin/settings')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">System Settings</h3>
              <p className="text-sm text-muted-foreground">Configure portal options</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
