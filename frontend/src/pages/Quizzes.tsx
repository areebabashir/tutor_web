import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  BookOpen, 
  Clock, 
  Target, 
  Users, 
  Play, 
  Filter, 
  Sparkles, 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Brain,
  Zap,
  Award,
  TrendingUp,
  Timer,
  Check,
  AlertCircle,
  User as UserIcon
} from "lucide-react";
import { toast } from "sonner";
import { quizAPI } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  totalQuestions: number;
  timeLimit: number;
  totalAttempts?: number;
  averageScore?: number;
  passRate?: number;
}

interface Question {
  question: string;
  options: string[];
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const { handleError } = useErrorHandler();

  // Quiz taking states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    fetchQuizzes();
  }, [categoryFilter, difficultyFilter]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTakingQuiz && timeLeft > 0 && !isQuizSubmitted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isTakingQuiz && timeLeft === 0 && !isQuizSubmitted) {
      // Auto-submit when time runs out
      toast.error('Time is up! Quiz will be submitted automatically.');
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [isTakingQuiz, timeLeft, isQuizSubmitted]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
      
      const data = await quizAPI.getActiveQuizzes(params);
      setQuizzes(data.data || []);
    } catch (error) {
      console.error('Fetch quizzes error:', error);
      toast.error('Failed to fetch quizzes');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quiz: Quiz) => {
    try {
      // Get quiz with questions and correct answers
      const quizData = await quizAPI.getQuizById(quiz._id, true);
      
      const questions = quizData.data.questions;
      const totalQuestions = questions.length;
      
      setQuizQuestions(questions);
      setSelectedQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers(new Array(totalQuestions).fill(-1)); // Initialize with actual number of questions
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      setIsTakingQuiz(true);
      setIsQuizSubmitted(false);
      setShowFeedback(false);
      setIsQuizDialogOpen(true);
      
      // Extract correct answers for color coding
      const correct = questions.map((q: any) => q.correctAnswer);
      setCorrectAnswers(correct);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isQuizSubmitted) return; // Prevent changes after submission
    
    // Prevent changing answer if already answered
    if (answers[currentQuestionIndex] !== -1) {
      toast.info('You cannot change your answer once selected');
      return;
    }
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
    
    // Show feedback immediately when answer is selected
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCancelQuiz = () => {
    const confirmCancel = confirm('Are you sure you want to cancel the quiz? All your progress will be lost.');
    if (confirmCancel) {
      setIsTakingQuiz(false);
      setIsQuizSubmitted(false);
      setIsQuizDialogOpen(false);
      setShowFeedback(false);
      
      // Reset all states
      setAnswers([]);
      setTimeLeft(0);
      setCurrentQuestionIndex(0);
      setQuizQuestions([]);
      setStudentInfo({ name: "", email: "" });
      setCorrectAnswers([]);
      setSelectedQuiz(null);
      
      toast.info('Quiz cancelled');
    }
  };

  const handleSubmitQuiz = async () => {
    // Validate student info
    if (!studentInfo.name.trim() || !studentInfo.email.trim()) {
      toast.error('Please provide your name and email');
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = answers.filter(answer => answer === -1).length;
    if (unansweredQuestions > 0) {
      const confirmSubmit = confirm(`You have ${unansweredQuestions} unanswered questions. Are you sure you want to submit?`);
      if (!confirmSubmit) return;
    }

    try {
      const timeTaken = (selectedQuiz!.timeLimit * 60) - timeLeft; // Time taken in seconds
      
      const result = await quizAPI.submitQuizResult(selectedQuiz!._id, {
        studentId: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
        studentName: studentInfo.name.trim(),
        studentEmail: studentInfo.email.trim(),
        answers: answers.map(answer => answer === -1 ? 0 : answer), // Replace -1 with 0
        timeTaken
      });

      setQuizResult(result.data);
      setIsQuizSubmitted(true);
      setIsTakingQuiz(false);
      setIsQuizDialogOpen(false);
      setIsResultDialogOpen(true);
      
      // Reset states
      setAnswers([]);
      setTimeLeft(0);
      setCurrentQuestionIndex(0);
      setQuizQuestions([]);
      setStudentInfo({ name: "", email: "" });
      setCorrectAnswers([]);
      setShowFeedback(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
      case 'hard': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Target className="h-4 w-4" />;
      case 'hard': return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Brain className="w-4 h-4 mr-2" />
            Test Your Knowledge
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Interactive Quizzes
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Challenge yourself with our comprehensive quizzes designed to test and enhance your business English skills
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center stagger-item animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{quizzes.length}</div>
              <div className="text-muted-foreground font-medium">Available Quizzes</div>
            </div>
            <div className="text-center stagger-item animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20</div>
              <div className="text-muted-foreground font-medium">Questions Each</div>
            </div>
            <div className="text-center stagger-item animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">30</div>
              <div className="text-muted-foreground font-medium">Minutes Time</div>
            </div>
            <div className="text-center stagger-item animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">70%</div>
              <div className="text-muted-foreground font-medium">Pass Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Quizzes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of interactive quizzes designed to test and enhance your knowledge
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-12">
            <Card className="card-modern shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Filter Quizzes</CardTitle>
                    <p className="text-sm text-muted-foreground">Find the perfect quiz for your learning needs</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <Label htmlFor="category-filter" className="text-sm font-medium mb-2 block">Category Filter</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="difficulty-filter" className="text-sm font-medium mb-2 block">Difficulty Filter</Label>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="Filter by difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Summary */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {quizzes.length} Quiz{quizzes.length !== 1 ? 'zes' : ''} Found
                </h3>
                <p className="text-gray-600">Ready to test your knowledge</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Hand-picked by experts</span>
              </div>
            </div>
          </div>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz, index) => (
              <Card key={quiz._id} className="card-modern hover-lift overflow-hidden group stagger-item animate-fade-in-up">
                <div className="relative">
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getDifficultyColor(quiz.difficulty)} flex items-center gap-1`}>
                      {getDifficultyIcon(quiz.difficulty)}
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 pt-16">
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {quiz.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Category:
                      </span>
                      <span className="font-medium">{quiz.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Questions:
                      </span>
                      <span className="font-medium">{quiz.totalQuestions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        Time Limit:
                      </span>
                      <span className="font-medium">{quiz.timeLimit} min</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group-hover:scale-105" 
                    onClick={() => startQuiz(quiz)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {quizzes.length === 0 && (
            <Card className="card-modern">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No quizzes available</h3>
                <p className="text-muted-foreground">Check back later for new quizzes</p>
              </CardContent>
            </Card>
          )}

          {/* Quiz Tips Section */}
          <div className="mt-16">
            <Card className="card-modern shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Quiz Tips & Guidelines</CardTitle>
                    <p className="text-sm text-muted-foreground">Make the most of your quiz experience</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Time Management</h4>
                      <p className="text-sm text-gray-600">Read questions carefully and manage your time effectively</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Focus on Accuracy</h4>
                      <p className="text-sm text-gray-600">Take your time to ensure correct answers rather than rushing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Review Your Work</h4>
                      <p className="text-sm text-gray-600">Double-check your answers before submitting</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Categories Info */}
          <div className="mt-8">
            <Card className="card-modern shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Quiz Categories</CardTitle>
                    <p className="text-sm text-muted-foreground">Explore different subjects and topics</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900">General</h4>
                    <p className="text-xs text-gray-600">Basic knowledge</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900">Mathematics</h4>
                    <p className="text-xs text-gray-600">Problem solving</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900">Science</h4>
                    <p className="text-xs text-gray-600">Scientific concepts</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900">English</h4>
                    <p className="text-xs text-gray-600">Language skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quiz Taking Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={(open) => {
        // Allow closing if not taking quiz or if user confirms
        if (isTakingQuiz && !open) {
          const confirmClose = confirm('Are you sure you want to close the quiz? All progress will be lost.');
          if (!confirmClose) {
            return;
          }
          // Reset states if user confirms closing
          setIsTakingQuiz(false);
          setIsQuizSubmitted(false);
          setShowFeedback(false);
          setAnswers([]);
          setTimeLeft(0);
          setCurrentQuestionIndex(0);
          setQuizQuestions([]);
          setStudentInfo({ name: "", email: "" });
          setCorrectAnswers([]);
          setSelectedQuiz(null);
        }
        setIsQuizDialogOpen(open);
      }}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{selectedQuiz?.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedQuiz?.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {isTakingQuiz && quizQuestions.length > 0 && (
            <div className="space-y-8">
              {/* Student Info Form */}
              {currentQuestionIndex === 0 && (
                <Card className="card-modern">
                  <CardHeader>
                                         <CardTitle className="text-xl flex items-center gap-2">
                       <UserIcon className="h-5 w-5" />
                       Your Information
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="student-name" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="student-name"
                        type="text"
                        value={studentInfo.name}
                        onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
                        className="input-modern"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student-email" className="text-sm font-medium">Email *</Label>
                      <Input
                        id="student-email"
                        type="email"
                        value={studentInfo.email}
                        onChange={(e) => setStudentInfo({...studentInfo, email: e.target.value})}
                        className="input-modern"
                        placeholder="Enter your email"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timer and Progress */}
              <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Timer className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-mono text-lg font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Current Question */}
              <Card className="card-modern">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 leading-relaxed">
                    {quizQuestions[currentQuestionIndex]?.question}
                  </h3>
                  
                  {/* Notice about answer policy */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      ⚠️ Note: Once you select an answer, you cannot change it. Choose carefully!
                    </p>
                  </div>
                  
                  {/* Feedback Message */}
                  {answers[currentQuestionIndex] !== -1 && (
                    <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
                      answers[currentQuestionIndex] === correctAnswers[currentQuestionIndex]
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {answers[currentQuestionIndex] === correctAnswers[currentQuestionIndex]
                        ? '✅ Correct! Well done!'
                        : (() => {
                            const correctAnswerIndex = correctAnswers[currentQuestionIndex];
                            const correctAnswerText = quizQuestions[currentQuestionIndex]?.options[correctAnswerIndex];
                            return `❌ Incorrect. The correct answer is: "${correctAnswerText || 'Not available'}"`;
                          })()
                      }
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {quizQuestions[currentQuestionIndex]?.options.map((option, optionIndex) => {
                      const isSelected = answers[currentQuestionIndex] === optionIndex;
                      const isCorrect = correctAnswers[currentQuestionIndex] === optionIndex;
                      const isWrong = isSelected && !isCorrect;
                      const hasAnswered = answers[currentQuestionIndex] !== -1;
                      
                      let optionClasses = "flex items-center p-4 border-2 rounded-xl transition-all duration-300 group";
                      let radioClasses = "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300";
                      
                      if (isQuizSubmitted) {
                        // After submission, show correct/incorrect colors
                        if (isCorrect) {
                          optionClasses += " border-green-500 bg-green-50 shadow-lg";
                          radioClasses += " border-green-500 bg-green-500";
                        } else if (isWrong) {
                          optionClasses += " border-red-500 bg-red-50 shadow-lg";
                          radioClasses += " border-red-500 bg-red-500";
                        } else {
                          optionClasses += " border-gray-300 bg-gray-50";
                          radioClasses += " border-gray-300 bg-gray-300";
                        }
                      } else if (hasAnswered) {
                        // Show feedback immediately when any answer is selected
                        if (isCorrect) {
                          // Always show correct answer in green
                          optionClasses += " border-green-500 bg-green-50 shadow-lg";
                          radioClasses += " border-green-500 bg-green-500";
                        } else if (isSelected) {
                          // Show selected wrong answer in red
                          optionClasses += " border-red-500 bg-red-50 shadow-lg";
                          radioClasses += " border-red-500 bg-red-500";
                        } else {
                          // Show unselected options in gray
                          optionClasses += " border-gray-300 bg-gray-50";
                          radioClasses += " border-gray-300 bg-gray-300";
                        }
                      } else {
                        // Before any answer is selected
                        if (isSelected) {
                          optionClasses += " border-primary bg-primary/5 shadow-lg";
                          radioClasses += " border-primary bg-primary";
                        } else {
                          optionClasses += " border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
                          radioClasses += " border-border group-hover:border-primary/50";
                        }
                      }
                      
                      return (
                        <label
                          key={optionIndex}
                          className={`${optionClasses} ${hasAnswered && !isSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className={radioClasses}>
                            {(isSelected || isCorrect) && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                            {isSelected && !isCorrect && (
                              <XCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-base leading-relaxed">{option}</span>
                          {!isQuizSubmitted && !hasAnswered && (
                            <input
                              type="radio"
                              name={`question-${currentQuestionIndex}`}
                              value={optionIndex}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(optionIndex)}
                              className="sr-only"
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0 || isQuizSubmitted}
                    className="border-2 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 font-semibold py-2 px-4 rounded-xl transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCancelQuiz}
                    disabled={isQuizSubmitted}
                    className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold py-2 px-4 rounded-xl transition-all duration-300"
                  >
                    Cancel Quiz
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  {!isQuizSubmitted ? (
                    currentQuestionIndex < quizQuestions.length - 1 ? (
                      <Button onClick={handleNextQuestion} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmitQuiz} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <Check className="h-4 w-4 mr-2" />
                        Submit Quiz
                      </Button>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <CheckCircle className="h-5 w-5" />
                      Quiz Submitted
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Beautiful Results Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="max-w-2xl">
          {quizResult && (
            <div className="text-center space-y-8">
              {/* Success/Failure Animation */}
              <div className="relative">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                  quizResult.passed 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-600 animate-pulse' 
                    : 'bg-gradient-to-r from-red-400 to-pink-600 animate-pulse'
                }`}>
                  {quizResult.passed ? (
                    <Trophy className="h-16 w-16 text-white" />
                  ) : (
                    <AlertCircle className="h-16 w-16 text-white" />
                  )}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Result Header */}
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {quizResult.passed ? '🎉 Congratulations!' : '💪 Keep Learning!'}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {quizResult.passed 
                    ? 'You have successfully passed the quiz!' 
                    : 'Don\'t worry, every attempt is a learning opportunity!'}
                </p>
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{quizResult.score}</div>
                  <div className="text-sm text-blue-600 font-medium">Your Score</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{quizResult.percentage}%</div>
                  <div className="text-sm text-green-600 font-medium">Percentage</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{quizResult.passingScore}</div>
                  <div className="text-sm text-purple-600 font-medium">Passing Score</div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <Badge className={`text-lg px-6 py-3 rounded-full ${
                  quizResult.passed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                }`}>
                  {quizResult.passed ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  {quizResult.passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => setIsResultDialogOpen(false)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Take Another Quiz
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsResultDialogOpen(false)}
                  className="border-2 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
} 