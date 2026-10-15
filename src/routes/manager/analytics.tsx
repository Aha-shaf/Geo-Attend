import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/manager/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — GeoAttend Manager" },
      {
        name: "description",
        content:
          "Team attendance analytics with charts for daily, weekly, and departmental trends.",
      },
      { property: "og:title", content: "Analytics — GeoAttend Manager" },
      {
        property: "og:description",
        content: "Attendance and work-hours analytics dashboard.",
      },
    ],
  }),
  component: AnalyticsScreen,
});

// Mock data
const dailyAttendanceData = [
  { date: "Mon, 20", present: 45, absent: 3, onBreak: 2 },
  { date: "Tue, 21", present: 47, absent: 1, onBreak: 2 },
  { date: "Wed, 22", present: 44, absent: 4, onBreak: 2 },
  { date: "Thu, 23", present: 48, absent: 0, onBreak: 2 },
  { date: "Fri, 24", present: 43, absent: 5, onBreak: 2 },
  { date: "Mon, 27", present: 46, absent: 2, onBreak: 2 },
  { date: "Tue, 28", present: 48, absent: 1, onBreak: 1 },
];

const weeklyWorkHoursData = [
  { week: "Week 1", avg: 38.5 },
  { week: "Week 2", avg: 39.2 },
  { week: "Week 3", avg: 38.8 },
  { week: "Week 4", avg: 39.5 },
];

const departmentAttendanceData = [
  { dept: "Field Operations", attendance: 94 },
  { dept: "Sales", attendance: 91 },
  { dept: "Engineering", attendance: 96 },
  { dept: "Design", attendance: 89 },
  { dept: "HR", attendance: 93 },
];

const lateArrivalsData = [
  { date: "20 Aug", count: 2 },
  { date: "21 Aug", count: 0 },
  { date: "22 Aug", count: 1 },
  { date: "23 Aug", count: 0 },
  { date: "24 Aug", count: 3 },
  { date: "27 Aug", count: 1 },
  { date: "28 Aug", count: 0 },
];

const breakDurationData = [
  { name: "30-45 min", value: 22, fill: "#10b981" },
  { name: "45-60 min", value: 18, fill: "#3b82f6" },
  { name: "60-75 min", value: 8, fill: "#f59e0b" },
  { name: "75+ min", value: 2, fill: "#ef4444" },
];

function AnalyticsScreen() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Team attendance and work hours trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Attendance Trend */}
        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Daily attendance trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10b981" name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Attendance */}
        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Department attendance rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Work Hours */}
        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Average weekly work hours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyWorkHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[36, 42]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#8b5cf6"
                name="Avg hours"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Late Arrivals */}
        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Late arrivals by day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lateArrivalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Break Duration Distribution */}
        <div className="card-elevated rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">Break duration distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={breakDurationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {breakDurationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
