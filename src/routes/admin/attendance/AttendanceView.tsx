import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { getAllEmployees, getAttendanceForDate } from '../../../lib/firestore';
import { Employee, AttendanceRecord } from '../../../types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const AttendanceView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      loadAttendance();
    }
  }, [selectedDate, employees]);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to load employees');
    }
  };

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await getAttendanceForDate(selectedDate);
      setRecords(data);
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeRecord = (employeeUid: string) => {
    return records.find(r => r.employeeUid === employeeUid);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Not Marked</Badge>;
    
    const variants: Record<string, any> = {
      present: { variant: 'success', label: 'Present' },
      leave: { variant: 'default', label: 'Leave' },
      off: { variant: 'destructive', label: 'Off' },
      late: { variant: 'warning', label: 'Late' },
      holiday: { variant: 'secondary', label: 'Holiday' },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading && employees.length === 0) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance View</h1>
        <p className="text-muted-foreground">View and manage employee attendance</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance for {format(new Date(selectedDate), 'MMMM dd, yyyy')}</CardTitle>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>Out Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(employee => {
                const record = getEmployeeRecord(employee.uid);
                return (
                  <TableRow key={employee.uid}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.empId}</TableCell>
                    <TableCell>{getStatusBadge(record?.status)}</TableCell>
                    <TableCell>
                      {record?.inTime ? format(record.inTime.toDate(), 'hh:mm a') : '-'}
                    </TableCell>
                    <TableCell>
                      {record?.outTime ? format(record.outTime.toDate(), 'hh:mm a') : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
