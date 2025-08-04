import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  LogOut,
  MessageSquare, // for Contact
  Star, // for Reviews
  HelpCircle, // for Quizzes
  FileText, // for Blogs
  MessageCircle, // for Comments
  Sparkles,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import bizlishLogo from "@/assets/bzlish.jpg";
import { Link } from "react-router-dom";

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen },
  { name: 'Teachers', href: '/admin/teachers', icon: Users },
  { name: 'Enrollments', href: '/admin/enrollments', icon: GraduationCap },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Contact', href: '/admin/contact', icon: MessageSquare },
  { name: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Comments', href: '/admin/comments', icon: MessageCircle },
  { name: 'Notes', href: '/admin/notes', icon: FileText },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, adminUser, debugSession } = useAdminAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/admin/login');
  };

  return (
    <div className="w-72 bg-gradient-to-b from-card to-card/95 backdrop-blur-sm border-r border-border/50 h-screen flex flex-col shadow-lg">
      {/* Logo - Fixed at top */}
      <div className="p-6 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <img 
              src={bizlishLogo} 
              alt="BIZLISH Logo" 
              className="h-16 w-auto rounded-2xl shadow-lg border-2 border-primary/20"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">
              BIZLISH
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Admin Dashboard
            </p>
          </div>
        </div>
        
        {adminUser && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Session Active</span>
            </div>
            <p className="text-sm font-medium text-foreground">Welcome, {adminUser.name}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        )}
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Debug and Logout - Fixed at bottom */}
      <div className="p-4 border-t border-border/50 space-y-2 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-300 mr-3">
            <LogOut className="h-5 w-5" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
