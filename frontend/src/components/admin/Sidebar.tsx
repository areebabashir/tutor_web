import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    name: 'Enrollments',
    href: '/admin/enrollments',
    icon: Users,
  },
  {
    name: 'Teachers',
    href: '/admin/teachers',
    icon: GraduationCap,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Digital Tutor Club
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-primary text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            // In a real app, handle logout here
            window.location.href = '/';
          }}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}