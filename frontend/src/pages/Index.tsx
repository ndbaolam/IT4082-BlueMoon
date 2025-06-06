
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Login } from "@/components/Login";
import MainLayout from "@/layouts/MainLayout";
import DashboardPage from "./DashboardPage";
import HouseholdPage from "./HouseholdPage";
import PersonPage from "./PersonPage";
import FeePage from "./FeePage";
import PaymentPage from "./PaymentPage";
import HouseholdHistoryPage from "./HouseholdHistoryPage";
import TemporaryResidencePage from "./TemporaryResidencePage";
import UserPage from "./UserPage";
import ReportsPage from "./ReportsPage";
import ProfilePage from "./ProfilePage";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"to_truong" | "ke_toan">("to_truong");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (role: "to_truong" | "ke_toan") => {
    setIsLoggedIn(true);
    setUserRole(role);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/" && location.pathname !== "/login") {
      navigate("/");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPageContent = () => {
    switch (location.pathname) {
      case "/dashboard":
        return <DashboardPage userRole={userRole} />;
      case "/household":
        return <HouseholdPage userRole={userRole} />;
      case "/person":
        return <PersonPage userRole={userRole} />;
      case "/fees":
        return <FeePage userRole={userRole} />;
      case "/payments":
        return <PaymentPage userRole={userRole} />;
      case "/household-history":
        return <HouseholdHistoryPage userRole={userRole} />;
      case "/temporary-residence":
        return <TemporaryResidencePage userRole={userRole} />;
      case "/users":
        return <UserPage userRole={userRole} />;
      case "/reports":
        return <ReportsPage userRole={userRole} />;
      case "/profile":
        return <ProfilePage userRole={userRole} />;
      default:
        return <DashboardPage userRole={userRole} />;
    }
  };

  return (
    <MainLayout userRole={userRole} onLogout={handleLogout}>
      {renderPageContent()}
    </MainLayout>
  );
};

export default Index;
