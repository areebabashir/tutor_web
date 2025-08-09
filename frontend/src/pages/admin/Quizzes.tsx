import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Eye, BookOpen, Users, Clock, Target } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { quizAPI } from "@/lib/api";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  totalQuestions: number;
  timeLimit: number;
  passingScore: number;
  isActive: boolean;
  totalAttempts?: number;
  averageScore?: number;
  passRate?: number;
  createdAt: string;
  updatedAt: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const { getAuthHeaders } = useAdminAuth();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "IELTS preparation",
    difficulty: "medium",
    passingScore: 28, // 70% of 40 questions
    timeLimit: 30,
    isActive: true
  });

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuizzes();
    fetchStats();
  }, [categoryFilter, difficultyFilter, statusFilter]);

  const fetchQuizzes = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const params: any = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';
      
      const data = await quizAPI.getAllQuizzes(Authorization, params);
      setQuizzes(data.data || []);
    } catch (error) {
      console.error('Fetch quizzes error:', error);
      toast.error('Failed to fetch quizzes');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const data = await quizAPI.getQuizStats(Authorization);
      setStats(data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const initializeQuestions = () => {
    const initialQuestions: Question[] = Array.from({ length: 40 }, (_, index) => ({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }));
    setQuestions(initialQuestions);
  };

  const handleCreateQuiz = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Quiz title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Quiz description is required');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question.trim()) {
        toast.error(`Question ${i + 1} is required`);
        return;
      }
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          toast.error(`Question ${i + 1}, Option ${j + 1} is required`);
          return;
        }
      }
    }

    try {
      const { Authorization } = getAuthHeaders();
      
      await quizAPI.createQuiz({
        title: formData.title.trim(),
        description: formData.description.trim(),
        questions,
        passingScore: formData.passingScore,
        timeLimit: formData.timeLimit,
        category: formData.category,
        difficulty: formData.difficulty
      }, Authorization);

      toast.success('Quiz created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchQuizzes();
      fetchStats();
    } catch (error) {
      console.error('Create quiz error:', error);
      toast.error('Failed to create quiz');
    }
  };

  const handleUpdateQuiz = async () => {
    if (!selectedQuiz) return;

    // Validation
    if (!formData.title.trim()) {
      toast.error('Quiz title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Quiz description is required');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question.trim()) {
        toast.error(`Question ${i + 1} is required`);
        return;
      }
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          toast.error(`Question ${i + 1}, Option ${j + 1} is required`);
          return;
        }
      }
    }

    try {
      const { Authorization } = getAuthHeaders();
      
      await quizAPI.updateQuiz(selectedQuiz._id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        questions,
        passingScore: formData.passingScore,
        timeLimit: formData.timeLimit,
        category: formData.category,
        difficulty: formData.difficulty,
        isActive: formData.isActive
      }, Authorization);

      toast.success('Quiz updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchQuizzes();
      fetchStats();
    } catch (error) {
      console.error('Update quiz error:', error);
      toast.error('Failed to update quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      await quizAPI.deleteQuiz(quizId, Authorization);
      toast.success('Quiz deleted successfully');
      fetchQuizzes();
      fetchStats();
    } catch (error) {
      console.error('Delete quiz error:', error);
      toast.error('Failed to delete quiz');
    }
  };

  const openEditDialog = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
      isActive: quiz.isActive
    });
    
          // Fetch quiz with questions for editing
      try {
        const data = await quizAPI.getQuizById(quiz._id, true);
        setQuestions(data.data.questions || []);
      } catch (error) {
        console.error('Error fetching quiz for editing:', error);
        toast.error('Failed to fetch quiz details');
        setQuestions([]);
      }
    
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsViewDialogOpen(true);
  };

  const openResultsDialog = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsResultsDialogOpen(true);
    setResultsLoading(true);
    
    try {
      const { Authorization } = getAuthHeaders();
      const data = await quizAPI.getQuizResults(quiz._id, Authorization);
      setQuizResults(data.data?.results || data.results || []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      toast.error('Failed to fetch quiz results');
      setQuizResults([]);
    } finally {
      setResultsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "General",
      difficulty: "medium",
      passingScore: 14,
      timeLimit: 30,
      isActive: true
    });
    setQuestions([]);
    setSelectedQuiz(null);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      (updatedQuestions[index] as any)[field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Management</h1>
          <p className="text-muted-foreground">Create and manage quizzes for students</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={initializeQuestions}>
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
                             <DialogDescription>
                 Create a new quiz with 40 multiple choice questions
               </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Quiz Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="IELTS preparation">IELTS preparation</SelectItem>
                    <SelectItem value="Spoken English">Spoken English</SelectItem>
                    <SelectItem value="English for competitive exams">English for competitive exams</SelectItem>
                    <SelectItem value="GRE Vocabulary">GRE Vocabulary</SelectItem>
                  </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                                 <div>
                   <Label htmlFor="passingScore">Passing Score (out of 40)</Label>
                                       <Input
                       id="passingScore"
                       type="number"
                       min="1"
                       max="40"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({...formData, passingScore: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="5"
                    max="120"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>

                             {/* Questions */}
               <div className="space-y-6">
                 <h3 className="text-lg font-semibold">Questions (40 required)</h3>
                {questions.map((question, questionIndex) => (
                  <Card key={questionIndex}>
                    <CardHeader>
                      <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                          placeholder="Enter the question"
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Options *</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <Label>Explanation (optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                          placeholder="Explain the correct answer"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuiz}>
                Create Quiz
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.overview?.totalQuizzes || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stats.overview?.activeQuizzes || 0}
                </p>
                <p className="text-sm text-muted-foreground">Active Quizzes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.overview?.totalAttempts || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.overview?.totalPassed || 0}
                </p>
                <p className="text-sm text-muted-foreground">Passed Attempts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {stats.overview?.inactiveQuizzes || 0}
                </p>
                <p className="text-sm text-muted-foreground">Inactive Quizzes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="category-filter">Category Filter</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="IELTS preparation">IELTS preparation</SelectItem>
                    <SelectItem value="Spoken English">Spoken English</SelectItem>
                    <SelectItem value="English for competitive exams">English for competitive exams</SelectItem>
                    <SelectItem value="GRE Vocabulary">GRE Vocabulary</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="difficulty-filter">Difficulty Filter</Label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
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
            <div className="flex-1">
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
                </div>
                <Badge variant={quiz.isActive ? 'default' : 'secondary'}>
                  {quiz.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{quiz.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <Badge variant="outline" className="capitalize">{quiz.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Questions:</span>
                  <span>{quiz.totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Limit:</span>
                  <span>{quiz.timeLimit} min</span>
                </div>
                                 <div className="flex items-center justify-between text-sm">
                   <span className="text-muted-foreground">Passing Score:</span>
                   <span>{quiz.passingScore}/40</span>
                 </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Participants:</span>
                  <span>{quiz.totalAttempts || 0}</span>
                </div>
                {quiz.totalAttempts && quiz.totalAttempts > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg Score:</span>
                      <span className="font-medium">{quiz.averageScore || 0}/20</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pass Rate:</span>
                      <Badge variant={quiz.passRate && quiz.passRate >= 70 ? 'default' : 'secondary'}>
                        {quiz.passRate || 0}%
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openViewDialog(quiz)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openResultsDialog(quiz)}
                >
                  <Users className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(quiz)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No quizzes found</p>
            <p className="text-sm text-gray-400">Create your first quiz to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
            <DialogDescription>
              Update quiz information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Quiz Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS preparation">IELTS preparation</SelectItem>
                    <SelectItem value="Spoken English">Spoken English</SelectItem>
                    <SelectItem value="English for competitive exams">English for competitive exams</SelectItem>
                    <SelectItem value="GRE Vocabulary">GRE Vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                             <div>
                 <Label htmlFor="edit-passingScore">Passing Score (out of 40)</Label>
                                   <Input
                     id="edit-passingScore"
                     type="number"
                     min="1"
                     max="40"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({...formData, passingScore: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="edit-timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="edit-timeLimit"
                  type="number"
                  min="5"
                  max="120"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setFormData({...formData, isActive: value === 'active'})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

                     {/* Questions Section */}
           {questions.length > 0 && (
             <div className="space-y-6">
               <h3 className="text-lg font-semibold">Edit Questions (40 questions)</h3>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {questions.map((question, questionIndex) => (
                  <Card key={questionIndex}>
                    <CardHeader>
                      <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                          placeholder="Enter the question"
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Options *</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`edit-correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <Label>Explanation (optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                          placeholder="Explain the correct answer"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuiz}>
              Update Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quiz Details</DialogTitle>
            <DialogDescription>
              Complete information about the quiz
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuiz && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-lg font-semibold">{selectedQuiz.title}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-gray-600">{selectedQuiz.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Category</Label>
                  <p className="font-medium">{selectedQuiz.category}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Difficulty</Label>
                  <Badge variant="outline" className="capitalize">{selectedQuiz.difficulty}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Questions</Label>
                  <p className="font-medium">{selectedQuiz.totalQuestions}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Time Limit</Label>
                  <p className="font-medium">{selectedQuiz.timeLimit} minutes</p>
                </div>
                                     <div>
                       <Label className="text-xs text-gray-500">Passing Score</Label>
                       <p className="font-medium">{selectedQuiz.passingScore}/40</p>
                     </div>
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <Badge variant={selectedQuiz.isActive ? 'default' : 'secondary'}>
                    {selectedQuiz.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-500">Created</Label>
                  <p className="font-medium">{formatDate(selectedQuiz.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Last Updated</Label>
                  <p className="font-medium">{formatDate(selectedQuiz.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Results - {selectedQuiz?.title}</DialogTitle>
            <DialogDescription>
              View all participant results for this quiz
            </DialogDescription>
          </DialogHeader>
          
                     {selectedQuiz && (
             <div className="space-y-6">
               {/* Quick Summary */}
               <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Quiz Performance Overview</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                   <div>
                     <p className="text-2xl font-bold text-blue-600">{quizResults.length}</p>
                     <p className="text-sm text-gray-600">Participants</p>
                   </div>
                   <div>
                     <p className="text-2xl font-bold text-green-600">
                       {quizResults.length > 0 
                         ? (quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length).toFixed(1)
                         : '0'
                       }
                     </p>
                     <p className="text-sm text-gray-600">Avg Score</p>
                   </div>
                   <div>
                     <p className="text-2xl font-bold text-purple-600">
                       {quizResults.length > 0 
                         ? Math.round((quizResults.filter(result => result.passed).length / quizResults.length) * 100)
                         : 0
                       }%
                     </p>
                     <p className="text-sm text-gray-600">Pass Rate</p>
                   </div>
                                        <div>
                       <p className="text-2xl font-bold text-orange-600">{selectedQuiz.passingScore}/40</p>
                       <p className="text-sm text-gray-600">Passing Score</p>
                     </div>
                 </div>
               </div>
                             {/* Statistics Cards */}
              

               {/* Additional Statistics */}
               {quizResults.length > 0 && (
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg">Performance Summary</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                       <p className="text-2xl font-bold text-gray-700">
                         {Math.max(...quizResults.map(r => r.score))}/40
                       </p>
                       <p className="text-sm text-gray-600">Highest Score</p>
                     </div>
                     <div className="text-center p-3 bg-gray-50 rounded-lg">
                       <p className="text-2xl font-bold text-gray-700">
                         {Math.min(...quizResults.map(r => r.score))}/40
                       </p>
                       <p className="text-sm text-gray-600">Lowest Score</p>
                     </div>
                       <div className="text-center p-3 bg-gray-50 rounded-lg">
                         <p className="text-2xl font-bold text-gray-700">
                           {Math.round(quizResults.reduce((sum, result) => sum + result.timeTaken, 0) / quizResults.length / 60)}m
                         </p>
                         <p className="text-sm text-gray-600">Avg Time Taken</p>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               )}

              {/* Results Table */}
              {resultsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : quizResults.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Participant Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Name</th>
                            <th className="text-left p-2 font-medium">Email</th>
                            <th className="text-left p-2 font-medium">Score</th>
                            <th className="text-left p-2 font-medium">Percentage</th>
                            <th className="text-left p-2 font-medium">Status</th>
                            <th className="text-left p-2 font-medium">Time Taken</th>
                            <th className="text-left p-2 font-medium">Completed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizResults.map((result, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2">{result.studentName}</td>
                              <td className="p-2 text-sm text-gray-600">{result.studentEmail}</td>
                                                             <td className="p-2 font-medium">
                                 {result.score}/40
                               </td>
                              <td className="p-2">
                                <Badge variant={result.percentage >= 70 ? 'default' : 'secondary'}>
                                  {result.percentage}%
                                </Badge>
                              </td>
                              <td className="p-2">
                                <Badge variant={result.passed ? 'default' : 'destructive'}>
                                  {result.passed ? 'PASSED' : 'FAILED'}
                                </Badge>
                              </td>
                              <td className="p-2 text-sm">
                                {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                              </td>
                              <td className="p-2 text-sm text-gray-600">
                                {formatDate(result.completedAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No participants yet</p>
                    <p className="text-sm text-gray-400">Results will appear here when students take the quiz</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}