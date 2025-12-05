import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { getAllEmployees, getMonthlyAttendance, getHoliday } from '../../../lib/firestore';
import { getSalaryMonthKey, getSalaryMonthDates } from "../../../lib/salary";
import { Employee, AttendanceRecord } from '../../../types';
import { toast } from 'sonner';

export const CalendarView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [records, setRecords] = useState<Map<string, AttendanceRecord>>(new Map());
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadCalendarData();
    }
  }, [selectedEmployee, currentMonth]);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
      if (data.length > 0) {
        setSelectedEmployee(data[0].uid);
      }
    } catch (error) {
      toast.error('Failed to load employees');
    }
  };

  const loadCalendarData = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);
      const salaryMonthKey = getSalaryMonthKey(currentMonth);
      
      const monthlyRecords = await getMonthlyAttendance(selectedEmployee, salaryMonthKey);
      const recordsMap = new Map<string, AttendanceRecord>();
      monthlyRecords.forEach(record => {
        recordsMap.set(record.date, record);
      });
      setRecords(recordsMap);

      const { start, end } = getSalaryMonthDates(salaryMonthKey);
      const allDays = eachDayOfInterval({ start, end });
      const holidaySet = new Set<string>();
      
      for (const day of allDays) {
        const dateStr = format(day, 'yyyy-MM-dd');
        const holiday = await getHoliday(dateStr);
        if (holiday) {
          holidaySet.add(dateStr);
        }
      }
      setHolidays(holidaySet);

    } catch (error) {
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const getDayColor = (dateStr: string): string => {
    if (holidays.has(dateStr)) return 'bg-yellow-200 hover:bg-yellow-300';
    
    const record = records.get(dateStr);
    if (!record) return 'bg-white hover:bg-gray-50';

    switch (record.status) {
      case 'present':
        return 'bg-green-200 hover:bg-green-300';
      case 'leave':
        return 'bg-blue-200 hover:bg-blue-300';
      case 'off':
        return 'bg-red-200 hover:bg-red-300';
      case 'late':
        return 'bg-orange-200 hover:bg-orange-300';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = monthStart.getDay();

  // const selectedEmployeeName = employees.find(e => e.uid === selectedEmployee)?.name || '';

  if (loading && employees.length === 0) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar View</h1>
        <p className="text-muted-foreground">View employee attendance calendar</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Employee Calendar</CardTitle>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-64"
              >
                {employees.map(emp => (
                  <option key={emp.uid} value={emp.uid}>
                    {emp.name} ({emp.empId})
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
              <div className="flex gap-2">
                <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-sm p-2">
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {calendarDays.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayColor = getDayColor(dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(records.get(dateStr) || null)}
                  className={`p-3 rounded-lg border transition-all ${dayColor}`}
                >
                  <div className="text-center font-semibold">{format(day, 'd')}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-200 rounded border" />
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded border" />
              <span className="text-sm">Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-200 rounded border" />
              <span className="text-sm">Off</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-200 rounded border" />
              <span className="text-sm">Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-200 rounded border" />
              <span className="text-sm">Late</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>{format(new Date(selectedDate.date), 'MMMM dd, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <Badge>{selectedDate.status.toUpperCase()}</Badge>
            </div>
            {selectedDate.inTime && (
              <div>
                <span className="font-semibold">In Time:</span> {format(selectedDate.inTime.toDate(), 'hh:mm a')}
              </div>
            )}
            {selectedDate.outTime && (
              <div>
                <span className="font-semibold">Out Time:</span> {format(selectedDate.outTime.toDate(), 'hh:mm a')}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
