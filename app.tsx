import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Calendar, BarChart3, Plus, LogOut, Trash2, 
  CheckCircle, XCircle, Download, Filter 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// Types
interface User {
  id: string;
  email: string;
  password: string;
  role: 'faculty' | 'student';
  name: string;
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  password: string;
}

interface Subject {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  subjectId: string;
  studentId: string;
  status: 'present' | 'absent';
}

const FACULTY_CREDENTIALS = { email: 'faculty@attenx.com', password: 'faculty123' };

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  const [loginRole, setLoginRole] = useState<'faculty' | 'student'>('faculty');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-students' | 'add-subjects' | 'mark-attendance' | 'reports'>('dashboard');
  const [studentViewTab, setStudentViewTab] = useState<'overview' | 'details'>('overview');
  
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', email: '', password: '' });
  const [newSubject, setNewSubject] = useState({ name: '' });
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [attendanceMarks, setAttendanceMarks] = useState<{ [studentId: string]: 'present' | 'absent' }>({});
  
  const [selectedSubjectForView, setSelectedSubjectForView] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('attenx_students');
    const savedSubjects = localStorage.getItem('attenx_subjects');
    const savedAttendance = localStorage.getItem('attenx_attendance');
    const savedUser = localStorage.getItem('attenx_currentUser');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance));
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    if (!savedStudents || JSON.parse(savedStudents).length === 0) {
      initializeSampleData();
    }
  }, []);

  // Save to localStorage
  useEffect(() => { localStorage.setItem('attenx_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('attenx_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('attenx_attendance', JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { if (currentUser) localStorage.setItem('attenx_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

  const initializeSampleData = () => {
    const sampleStudents: Student[] = [
      { id: 's1', name: 'Alex Rivera', rollNo: '2024001', email: 'alex.rivera@attenx.com', password: 'student123' },
      { id: 's2', name: 'Jordan Lee', rollNo: '2024002', email: 'jordan.lee@attenx.com', password: 'student123' },
      { id: 's3', name: 'Sam Patel', rollNo: '2024003', email: 'sam.patel@attenx.com', password: 'student123' },
      { id: 's4', name: 'Taylor Kim', rollNo: '2024004', email: 'taylor.kim@attenx.com', password: 'student123' },
      { id: 's5', name: 'Morgan Chen', rollNo: '2024005', email: 'morgan.chen@attenx.com', password: 'student123' },
    ];
    const sampleSubjects: Subject[] = [
      { id: 'sub1', name: 'Mathematics' },
      { id: 'sub2', name: 'Physics' },
      { id: 'sub3', name: 'Computer Science' },
      { id: 'sub4', name: 'English Literature' },
    ];
    const sampleAttendance: AttendanceRecord[] = [
      { id: 'a1', date: '2025-01-06', subjectId: 'sub1', studentId: 's1', status: 'present' },
      { id: 'a2', date: '2025-01-06', subjectId: 'sub1', studentId: 's2', status: 'present' },
      { id: 'a3', date: '2025-01-06', subjectId: 'sub1', studentId: 's3', status: 'absent' },
      { id: 'a4', date: '2025-01-07', subjectId: 'sub2', studentId: 's1', status: 'present' },
      { id: 'a5', date: '2025-01-07', subjectId: 'sub2', studentId: 's2', status: 'present' },
      { id: 'a6', date: '2025-01-08', subjectId: 'sub3', studentId: 's1', status: 'present' },
      { id: 'a7', date: '2025-01-08', subjectId: 'sub3', studentId: 's4', status: 'absent' },
    ];
    setStudents(sampleStudents);
    setSubjects(sampleSubjects);
    setAttendanceRecords(sampleAttendance);
  };

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter email and password');
      return;
    }

    if (loginRole === 'faculty') {
      if (loginEmail === FACULTY_CREDENTIALS.email && loginPassword === FACULTY_CREDENTIALS.password) {
        setCurrentUser({ id: 'f1', email: FACULTY_CREDENTIALS.email, password: FACULTY_CREDENTIALS.password, role: 'faculty', name: 'Dr. Emily Carter' });
        setLoginEmail(''); setLoginPassword('');
        setActiveTab('dashboard');
      } else {
        setLoginError('Invalid faculty credentials. Use faculty@attenx.com / faculty123');
      }
    } else {
      const student = students.find(s => s.email === loginEmail && s.password === loginPassword);
      if (student) {
        setCurrentUser({ id: student.id, email: student.email, password: student.password, role: 'student', name: student.name });
        setLoginEmail(''); setLoginPassword('');
        setSelectedSubjectForView(subjects[0]?.id || '');
      } else {
        setLoginError('Invalid student credentials. Try alex.rivera@attenx.com / student123');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('attenx_currentUser');
    setLoginEmail(''); setLoginPassword(''); setLoginError('');
    setActiveTab('dashboard'); setStudentViewTab('overview');
  };

  // Add Student
  const addStudent = () => {
    if (!newStudent.name || !newStudent.rollNo || !newStudent.email || !newStudent.password) {
      showToast('Please fill all fields'); return;
    }
    if (students.some(s => s.email === newStudent.email || s.rollNo === newStudent.rollNo)) {
      showToast('Student already exists'); return;
    }
    const student: Student = { id: 's' + Date.now(), ...newStudent };
    setStudents([...students, student]);
    setNewStudent({ name: '', rollNo: '', email: '', password: '' });
    setShowAddStudentModal(false);
    showToast('Student added successfully!');
  };

  // Add Subject
  const addSubject = () => {
    if (!newSubject.name.trim()) { showToast('Enter subject name'); return; }
    if (subjects.some(sub => sub.name.toLowerCase() === newSubject.name.toLowerCase().trim())) {
      showToast('Subject already exists'); return;
    }
    setSubjects([...subjects, { id: 'sub' + Date.now(), name: newSubject.name.trim() }]);
    setNewSubject({ name: '' });
    setShowAddSubjectModal(false);
    showToast('Subject added successfully!');
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setAttendanceRecords(attendanceRecords.filter(a => a.studentId !== id));
    showToast('Student removed');
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setAttendanceRecords(attendanceRecords.filter(a => a.subjectId !== id));
    showToast('Subject removed');
  };

  // Mark Attendance
  const openMarkAttendance = (subjectId?: string) => {
    const subjId = subjectId || subjects[0]?.id || '';
    setSelectedSubjectId(subjId);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    const marks: { [key: string]: 'present' | 'absent' } = {};
    attendanceRecords
      .filter(r => r.date === selectedDate && r.subjectId === subjId)
      .forEach(r => { marks[r.studentId] = r.status; });
    setAttendanceMarks(marks);
    setActiveTab('mark-attendance');
  };

  const toggleAttendance = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceMarks(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    if (!selectedSubjectId || !selectedDate || students.length === 0) {
      showToast('Select subject and date'); return;
    }
    const filtered = attendanceRecords.filter(r => !(r.date === selectedDate && r.subjectId === selectedSubjectId));
    const newRecords: AttendanceRecord[] = students.map(student => ({
      id: 'att' + Date.now() + student.id,
      date: selectedDate,
      subjectId: selectedSubjectId,
      studentId: student.id,
      status: attendanceMarks[student.id] || 'absent',
    }));
    setAttendanceRecords([...filtered, ...newRecords]);
    showToast('Attendance saved successfully!');
    setAttendanceMarks({});
  };

  // Student Data Helpers
  const calculatePercentage = (studentId: string, subjectId?: string) => {
    const records = attendanceRecords.filter(r => r.studentId === studentId && (!subjectId || r.subjectId === subjectId));
    if (records.length === 0) return 0;
    const present = records.filter(r => r.status === 'present').length;
    return Math.round((present / records.length) * 100);
  };

  const getAttendanceChartData = (studentId: string) => {
    return subjects.map(subject => {
      const records = attendanceRecords.filter(r => r.studentId === studentId && r.subjectId === subject.id);
      const present = records.filter(r => r.status === 'present').length;
      const total = records.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      return { subject: subject.name, present, absent: total - present, percentage };
    }).filter(d => d.present + d.absent > 0);
  };

  const getFilteredStudentRecords = (studentId: string) => {
    let filtered = attendanceRecords.filter(r => r.studentId === studentId);
    if (selectedSubjectForView) filtered = filtered.filter(r => r.subjectId === selectedSubjectForView);
    if (dateRangeStart) filtered = filtered.filter(r => r.date >= dateRangeStart);
    if (dateRangeEnd) filtered = filtered.filter(r => r.date <= dateRangeEnd);
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  };

  const getOverallReports = () => {
    return students.map(student => {
      const recs = attendanceRecords.filter(r => r.studentId === student.id);
      const total = recs.length;
      const present = recs.filter(r => r.status === 'present').length;
      return {
        name: student.name, rollNo: student.rollNo, totalClasses: total,
        present, absent: total - present, percentage: total > 0 ? Math.round((present / total) * 100) : 0
      };
    });
  };

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Unknown';

  const showToast = (message: string) => {
    setShowSuccessToast(message);
    setTimeout(() => setShowSuccessToast(''), 2800);
  };

  const exportToCSV = () => {
    const reports = getOverallReports();
    if (!reports.length) return;
    const csv = [
      'Student Name,Roll No,Total Classes,Present,Absent,Attendance %',
      ...reports.map(r => `"${r.name}","${r.rollNo}",${r.totalClasses},${r.present},${r.absent},${r.percentage}%`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attenx_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Report exported!');
  };

  // ==================== UI SECTIONS ====================

  const renderLogin = () => (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-6">
            <UserCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-semibold tracking-tighter mb-3">AttenX</h1>
          <p className="text-zinc-400 text-lg">Smart Attendance Management</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex mb-8 bg-zinc-950 rounded-full p-1">
            <button onClick={() => { setLoginRole('faculty'); setLoginError(''); }} 
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${loginRole === 'faculty' ? 'bg-white text-black' : 'text-zinc-400'}`}>
              <Users className="w-4 h-4" /> Faculty
            </button>
            <button onClick={() => { setLoginRole('student'); setLoginError(''); }} 
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${loginRole === 'student' ? 'bg-white text-black' : 'text-zinc-400'}`}>
              <UserCheck className="w-4 h-4" /> Student
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} 
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-2xl px-5 py-4 text-white" 
                placeholder={loginRole === 'faculty' ? "faculty@attenx.com" : "alex.rivera@attenx.com"} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} 
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-2xl px-5 py-4 text-white" required />
            </div>
            {loginError && <div className="text-red-400 text-sm bg-red-950/50 px-4 py-3 rounded-2xl">{loginError}</div>}
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-4 rounded-2xl text-lg">
              Sign in as {loginRole === 'faculty' ? 'Faculty' : 'Student'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
            Faculty: faculty@attenx.com / faculty123<br />
            Student: alex.rivera@attenx.com / student123
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== FACULTY VIEWS ====================
  const renderFacultyDashboard = () => {
    const totalStudents = students.length;
    const totalRecords = attendanceRecords.length;
    const avg = totalRecords > 0 ? Math.round((attendanceRecords.filter(r => r.status === 'present').length / totalRecords) * 100) : 0;

    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <nav className="border-b border-zinc-800 bg-zinc-950/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center"><UserCheck className="w-5 h-5 text-black" /></div>
              <div className="font-semibold text-2xl tracking-tighter">AttenX</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-5 py-2 bg-zinc-900 rounded-full text-sm border border-zinc-800">Dr. Emily Carter</div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 hover:bg-zinc-900 rounded-2xl border border-zinc-800 text-sm"><LogOut className="w-4 h-4" /> Logout</button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-8 pt-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="text-emerald-400 text-sm tracking-[3px]">FACULTY PORTAL</div>
              <h1 className="text-6xl font-semibold tracking-tighter">Welcome back, Dr. Carter.</h1>
            </div>
            <button onClick={() => openMarkAttendance()} className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-medium"><Calendar className="w-4 h-4" /> MARK ATTENDANCE</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"><div className="text-sm text-zinc-400 mb-2">Total Students</div><div className="text-4xl font-semibold">{totalStudents}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"><div className="text-sm text-zinc-400 mb-2">Subjects</div><div className="text-4xl font-semibold">{subjects.length}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"><div className="text-sm text-zinc-400 mb-2">Records Logged</div><div className="text-4xl font-semibold">{totalRecords}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"><div className="text-sm text-zinc-400 mb-2">Avg Attendance</div><div className="text-4xl font-semibold">{avg}%</div></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <div onClick={() => setActiveTab('add-students')} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-8 cursor-pointer flex gap-5">
              <div className="p-4 bg-zinc-800 rounded-2xl"><Users className="w-6 h-6" /></div>
              <div><div className="font-semibold text-2xl">Add Students</div><div className="text-zinc-400">Register new students</div></div>
            </div>
            <div onClick={() => setActiveTab('add-subjects')} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-8 cursor-pointer flex gap-5">
              <div className="p-4 bg-zinc-800 rounded-2xl"><BarChart3 className="w-6 h-6" /></div>
              <div><div className="font-semibold text-2xl">Manage Subjects</div><div className="text-zinc-400">Add or remove subjects</div></div>
            </div>
          </div>

          <button onClick={() => setActiveTab('reports')} className="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-medium">View Full Reports</button>
        </div>
      </div>
    );
  };

  // Add Students View
  const renderAddStudents = () => (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-9">
        <div><h2 className="text-5xl font-semibold tracking-tighter">Manage Students</h2></div>
        <button onClick={() => setShowAddStudentModal(true)} className="flex items-center gap-3 bg-emerald-500 text-black px-7 py-4 rounded-2xl font-medium"><Plus className="w-4 h-4" /> ADD STUDENT</button>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-zinc-800 bg-zinc-950"><th className="text-left px-8 py-5 text-sm text-zinc-400">NAME</th><th className="text-left px-8 py-5 text-sm text-zinc-400">ROLL NO</th><th className="text-left px-8 py-5 text-sm text-zinc-400">EMAIL</th><th className="px-8 py-5"></th></tr></thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b border-zinc-800">
                <td className="px-8 py-5 font-medium">{student.name}</td>
                <td className="px-8 py-5 font-mono text-sm text-zinc-400">{student.rollNo}</td>
                <td className="px-8 py-5 text-sm text-zinc-400">{student.email}</td>
                <td className="px-8 py-5 text-center"><button onClick={() => deleteStudent(student.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Add Subjects View
  const renderAddSubjects = () => (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-9">
        <h2 className="text-5xl font-semibold tracking-tighter">Manage Subjects</h2>
        <button onClick={() => setShowAddSubjectModal(true)} className="bg-emerald-500 text-black px-7 py-4 rounded-2xl font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> ADD SUBJECT</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex justify-between items-center">
            <div className="text-3xl font-medium tracking-tight">{subject.name}</div>
            <button onClick={() => deleteSubject(subject.id)} className="text-red-400"><Trash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );

  // Mark Attendance View
  const renderMarkAttendance = () => (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-5xl font-semibold tracking-tighter mb-8">Mark Attendance</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-9">
        <div className="flex gap-4 mb-8">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-zinc-950 border border-zinc-700 px-6 py-4 rounded-2xl" />
          <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className="bg-zinc-950 border border-zinc-700 px-6 py-4 rounded-2xl flex-1">
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={saveAttendance} className="bg-white text-black px-10 py-4 rounded-2xl font-medium">SAVE ATTENDANCE</button>
        </div>

        {students.length > 0 && selectedSubjectId && (
          <div className="space-y-2">
            {students.map(student => {
              const status = attendanceMarks[student.id] || 'absent';
              return (
                <div key={student.id} className="flex items-center justify-between bg-zinc-950 px-7 py-5 rounded-2xl border border-zinc-800">
                  <div><div className="font-medium">{student.name}</div><div className="text-xs text-zinc-500">{student.rollNo}</div></div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleAttendance(student.id, 'present')} className={`px-7 py-2.5 rounded-2xl text-sm font-medium ${status === 'present' ? 'bg-emerald-500 text-black' : 'bg-zinc-900 border border-zinc-800'}`}>PRESENT</button>
                    <button onClick={() => toggleAttendance(student.id, 'absent')} className={`px-7 py-2.5 rounded-2xl text-sm font-medium ${status === 'absent' ? 'bg-red-500 text-white' : 'bg-zinc-900 border border-zinc-800'}`}>ABSENT</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Reports View
  const renderFacultyReports = () => {
    const reports = getOverallReports();
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h2 className="text-5xl font-semibold tracking-tighter">Class Reports</h2>
          <button onClick={exportToCSV} className="flex items-center gap-2 bg-white text-black px-7 py-3 rounded-2xl font-medium"><Download className="w-4 h-4" /> EXPORT CSV</button>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-zinc-800 bg-zinc-950"><th className="px-8 py-5 text-left text-sm text-zinc-400">STUDENT</th><th className="px-8 py-5 text-left text-sm text-zinc-400">ROLL NO</th><th className="px-8 py-5 text-center text-sm text-zinc-400">ATTENDANCE</th></tr></thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-b border-zinc-800">
                  <td className="px-8 py-5 font-medium">{r.name}</td>
                  <td className="px-8 py-5 font-mono text-sm text-zinc-400">{r.rollNo}</td>
                  <td className="px-8 py-5 text-center"><span className="px-5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm">{r.percentage}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==================== STUDENT VIEW ====================
  const renderStudentDashboard = () => {
    if (!currentUser) return null;
    const student = students.find(s => s.id === currentUser.id)!;
    const percentage = calculatePercentage(student.id);
    const chartData = getAttendanceChartData(student.id);
    const records = getFilteredStudentRecords(student.id);

    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <nav className="border-b border-zinc-800 bg-zinc-950/90 sticky top-0">
          <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
            <div className="font-semibold text-2xl tracking-tighter">AttenX</div>
            <div className="flex items-center gap-4">
              <div className="px-6 py-2 bg-zinc-900 rounded-full border border-zinc-800">{student.name}</div>
              <button onClick={handleLogout} className="px-6 py-2.5 border border-zinc-800 rounded-2xl flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-8 pt-10">
          <h1 className="text-6xl font-semibold tracking-tighter mb-8">Hello, {student.name.split(" ")[0]}.</h1>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-9 mb-8">
            <div className="text-emerald-400 text-sm">OVERALL ATTENDANCE</div>
            <div className="text-[92px] font-semibold tracking-tighter text-emerald-400">{percentage}<span className="text-6xl align-super">%</span></div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-9">
            <div className="font-semibold text-xl mb-6">Attendance by Subject</div>
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="#27272a" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#10b981" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-zinc-400">No data yet.</p>}
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  if (!currentUser) return renderLogin();

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <AnimatePresence>
        {showSuccessToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-8 py-3 rounded-2xl font-medium z-50 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {showSuccessToast}
          </div>
        )}
      </AnimatePresence>

      {currentUser.role === 'faculty' ? (
        <div>
          <div className="fixed left-0 top-0 bottom-0 w-72 border-r border-zinc-800 bg-zinc-950 hidden xl:block p-8">
            <div className="font-semibold text-3xl tracking-tighter mb-12">AttenX</div>
            {['dashboard', 'add-students', 'add-subjects', 'mark-attendance', 'reports'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} 
                className={`w-full text-left px-6 py-4 rounded-2xl mb-1 ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:bg-zinc-900'}`}>
                {tab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>

          <div className="xl:pl-72">
            {activeTab === 'dashboard' && renderFacultyDashboard()}
            {activeTab === 'add-students' && renderAddStudents()}
            {activeTab === 'add-subjects' && renderAddSubjects()}
            {activeTab === 'mark-attendance' && renderMarkAttendance()}
            {activeTab === 'reports' && renderFacultyReports()}
          </div>
        </div>
      ) : (
        renderStudentDashboard()
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6" onClick={() => setShowAddStudentModal(false)}>
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-9" onClick={e => e.stopPropagation()}>
              <div className="text-3xl font-semibold mb-8">Add New Student</div>
              {['name', 'rollNo', 'email', 'password'].map(field => (
                <div key={field} className="mb-4">
                  <label className="text-xs text-zinc-400 block mb-1.5 tracking-widest">{field.toUpperCase()}</label>
                  <input type={field === 'password' ? 'password' : 'text'} value={(newStudent as any)[field]} onChange={e => setNewStudent({ ...newStudent, [field]: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 px-6 py-4 rounded-2xl" />
                </div>
              ))}
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddStudentModal(false)} className="flex-1 py-4 bg-zinc-800 rounded-2xl">Cancel</button>
                <button onClick={addStudent} className="flex-1 py-4 bg-emerald-500 text-black font-semibold rounded-2xl">Add Student</button>
              </div>
            </div>
          </div>
        )}

        {showAddSubjectModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6" onClick={() => setShowAddSubjectModal(false)}>
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-3xl p-9" onClick={e => e.stopPropagation()}>
              <div className="text-3xl font-semibold mb-8">Add New Subject</div>
              <input value={newSubject.name} onChange={e => setNewSubject({ name: e.target.value })} placeholder="Subject Name" className="w-full bg-zinc-950 border border-zinc-700 px-6 py-4 rounded-2xl text-lg" />
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddSubjectModal(false)} className="flex-1 py-4 bg-zinc-800 rounded-2xl">Cancel</button>
                <button onClick={addSubject} className="flex-1 py-4 bg-emerald-500 text-black font-semibold rounded-2xl">Add Subject</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;