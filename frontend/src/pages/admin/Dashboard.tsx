import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, MessageSquare, Loader2, TrendingUp, Sparkles, Target, Award, Globe, BarChart3, PieChart, Activity, Zap, Clock, CheckCircle, XCircle, AlertCircle, FileText, Download } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { courseAPI, studentAPI, teacherAPI, reviewAPI, quizAPI, notesAPI } from "@/lib/api";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalTeachers: number;
  totalReviews: number;
  totalQuizzes: number;
  totalQuizAttempts: number;
  averageQuizScore: number;
  passingRate: number;
  failingRate: number;
}

interface RecentEnrollment {
  _id: string;
  name: string;
  email: string;
  course?: string;
  createdAt: string;
  status?: string;
}

interface TopCourse {
  _id: string;
  title: string;
  instructor?: string;
  enrollments?: number;
  price?: number;
}

interface QuizStats {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  passingRate: number;
  failingRate: number;
  recentAttempts: Array<{
    quizTitle: string;
    studentName: string;
    score: number;
    passed: boolean;
    date: string;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  monthlyAttempts: Array<{
    month: string;
    attempts: number;
    averageScore: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalReviews: 0,
    totalQuizzes: 0,
    totalQuizAttempts: 0,
    averageQuizScore: 0,
    passingRate: 0,
    failingRate: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStats>({
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    passingRate: 0,
    failingRate: 0,
    recentAttempts: [],
    scoreDistribution: [],
    monthlyAttempts: []
  });
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders } = useAdminAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { Authorization } = getAuthHeaders();

      // Fetch all data in parallel
      const [
        coursesResponse,
        studentsResponse,
        teachersResponse,
        reviewsResponse,
        quizzesResponse,
        quizResultsResponse,
        quizStatsResponse,
        notesStatsResponse
      ] = await Promise.all([
        courseAPI.getAllCourses(),
        studentAPI.getAllStudents(Authorization),
        teacherAPI.getAllTeachers(Authorization),
        reviewAPI.getAllReviews(Authorization, { limit: 1 }), // Just get count
        quizAPI.getAllQuizzes(Authorization),
        quizAPI.getAllQuizResults(Authorization, { limit: 100 }), // Get more results for better stats
        quizAPI.getQuizStats(Authorization),
        notesAPI.getNotesStats(Authorization)
      ]);

      // Extract data
      const courses = coursesResponse.data || [];
      const students = studentsResponse.data || [];
      const teachers = teachersResponse.data || [];
      const reviews = reviewsResponse.data || [];
      const quizzes = quizzesResponse.data || [];
      const quizResults = quizResultsResponse.data || [];
      const quizStats = quizStatsResponse.data || {};
      const notesStats = notesStatsResponse.data || {};

      // Calculate quiz statistics from real data
      const totalAttempts = quizResults.length;
      const passedAttempts = quizResults.filter((result: any) => result.passed).length;
      
      // Calculate average score as percentage
      const totalScore = quizResults.reduce((sum: number, result: any) => {
        const percentage = (result.score / result.totalQuestions) * 100;
        return sum + percentage;
      }, 0);
      const averageScore = totalAttempts > 0 ? totalScore / totalAttempts : 0;
      
      const passingRate = totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0;
      const failingRate = 100 - passingRate;

      // Generate score distribution from real data
      const scoreRanges = [
        { min: 0, max: 49, label: '0-49%' },
        { min: 50, max: 69, label: '50-69%' },
        { min: 70, max: 89, label: '70-89%' },
        { min: 90, max: 100, label: '90-100%' }
      ];

      const scoreDistribution = scoreRanges.map(range => {
        const count = quizResults.filter((result: any) => {
          const percentage = (result.score / result.totalQuestions) * 100;
          return percentage >= range.min && percentage <= range.max;
        }).length;
        return {
          range: range.label,
          count,
          percentage: totalAttempts > 0 ? (count / totalAttempts) * 100 : 0
        };
      });

      // If no real score data, generate mock data
      if (totalAttempts === 0) {
        scoreDistribution[0] = { range: '0-49%', count: 8, percentage: 20 }; // Failing
        scoreDistribution[1] = { range: '50-69%', count: 12, percentage: 30 }; // Below Average
        scoreDistribution[2] = { range: '70-89%', count: 15, percentage: 37.5 }; // Good
        scoreDistribution[3] = { range: '90-100%', count: 5, percentage: 12.5 }; // Excellent
      }

      // Generate monthly attempts data from real data
      const monthlyData = {};
      quizResults.forEach((result: any) => {
        const date = new Date(result.completedAt || result.createdAt);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { attempts: 0, totalScore: 0 };
        }
        monthlyData[monthKey].attempts++;
        // Calculate percentage for average score
        const percentage = (result.score / result.totalQuestions) * 100;
        monthlyData[monthKey].totalScore += percentage;
      });

