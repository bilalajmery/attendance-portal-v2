import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { Users, CheckCircle, XCircle, Coffee } from 'lucide-react';
import { getAllEmployees, getAttendanceForDate } from '../../../lib/firestore';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayStats, setTodayStats] = useState({
    present: 0,
    leave: 0,
    off: 0,
    absent: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all employees
      const employees = await getAllEmployees();
      setTotalEmployees(employees.length);

      // Get today's attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayRecords = await getAttendanceForDate(today);

      const stats = {
        present: 0,
        leave: 0,
        off: 0,
        absent: 0,
      };

      const markedEmployees = new Set<string>();
      todayRecords.forEach(record => {
        markedEmployees.add(record.employeeUid);
        if (record.status === 'present' || record.status === 'late') {
          stats.present++;
        } else if (record.status === 'leave') {
          stats.leave++;
        } else if (record.status === 'off') {
          stats.off++;
        }
      });

      stats.absent = employees.length - markedEmployees.size;
      setTodayStats(stats);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Admin Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Registered employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.present}</div>
            <p className="text-xs text-muted-foreground">
              {totalEmployees > 0 ? Math.round((todayStats.present / totalEmployees) * 100) : 0}% attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Coffee className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.leave}</div>
            <p className="text-xs text-muted-foreground">Employees on leave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Off/Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {todayStats.off + todayStats.absent}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayStats.off} off, {todayStats.absent} not marked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Total Employees:</span>
              <span className="font-semibold">{totalEmployees}</span>
            </div>
            <div className="flex justify-between">
              <span>Present:</span>
              <span className="font-semibold text-green-600">{todayStats.present}</span>
            </div>
            <div className="flex justify-between">
              <span>On Leave:</span>
              <span className="font-semibold text-blue-600">{todayStats.leave}</span>
            </div>
            <div className="flex justify-between">
              <span>Off:</span>
              <span className="font-semibold text-red-600">{todayStats.off}</span>
            </div>
            <div className="flex justify-between">
              <span>Not Marked:</span>
              <span className="font-semibold text-orange-600">{todayStats.absent}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
