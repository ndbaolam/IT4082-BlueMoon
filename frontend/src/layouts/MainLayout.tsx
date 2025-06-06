
import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
  userRole: "to_truong" | "ke_toan";
  onLogout: () => void;
}

const MainLayout = ({ children, userRole, onLogout }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex w-full">
      <Sidebar 
        currentView=""
        onViewChange={() => {}}
        userRole={userRole}
        onLogout={onLogout}
      />
      <main className="flex-1 ml-64 overflow-auto">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