      // If no real data, generate some mock data for demonstration
      if (Object.keys(monthlyData).length === 0) {
        const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];
        months.forEach(month => {
          monthlyData[month] = { 
            attempts: Math.floor(Math.random() * 20) + 5,
            totalScore: Math.floor(Math.random() * 1000) + 500
          };
        });
      }

      const monthlyAttempts = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
        month,
        attempts: data.attempts,
        averageScore: data.attempts > 0 ? Math.round(data.totalScore / data.attempts) : 0
      }));

      // Get recent quiz attempts from real data
      const recentAttempts = quizResults
        .sort((a: any, b: any) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())
        .slice(0, 5)
        .map((result: any) => {
          const percentage = (result.score / result.totalQuestions) * 100;
          return {
            quizTitle: result.quizTitle || 'Unknown Quiz',
            studentName: result.studentName || result.name || 'Unknown Student',
            score: Math.round(percentage), // Display as percentage
            passed: result.passed,
            date: result.completedAt || result.createdAt
          };
        });

      // If no real attempts, generate mock data
      if (recentAttempts.length === 0) {
        const mockAttempts = [
          { quizTitle: 'English Grammar Quiz', studentName: 'John Doe', score: 34, passed: true, date: new Date().toISOString() }, // 85% (34/40)
          { quizTitle: 'Vocabulary Test', studentName: 'Jane Smith', score: 37, passed: true, date: new Date(Date.now() - 86400000).toISOString() }, // 92% (37/40)
          { quizTitle: 'Reading Comprehension', studentName: 'Mike Johnson', score: 26, passed: false, date: new Date(Date.now() - 172800000).toISOString() }, // 65% (26/40)
          { quizTitle: 'Writing Skills', studentName: 'Sarah Wilson', score: 31, passed: true, date: new Date(Date.now() - 259200000).toISOString() }, // 78% (31/40)
          { quizTitle: 'Listening Test', studentName: 'Alex Brown', score: 35, passed: true, date: new Date(Date.now() - 345600000).toISOString() } // 88% (35/40)
        ];
        recentAttempts.push(...mockAttempts);
      }

      setQuizStats({
        totalQuizzes: quizzes.length,
        totalAttempts,
        averageScore: Math.round(averageScore),
        passingRate: Math.round(passingRate),
        failingRate: Math.round(failingRate),
        recentAttempts,
        scoreDistribution,
        monthlyAttempts
      });

      // Update stats
      setStats({
        totalCourses: courses.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalReviews: reviews.length,
        totalQuizzes: quizzes.length,
        totalQuizAttempts: totalAttempts,
        averageQuizScore: Math.round(averageScore),
        passingRate: Math.round(passingRate),
        failingRate: Math.round(failingRate)
      });

      // Update stats cards with notes data
      const statsCards = [
        {
          title: "Total Courses",
          value: courses.length,
          change: "+12%",
          changeType: "positive" as const,
          icon: BookOpen,
          description: "Active courses"
        },
        {
          title: "Total Students",
          value: students.length,
          change: "+8%",
          changeType: "positive" as const,
          icon: Users,
          description: "Enrolled students"
        },
        {
          title: "Total Teachers",
          value: teachers.length,
          change: "+5%",
          changeType: "positive" as const,
          icon: GraduationCap,
          description: "Active instructors"
        },
        {
          title: "Total Reviews",
          value: reviews.length,
          change: "+15%",
          changeType: "positive" as const,
          icon: MessageSquare,
          description: "Student feedback"
        },
        {
          title: "Total Notes",
          value: notesStats.totalNotes || 0,
          change: "+20%",
          changeType: "positive" as const,
          icon: FileText,
          description: "Educational materials"
        },
        {
          title: "Total Downloads",
          value: notesStats.totalDownloads || 0,
          change: "+25%",
          changeType: "positive" as const,
          icon: Download,
          description: "Notes downloads"
        }
      ];

      // Get recent enrollments (last 5 students)
      const recentStudents = students
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((student: any) => ({
          _id: student._id,
          name: student.name,
          email: student.email,
          course: student.course || 'Not specified',
          createdAt: student.createdAt,
          status: 'Enrolled'
        }));

      setRecentEnrollments(recentStudents);

      // Get top courses (sorted by title for now, since we don't have enrollment count)
      const sortedCourses = courses
        .sort((a: any, b: any) => a.title.localeCompare(b.title))
        .slice(0, 3)
        .map((course: any) => ({
          _id: course._id,
          title: course.title,
          instructor: course.instructorName || 'Unknown',
          enrollments: Math.floor(Math.random() * 50) + 10, // Mock data
          price: course.price || 0
        }));

      setTopCourses(sortedCourses);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const chartConfig = {
    scoreDistribution: {
      "0-49%": { label: "Failing (0-49%)", color: "#ef4444" },
      "50-69%": { label: "Below Average (50-69%)", color: "#f59e0b" },
      "70-89%": { label: "Good (70-89%)", color: "#10b981" },
      "90-100%": { label: "Excellent (90-100%)", color: "#3b82f6" }
    },
    monthlyAttempts: {
      attempts: { label: "Quiz Attempts", color: "#8b5cf6" },
      averageScore: { label: "Average Score", color: "#06b6d4" }
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Loading your dashboard data...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Preparing your insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with BIZLISH.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="card-modern hover-lift border-2 border-transparent hover:border-primary/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor} border ${stat.borderColor}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Passing Rate Card */}
        <Card className="card-modern animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Passing Rate</CardTitle>
                <p className="text-sm text-muted-foreground">Students who passed quizzes</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.passingRate}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.passingRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {quizStats.totalAttempts} total attempts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Failing Rate Card */}
        <Card className="card-modern animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Failing Rate</CardTitle>
                <p className="text-sm text-muted-foreground">Students who failed quizzes</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.failingRate}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-pink-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.failingRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Needs improvement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Average Score Card */}
        <Card className="card-modern animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Average Score</CardTitle>
                <p className="text-sm text-muted-foreground">Overall quiz performance</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.averageQuizScore}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.averageQuizScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {quizStats.totalAttempts} attempts analyzed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution Chart */}
        <Card className="card-modern animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Score Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Quiz performance breakdown</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig.scoreDistribution}>
              <RechartsPieChart>
                <Pie
                  data={quizStats.scoreDistribution}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {quizStats.scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig.scoreDistribution[entry.range]?.color || "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Quiz Attempts Chart */}
        <Card className="card-modern animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Monthly Quiz Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Quiz attempts over time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig.monthlyAttempts}>
              <BarChart data={quizStats.monthlyAttempts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="attempts" fill="#8b5cf6" name="Quiz Attempts" />
                <Line yAxisId="right" type="monotone" dataKey="averageScore" stroke="#06b6d4" name="Average Score" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quiz Attempts */}
        <Card className="card-modern animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Recent Quiz Attempts</CardTitle>
                <p className="text-sm text-muted-foreground">Latest quiz performances</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizStats.recentAttempts.length > 0 ? (
                quizStats.recentAttempts.map((attempt, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        attempt.passed 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-r from-red-500 to-pink-600'
                      }`}>
                        {attempt.passed ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {attempt.studentName}
                        </p>
                        <p className="text-sm text-muted-foreground">{attempt.quizTitle}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(attempt.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        attempt.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {attempt.score}%
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        attempt.passed 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {attempt.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No quiz attempts yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="card-modern animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Recent Student Enrollments</CardTitle>
                <p className="text-sm text-muted-foreground">Latest students who joined BIZLISH</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.length > 0 ? (
                recentEnrollments.map((enrollment, index) => (
                  <div key={enrollment._id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {enrollment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {enrollment.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{enrollment.course}</p>
                        <p className="text-xs text-muted-foreground">{enrollment.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{formatDate(enrollment.createdAt)}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent enrollments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}