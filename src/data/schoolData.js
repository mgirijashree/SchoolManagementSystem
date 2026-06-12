 
// 1. Initial Data (Students, Classes, Activities, Alerts, Users & Fees)
 

export const INITIAL_STUDENTS = [
  { id: "STU-24001", name: "Ananya Krishnan", email: "ananya.k@edusmart.in", grade: "Grade 5 · A", guardian: "Murali Krishnan", relationship: "Father", status: "Active", date: "Oct 24, 2025", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100" },
  { id: "STU-24002", name: "Siddharth Venkat", email: "siddharth.v@edusmart.in", grade: "Grade 6 · B", guardian: "Meenakshi Venkat", relationship: "Mother", status: "Inactive", date: "Oct 22, 2025", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" },
  { id: "STU-24003", name: "Thariq Ahmed", email: "thariq.a@edusmart.in", grade: "Grade 4 · A", guardian: "Abdul Rahman", relationship: "Father", status: "Active", date: "Oct 18, 2025", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100" },
  { id: "STU-24004", name: "Meera Nair", email: "meera.n@edusmart.in", grade: "Grade 7 · C", guardian: "Ramesh Nair", relationship: "Father", status: "Active", date: "Oct 15, 2025", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100" },
  { id: "STU-24005", name: "Yashwanth Rao", email: "yashwanth.r@edusmart.in", grade: "Grade 7 · A", guardian: "Nageshwar Rao", relationship: "Father", status: "Inactive", date: "Oct 04, 2025", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=100" }
];

export const INITIAL_CLASSES = [
  { id: "CLS-101", name: "Grade 5 - Section A", room: "Room 101", count: 32, label: "Grade 5", teacher: "Sharanya Iyer", schedule: "Mon - Fri 8:00-15:00" },
  { id: "CLS-205", name: "Grade 6 - Section B", room: "Room 205", count: 28, label: "Grade 6", teacher: "Karthik Chandran", schedule: "Mon - Fri 8:00-15:30" },
  { id: "CLS-103", name: "Grade 4 - Section A", room: "Room 103", count: 30, label: "Grade 5", teacher: "Deepa Lakshmi", schedule: "Mon - Fri 8:00-14:30" },
  { id: "CLS-104", name: "Grade 7 - Section C", room: "Room 101", count: 32, label: "Grade 7", teacher: "Jayakumar Pillai", schedule: "Mon - Fri 8:00-15:00" },
  { id: "CLS-206", name: "Grade 5 - Section B", room: "Room 205", count: 28, label: "Grade 5", teacher: "Malini Hegde", schedule: "Mon - Fri 8:00-15:30" },
  { id: "CLS-105", name: "Grade 8 - Section A", room: "Room 103", count: 30, label: "Grade 8", teacher: "Aswathy Menon", schedule: "Mon - Fri 8:00-14:30" }
];

export const INITIAL_ACTIVITIES = [
  { id: 1, title: "Hariharan Reddy admitted to Grade 5", user: "Admin Elavarasi", time: "3 minutes ago", initials: "AE", type: "admission" },
  { id: 2, title: "Shruthi Suresh paid fee for Term 1", user: "Shruthi Suresh", time: "12 minutes ago", initials: "SS", type: "fee" },
  { id: 3, title: "Shruthi Suresh admitted to Grade 6", user: "Admin Elavarasi", time: "25 minutes ago", initials: "AE", type: "admission" },
  { id: 4, title: "Shruthi Suresh paid fee for Term 2", user: "Shruthi Suresh", time: "1 hour ago", initials: "SS", type: "fee" },
  { id: 5, title: "Attendance marked for grade 5A", user: "Sharanya Iyer", time: "2 hours ago", initials: "SI", type: "attendance" },
  { id: 6, title: "Annual sports day announcement Published", user: "Principal Viswanathan", time: "3 hours ago", initials: "PV", type: "announcement" }
];

export const INITIAL_ALERTS = [
  { id: 1, title: "New Admission Request", desc: "A New admission request has been submitted for Grade 5", variant: "neutral" },
  { id: 2, title: "Approval Request", desc: "Sharanya Iyer submitted a leave request.", variant: "neutral" },
  { id: 3, title: "Fee payment overdue", desc: "12 students have overdue fee payments.", variant: "warning" },
  { id: 4, title: "Attendance Alert", desc: "Attendance below 75% for 5 students this week.", variant: "warning" }
];

export const INITIAL_APPROVALS = [
  { id: 1, name: "Sharanya Iyer", request: "Medical leave request for 3 days", badge: "Leave" },
  { id: 2, name: "Jayakumar Pillai", request: "Request to correct attendance", badge: "Attendance Edit" },
  { id: 3, name: "Karthik Chandran", request: "Attendance correction", badge: "Attendance Edit" }
];

export const INITIAL_USERS = [
  { id: "USR-001", name: "Admin Elavarasi", email: "elavarasi.admin@edusmart.in", role: "Administrator", status: "Active", department: "Management" },
  { id: "USR-002", name: "Sharanya Iyer", email: "sharanya.i@edusmart.in", role: "Teacher", status: "Active", department: "Primary Education" },
  { id: "USR-003", name: "Principal Viswanathan", email: "viswanathan.p@edusmart.in", role: "Principal", status: "Active", department: "Management" },
  { id: "USR-004", name: "Karthik Chandran", email: "karthik.c@edusmart.in", role: "Teacher", status: "Inactive", department: "Secondary Education" }
];

export const INITIAL_FEE_CATEGORIES = [
  { id: "CAT-1", name: "Tuition Fee", gradeRange: "Grade 3-5", type: "Annual", amount: 5200 },
  { id: "CAT-2", name: "Activity Fee", gradeRange: "Grade 3-8", type: "Annual", amount: 800 },
  { id: "CAT-3", name: "Transport Fee", gradeRange: "Grade 3-8", type: "Annual", amount: 1200 },
  { id: "CAT-4", name: "Library Fee", gradeRange: "Grade 3-8", type: "Annual", amount: 400 },
  { id: "CAT-5", name: "Lab Fee", gradeRange: "Grade 6-8", type: "Annual", amount: 1500 },
  { id: "CAT-6", name: "Sports Fee", gradeRange: "Grade 3-8", type: "Annual", amount: 600 }
];

export const INITIAL_FEE_PAYMENTS = [
  { id: "PAY-001", studentName: "Liam Smith", studentId: "STD-10231", class: "Grade 5 - A", feeType: "Tuition", receiptNo: "REC-8821", amount: 2500, paidDate: "15 Oct 2024", status: "Paid", method: "Online" },
  { id: "PAY-002", studentName: "John Smith", studentId: "STD-10245", class: "Grade 6- B", feeType: "Transport", receiptNo: "-", amount: 450, paidDate: "-", status: "Pending", method: "-" },
  { id: "PAY-003", studentName: "Ananya Krishnan", studentId: "STD-24001", class: "Grade 5 - A", feeType: "Activity", receiptNo: "REC-8902", amount: 800, paidDate: "18 Oct 2024", status: "Paid", method: "Online" }
];

export const INITIAL_FEE_PENDING = [
  { id: "DUE-001", studentName: "John Smith", studentId: "STD-10245", class: "Grade 6- B", feeType: "Transport", dueAmount: 6200, daysOverdue: "-", dueDate: "2026-04-15", status: "Pending" },
  { id: "DUE-002", studentName: "Michael Chang", studentId: "STD-10258", class: "Grade 4 - C", feeType: "Exam", dueAmount: 5400, daysOverdue: "44D", dueDate: "2026-03-15", status: "Overdue" },
  { id: "DUE-003", studentName: "Ethan jones", studentId: "STD-10262", class: "Grade 6 - A", feeType: "Tuition", dueAmount: 5800, daysOverdue: "38D", dueDate: "2026-03-15", status: "Overdue" },
  { id: "DUE-004", studentName: "Omar Hassan", studentId: "STD-10290", class: "Grade 12 - B", feeType: "Lab Fee", dueAmount: 1200, daysOverdue: "15D", dueDate: "2026-04-20", status: "Pending" }
];

 
// 2. Chart Data
 

export const ATTENDANCE_CHART_DATA = [
  { day: "Mon", attendance: 50 },
  { day: "Tue", attendance: 55 },
  { day: "Wed", attendance: 75 },
  { day: "Thu", attendance: 63 },
  { day: "Fri", attendance: 81 },
  { day: "Sat", attendance: 69 },
  { day: "Sun", attendance: 90 },
];

export const FEE_CHART_DATA = [
  { month: "Jan", Collected: 42 },
  { month: "Feb", Collected: 68 },
  { month: "Mar", Collected: 61 },
  { month: "Apr", Collected: 45 },
  { month: "May", Collected: 88 },
  { month: "Jun", Collected: 48 },
];


export const ACADEMIC_SUBJECTS_DATA = [
  {
    id: "MTH101",
    name: "Maths",
    teacher: "Sharanya Iyer",
    hours: "5h",
    grade: "Grade 5"
  },
  {
    id: "ENG101",
    name: "English",
    teacher: "Karthik Chandran",
    hours: "4h",
    grade: "Grade 5"
  },
  {
    id: "HIS101",
    name: "History",
    teacher: "Deepa Lakshmi",
    hours: "3h",
    grade: "Grade 6"
  },
  {
    id: "ART101",
    name: "Arts",
    teacher: "Malini Hegde",
    hours: "2h",
    grade: "Grade 5"
  },
  {
    id: "PE101",
    name: "PE",
    teacher: "Jayakumar Pillai",
    hours: "2h",
    grade: "Grade 6"
  },
  {
    id: "SCI101",
    name: "Science",
    teacher: "Aswathy Menon",
    hours: "5h",
    grade: "Grade 5"
  }
];


export const ACADEMIC_CLASSES_DATA = [
  { grade: "Grade 3", pass: 95, fail: 5 },
  { grade: "Grade 4", pass: 90, fail: 10 },
  { grade: "Grade 5", pass: 93, fail: 7 },
  { grade: "Grade 6", pass: 88, fail: 12 },
  { grade: "Grade 7", pass: 86, fail: 14 },
  { grade: "Grade 8", pass: 92, fail: 8 }
];

export const FEE_CATEGORY_DATA = [
  { name: 'Tuition', value: 400 },
  { name: 'Transport', value: 100 },
  { name: 'Activity', value: 80 },
  { name: 'Library', value: 40 },
  { name: 'Other', value: 30 }
];

export const ACADEMIC_EXAMS_DATA = [
  { id: 1, name: "English Writing Assessment", status: "Completed", date: "April 16 2026", details: "Grade 6 . English", tracking: "4/6 Passed" },
  { id: 2, name: "Unit Test Mathematics", status: "Completed", date: "April 18 2026", details: "Grade 5 . Mathematics", tracking: "3/8 Passed" },
  { id: 3, name: "Mid Term Examination", status: "Scheduled", date: "April 20-25 2026", details: "Grade 5-8 . All Subjects", tracking: "8/8 Passed" },
];


export const AVAILABLE_GRADES = [
  "Grade 4 · A",
  "Grade 5 · A",
  "Grade 5 · B",
  "Grade 6 · B",
  "Grade 7 · A",
  "Grade 7 · C",
  "Grade 8 · A",
  "Grade 12 · B"
];

// --- COMMUNICATION MODULE MOCK DATA ---

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Annual sports Day 2026",
    priority: "High",
    status: "Published",
    content: "We are excited to announce our annual sports day on April 25th, All students are encouraged to participate in atleast one event. Practice Sessions start from Monday.",
    target: "Everyone",
    date: "2026-04-10",
    author: "Principal Johnson",
    expiry: "2026-04-25"
  },
  {
    id: 2,
    title: "Parent teacher conference schedula",
    priority: "Medium",
    status: "Published",
    content: "The parent teacher conference is scheduled for April 20th.. Please book your slot via the parent portal. Sessions run from 9AM to 5PM.",
    target: "Parent, Staff",
    date: "2026-04-08",
    author: "Admin office",
    expiry: null
  },
  {
    id: 3,
    title: "Library Book Return Reminder",
    priority: "Low",
    status: "Published",
    content: "Please ensure all borrowed books are returned to the library by the end of the week to avoid late fees.",
    target: "Student",
    date: "2026-04-08",
    author: "Library staff",
    expiry: null
  }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "admission", title: "New Admission Request", desc: "A new admission request has been submitted for Grade 5", time: "08.30AM", group: "Today" },
  { id: 2, type: "fee", title: "Fee payment overdue", desc: "12 students have overdue fee payments", time: "07.15AM", group: "Today" },
  { id: 3, type: "attendance", title: "Attendance Alert", desc: "Attendance below 75% for 5 students this week.", time: "09.00AM", group: "Today" },
  { id: 4, type: "system", title: "System update", desc: "Routine maintenance scheduled for midnight.", time: "08.30AM", group: "Yesterday" },
  { id: 5, type: "exam", title: "New exam schedule posted", desc: "Finals schedule for Grade 8 is now available.", time: "07.15AM", group: "Yesterday" }
];

export const INITIAL_BROADCAST = {
  recipients: "512+",
  totalSent: 807,
  emailCount: 3,
  smsCount: 1
};

export const INITIAL_STUDENT_ATTENDANCE = [
  {
    id: 1,
    name: "Ananya Krishnan",
    rollNo: "STU-24001",
    class: "Grade 5 - A",
    gradeGroup: "Grade 5 · A",
    status: "Present",
    remarks: "",
    date: "2026-04-14"
  },
  {
    id: 2,
    name: "Siddharth Venkat",
    rollNo: "STU-24002",
    class: "Grade 6 - B",
    gradeGroup: "Grade 6 · B",
    status: "Absent",
    remarks: "",
    date: "2026-04-14"
  }
];

export const INITIAL_STAFF_ATTENDANCE = [
  {
    id: 1,
    name: "Sharanya Iyer",
    rollNo: "EMP-001",
    class: "Primary Education",
    status: "Present",
    remarks: "",
    date: "2026-04-14"
  },
  {
    id: 2,
    name: "Karthik Chandran",
    rollNo: "EMP-002",
    class: "Secondary Education",
    status: "Late",
    remarks: "",
    date: "2026-04-14"
  }
];

 const schoolData = [
  { id: 1, name: "Arjun Balakrishnan", rollNo: "TN-101", type: "Certificate", date: "2026-06-01", status: "Pending", size: "245KB" },
  { id: 2, name: "Kavitha Iyer", rollNo: "TN-102", type: "Report Card", date: "2026-06-02", status: "Approved", size: "180KB" },
  { id: 3, name: "Karthik Narayanan", rollNo: "TN-103", type: "Certificate", date: "2026-06-03", status: "Pending", size: "310KB" },
  { id: 4, name: "Srividya Menon", rollNo: "TN-104", type: "Student Record", date: "2026-06-04", status: "Pending", size: "150KB" },
  { id: 5, name: "Ananya Subramaniam", rollNo: "TN-105", type: "Report Card", date: "2026-06-05", status: "Approved", size: "220KB" },
  { id: 6, name: "Deepak Ravindran", rollNo: "TN-106", type: "Certificate", date: "2026-06-06", status: "Pending", size: "275KB" },
  { id: 7, name: "Meera Krishnan", rollNo: "TN-107", type: "Student Record", date: "2026-06-07", status: "Approved", size: "190KB" },
  { id: 8, name: "Vijay Ranganathan", rollNo: "TN-108", type: "Report Card", date: "2026-06-08", status: "Rejected", size: "205KB" },
  { id: 9, name: "Lakshmi Priya", rollNo: "TN-109", type: "Certificate", date: "2026-06-09", status: "Pending", size: "300KB" },
  { id: 10, name: "Suresh Babu", rollNo: "TN-110", type: "Student Record", date: "2026-06-10", status: "Pending", size: "175KB" },
];
export default schoolData;
// 3. Central LocalStorage Key Handlers


export const getStorageData = (key) => {
  try {
    const rawData = localStorage.getItem(`edusmart_${key}`);
    // FIX: If data is missing or "undefined", return null to trigger the fallback
    if (!rawData || rawData === "undefined" || rawData === "null") {
      return null;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error parsing data for ${key}:`, error);
    return null;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(`edusmart_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for ${key}:`, error);
  }
};

/**
 * Updates data in localStorage and persists the change.
 */
export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(`edusmart_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for ${key}:`, error);
  }
};