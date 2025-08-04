import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </div>
      
      {/* Main Content with left margin to account for fixed sidebar */}
      <main className="flex-1 ml-72 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}