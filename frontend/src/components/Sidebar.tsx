
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  DollarSign, 
  FileText, 
  User, 
  LogOut,
  Building2,
  Sparkles,
  UserCheck,
  History,
  CreditCard,
  MapPin,
  Settings
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: "to_truong" | "ke_toan";
  onLogout: () => void;
}

export const Sidebar = ({ userRole, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Trang chủ",
      icon: Home,
      path: "/dashboard",
      roles: ["to_truong", "ke_toan"]
    },
    {
      id: "household",
      label: "Quản lý hộ khẩu",
      icon: Building2,
      path: "/household",
      roles: ["to_truong"]
    },
    {
      id: "person",
      label: "Quản lý nhân khẩu",
      icon: Users,
      path: "/person",
      roles: ["to_truong"]
    },
    {
      id: "fees",
      label: "Quản lý khoản thu",
      icon: DollarSign,
      path: "/fees",
      roles: ["ke_toan"]
    },
    {
      id: "payments",
      label: "Quản lý nộp tiền",
      icon: CreditCard,
      path: "/payments",
      roles: ["to_truong", "ke_toan"]
    },
    {
      id: "household-history",
      label: "Lịch sử hộ khẩu",
      icon: History,
      path: "/household-history",
      roles: ["to_truong", "ke_toan"]
    },
    {
      id: "temporary-residence",
      label: "Tạm trú - Tạm vắng",
      icon: MapPin,
      path: "/temporary-residence",
      roles: ["to_truong"]
    },
    {
      id: "users",
      label: "Quản lý người dùng",
      icon: Settings,
      path: "/users",
      roles: ["to_truong"]
    },
    {
      id: "reports",
      label: "Báo cáo thống kê",
      icon: FileText,
      path: "/reports",
      roles: ["to_truong", "ke_toan"]
    },
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: User,
      path: "/profile",
      roles: ["to_truong", "ke_toan"]
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tổ dân phố</h1>
            <p className="text-sm text-slate-300 capitalize font-medium">
              {userRole === "to_truong" ? "Tổ trưởng" : "Kế toán"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 px-4 text-left transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-r"></div>
                  )}
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md" 
                      : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600 group-hover:text-white"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-400/30 transition-all duration-200"
          onClick={onLogout}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-red-500/10 text-red-400">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="font-medium">Đăng xuất</span>
        </Button>
      </div>
    </div>
  );
};
