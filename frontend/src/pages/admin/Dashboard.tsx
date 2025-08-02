import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, TrendingUp } from "lucide-react";
import { mockCourses, mockEnrollments, mockTeachers } from "@/lib/mockData";

const stats = [
  {
    title: "Total Courses",
    value: mockCourses.length,
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Total Enrollments",
    value: mockEnrollments.length,
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    title: "Total Teachers",
    value: mockTeachers.length,
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    title: "Revenue",
    value: "$24,589",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  }
];

export default function AdminDashboard() {
  const recentEnrollments = mockEnrollments.slice(0, 5);
  const topCourses = mockCourses
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{enrollment.studentName}</p>
                    <p className="text-sm text-muted-foreground">{enrollment.courseName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{enrollment.enrolledAt}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enrollment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : enrollment.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enrollment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.tutor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{course.enrollments} students</p>
                    <p className="text-sm text-muted-foreground">${course.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}