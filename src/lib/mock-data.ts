export type AttendanceStatus = "not-checked-in" | "checked-in" | "on-break" | "checked-out";

export interface OfficeMapPoint {
  id: string;
  name: string;
  address: string;
  radiusMeters: number;
  active: boolean;
  center: [number, number]; // [latitude, longitude]
}

/** Placeholder coordinate lookup for office map points (replace with real data when available). */
export function officeCenterById(id: string): [number, number] {
  const lookup: Record<string, [number, number]> = {
    o1: [12.9066, 80.23], // Northgate Corporate Park — HQ (placeholder)
    o2: [12.932, 80.245], // Westbay Annex (placeholder)
    o3: [12.9784, 77.6408], // Southfield Training Centre (placeholder)
  };
  return lookup[id] ?? [12.9066, 80.23];
}

export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  breakDuration: string;
  totalHours: string;
  location: string;
  status: "Present" | "Late" | "Absent" | "Client Visit" | "Work From Home";
}

export interface ClientOption {
  id: string;
  name: string;
  address: string;
}

export interface ClientVisitRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  client: string;
  address: string;
  date: string;
  time: string;
  purpose: string;
  status: RequestStatus;
}

export interface WfhRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  date: string;
  reason: string;
  status: RequestStatus;
}

export interface AppNotification {
  id: string;
  type: "reminder" | "approval" | "rejection" | "announcement";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface EmployeeRow {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent" | "On Break" | "Client Visit" | "Work From Home" | "Late";
  totalHours: string;
  location: string;
}

export const currentEmployee = {
  name: "Aarav Mehta",
  employeeId: "EMP-2043",
  department: "Field Operations",
  designation: "Senior Field Engineer",
  initials: "AM",
  office: "Northgate Corporate Park — HQ",
  shift: "09:30 — 18:30",
};

export const currentManager = {
  name: "Priya Nair",
  employeeId: "MGR-1007",
  department: "People Operations",
  designation: "HR Manager",
  initials: "PN",
};

export const attendanceHistory: AttendanceRecord[] = [
  {
    id: "a1",
    date: "Thu, 27 Aug 2026",
    checkIn: "09:28 AM",
    checkOut: "06:34 PM",
    breakDuration: "46m",
    totalHours: "8h 20m",
    location: "Northgate HQ",
    status: "Present",
  },
  {
    id: "a2",
    date: "Wed, 26 Aug 2026",
    checkIn: "10:12 AM",
    checkOut: "06:40 PM",
    breakDuration: "38m",
    totalHours: "7h 50m",
    location: "Northgate HQ",
    status: "Late",
  },
  {
    id: "a3",
    date: "Tue, 25 Aug 2026",
    checkIn: "09:05 AM",
    checkOut: "05:55 PM",
    breakDuration: "52m",
    totalHours: "7h 58m",
    location: "Accenture Solution Pvt Ltd(Client)",
    status: "Client Visit",
  },
  {
    id: "a4",
    date: "Mon, 24 Aug 2026",
    checkIn: "09:31 AM",
    checkOut: "06:20 PM",
    breakDuration: "40m",
    totalHours: "8h 09m",
    location: "Home",
    status: "Work From Home",
  },
  {
    id: "a5",
    date: "Fri, 21 Aug 2026",
    checkIn: "—",
    checkOut: "—",
    breakDuration: "—",
    totalHours: "0h 00m",
    location: "—",
    status: "Absent",
  },
  {
    id: "a6",
    date: "Thu, 20 Aug 2026",
    checkIn: "09:22 AM",
    checkOut: "06:31 PM",
    breakDuration: "45m",
    totalHours: "8h 24m",
    location: "Northgate HQ",
    status: "Present",
  },
];

export const clientOptions: ClientOption[] = [
  { id: "c1", name: "Accenture Solutions Pvt Ltd", address: "Divyasree point OMR Chennai" },
  { id: "c2", name: "Capgemini", address: "Cyber tower, Karapakkam, Chennai" },
  { id: "c3", name: "", address: "9 Dockyard Lane, East Port" },
  { id: "c4", name: "Helios Manufacturing", address: "77 Industrial Estate, Ring Road" },
];

export const employeeClientVisits: ClientVisitRequest[] = [
  {
    id: "cv1",
    employeeName: currentEmployee.name,
    employeeId: currentEmployee.employeeId,
    department: currentEmployee.department,
    client: "Accenture Solution Pvt Ltd",
    address: "Divyasree point OMR Chennai",
    date: "29 Aug 2026",
    time: "11:00 AM",
    purpose: "Quarterly hardware audit and handover of replacement units.",
    status: "Pending",
  },
  {
    id: "cv2",
    employeeName: currentEmployee.name,
    employeeId: currentEmployee.employeeId,
    department: currentEmployee.department,
    client: "Gradtwin",
    address: "Tech meadows, Bangalore",
    date: "25 Aug 2026",
    time: "09:30 AM",
    purpose: "On-site installation of scanning terminals.",
    status: "Approved",
  },
  {
    id: "cv3",
    employeeName: currentEmployee.name,
    employeeId: currentEmployee.employeeId,
    department: currentEmployee.department,
    client: "Helios Manufacturing",
    address: "77 Industrial Estate, Ring Road",
    date: "19 Aug 2026",
    time: "02:00 PM",
    purpose: "Site survey — overlapping with scheduled maintenance window.",
    status: "Rejected",
  },
];

export const teamClientVisits: ClientVisitRequest[] = [
  ...employeeClientVisits.filter((v) => v.status === "Pending"),
  {
    id: "cv4",
    employeeName: "Rhea Kapoor",
    employeeId: "EMP-2088",
    department: "Sales",
    client: "Capgemini",
    address: "402 Crest Avenue, Sector 21",
    date: "29 Aug 2026",
    time: "03:30 PM",
    purpose: "Contract renewal discussion with procurement head.",
    status: "Pending",
  },
  {
    id: "cv5",
    employeeName: "Daniel Osei",
    employeeId: "EMP-1994",
    department: "Field Operations",
    client: "Helios Manufacturing",
    address: "77 Industrial Estate, Ring Road",
    date: "30 Aug 2026",
    time: "10:00 AM",
    purpose: "Preventive maintenance for conveyor sensor array.",
    status: "Pending",
  },
];

export const employeeWfhRequests: WfhRequest[] = [
  {
    id: "w1",
    employeeName: currentEmployee.name,
    employeeId: currentEmployee.employeeId,
    department: currentEmployee.department,
    date: "31 Aug 2026",
    reason: "Home internet installation appointment, will be reachable all day.",
    status: "Pending",
  },
  {
    id: "w2",
    employeeName: currentEmployee.name,
    employeeId: currentEmployee.employeeId,
    department: currentEmployee.department,
    date: "24 Aug 2026",
    reason: "Documentation sprint — no on-site dependencies.",
    status: "Approved",
  },
  {
    id: "w3",
    employeeName: currentEmployee.name,
    employeeId: currentEmployee.employeeId,
    department: currentEmployee.department,
    date: "14 Aug 2026",
    reason: "Personal errand.",
    status: "Rejected",
  },
];

export const teamWfhRequests: WfhRequest[] = [
  ...employeeWfhRequests,
  {
    id: "w4",
    employeeName: "Sofia Marino",
    employeeId: "EMP-2110",
    department: "Design",
    date: "31 Aug 2026",
    reason: "Focused design review week, no client meetings scheduled.",
    status: "Pending",
  },
  {
    id: "w5",
    employeeName: "Ken Watanabe",
    employeeId: "EMP-1877",
    department: "Engineering",
    date: "28 Aug 2026",
    reason: "Recovering from flu, able to work remotely.",
    status: "Approved",
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "reminder",
    title: "Check-in reminder",
    body: "Your shift starts at 09:30. You are inside the Northgate HQ geofence.",
    time: "09:15 AM",
    read: false,
  },
  {
    id: "n2",
    type: "approval",
    title: "Client visit approved",
    body: "Tech meadows visit on 25 Aug was approved by Priya Nair.",
    time: "Yesterday",
    read: false,
  },
  {
    id: "n3",
    type: "rejection",
    title: "Work from home rejected",
    body: "Your WFH request for 14 Aug was rejected — team on-site day.",
    time: "13 Aug",
    read: true,
  },
  {
    id: "n4",
    type: "announcement",
    title: "HR announcement",
    body: "Updated attendance policy effective 1 Sep. Grace period reduced to 10 minutes.",
    time: "12 Aug",
    read: true,
  },
];

export const employeeRows: EmployeeRow[] = [
  {
    id: "e1",
    name: "Aarav Mehta",
    employeeId: "EMP-2043",
    department: "Field Operations",
    checkIn: "09:28 AM",
    checkOut: "—",
    status: "Present",
    totalHours: "6h 02m",
    location: "Northgate HQ",
  },
  {
    id: "e2",
    name: "Rhea Kapoor",
    employeeId: "EMP-2088",
    department: "Sales",
    checkIn: "10:14 AM",
    checkOut: "—",
    status: "Late",
    totalHours: "5h 16m",
    location: "Northgate HQ",
  },
  {
    id: "e3",
    name: "Daniel Osei",
    employeeId: "EMP-1994",
    department: "Field Operations",
    checkIn: "08:58 AM",
    checkOut: "—",
    status: "Client Visit",
    totalHours: "6h 32m",
    location: "Helios Manufacturing",
  },
  {
    id: "e4",
    name: "Sofia Marino",
    employeeId: "EMP-2110",
    department: "Design",
    checkIn: "09:41 AM",
    checkOut: "—",
    status: "On Break",
    totalHours: "5h 49m",
    location: "Northgate HQ",
  },
  {
    id: "e5",
    name: "Ken Watanabe",
    employeeId: "EMP-1877",
    department: "Engineering",
    checkIn: "09:05 AM",
    checkOut: "—",
    status: "Work From Home",
    totalHours: "6h 25m",
    location: "Remote — Home",
  },
  {
    id: "e6",
    name: "Leah Brandt",
    employeeId: "EMP-2001",
    department: "Finance",
    checkIn: "—",
    checkOut: "—",
    status: "Absent",
    totalHours: "0h 00m",
    location: "—",
  },
  {
    id: "e7",
    name: "Omar Haddad",
    employeeId: "EMP-1932",
    department: "Engineering",
    checkIn: "09:12 AM",
    checkOut: "05:02 PM",
    status: "Present",
    totalHours: "7h 12m",
    location: "Westbay Annex",
  },
  {
    id: "e8",
    name: "Ines Duarte",
    employeeId: "EMP-2126",
    department: "Sales",
    checkIn: "09:33 AM",
    checkOut: "—",
    status: "Present",
    totalHours: "5h 57m",
    location: "Westbay Annex",
  },
];

export const employeeTimeline = [
  {
    time: "09:28 AM",
    label: "Checked in",
    detail: "Face verified · Northgate HQ geofence",
    tone: "success" as const,
  },
  { time: "11:05 AM", label: "Break started", detail: "Short break", tone: "warning" as const },
  { time: "11:22 AM", label: "Break ended", detail: "17m break duration", tone: "info" as const },
  {
    time: "01:30 PM",
    label: "Lunch break started",
    detail: "Inside geofence",
    tone: "warning" as const,
  },
  {
    time: "02:01 PM",
    label: "Lunch break ended",
    detail: "31m break duration",
    tone: "info" as const,
  },
  {
    time: "03:40 PM",
    label: "Geofence exit detected",
    detail: "Approved client visit — Accenture Solution Pvt Ltd",
    tone: "info" as const,
  },
  {
    time: "05:12 PM",
    label: "Geofence re-entry",
    detail: "Back at Northgate HQ",
    tone: "info" as const,
  },
];

export const dailyAttendanceData = [
  { day: "Mon", present: 118, absent: 12, late: 9 },
  { day: "Tue", present: 124, absent: 8, late: 7 },
  { day: "Wed", present: 121, absent: 10, late: 11 },
  { day: "Thu", present: 128, absent: 6, late: 5 },
  { day: "Fri", present: 112, absent: 18, late: 14 },
  { day: "Sat", present: 64, absent: 4, late: 3 },
];

export const weeklyHoursData = [
  { week: "W-31", hours: 41.5 },
  { week: "W-32", hours: 43.2 },
  { week: "W-33", hours: 39.8 },
  { week: "W-34", hours: 44.1 },
  { week: "W-35", hours: 42.6 },
];

export const departmentAttendanceData = [
  { department: "Engineering", attendance: 94 },
  { department: "Sales", attendance: 88 },
  { department: "Field Ops", attendance: 91 },
  { department: "Design", attendance: 96 },
  { department: "Finance", attendance: 84 },
];

export const breakDurationData = [
  { name: "Under 30m", value: 46 },
  { name: "30–45m", value: 62 },
  { name: "45–60m", value: 28 },
  { name: "Over 60m", value: 11 },
];

export const absenceAlerts = [
  {
    id: "ab1",
    name: "Leah Brandt",
    employeeId: "EMP-2001",
    department: "Finance",
    issue: "Continuous absence",
    detail: "4 consecutive working days absent without an approved leave request.",
    severity: "High" as const,
  },
  {
    id: "ab2",
    name: "Rhea Kapoor",
    employeeId: "EMP-2088",
    department: "Sales",
    issue: "Repeated late arrivals",
    detail: "Late on 6 of the last 10 working days (avg. 38 minutes).",
    severity: "Medium" as const,
  },
  {
    id: "ab3",
    name: "Marcus Cole",
    employeeId: "EMP-1840",
    department: "Engineering",
    issue: "Frequent short leaves",
    detail: "5 single-day leaves taken this month, mostly adjacent to weekends.",
    severity: "Medium" as const,
  },
  {
    id: "ab4",
    name: "Ines Duarte",
    employeeId: "EMP-2126",
    department: "Sales",
    issue: "Extended break pattern",
    detail: "Average break duration of 1h 12m over the last two weeks.",
    severity: "Low" as const,
  },
];

export const officeLocations = [
  {
    id: "o1",
    name: "Northgate Corporate Park — HQ",
    address: "1 Northgate Boulevard, Central District",
    radius: 200,
    employees: 96,
    active: true,
  },
  {
    id: "o2",
    name: "Westbay Annex",
    address: "230 Westbay Street, Harbour Zone",
    radius: 200,
    employees: 41,
    active: true,
  },
  {
    id: "o3",
    name: "Southfield Training Centre",
    address: "5 Southfield Way, Ring Road",
    radius: 200,
    employees: 12,
    active: false,
  },
];

export const hrAlerts = [
  {
    id: "h1",
    severity: "High" as const,
    title: "Suspicious attendance pattern",
    body: "EMP-2088 recorded 3 check-ins from the geofence perimeter edge within 4 minutes.",
    time: "22m ago",
  },
  {
    id: "h2",
    severity: "Medium" as const,
    title: "Repeated late arrivals",
    body: "Sales department late-arrival rate reached 21% this week (threshold 15%).",
    time: "1h ago",
  },
  {
    id: "h3",
    severity: "High" as const,
    title: "Prolonged absence",
    body: "EMP-2001 has been absent for 4 consecutive days with no request on file.",
    time: "3h ago",
  },
  {
    id: "h4",
    severity: "Low" as const,
    title: "Face verification retries",
    body: "EMP-1994 required 3 verification attempts during today's check-in.",
    time: "Yesterday",
  },
];
