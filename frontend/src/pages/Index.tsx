
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
import apiClient from '../axiosConfig.ts'
import { useAuth } from '@/context/AuthContext';

const Index = () => {  
  const {userRole, setUserRole, isLoggedIn, setIsLoggedIn } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token"); 
  
      await apiClient.post(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      localStorage.removeItem("access_token"); // Clear the token
      setIsLoggedIn(false); // Update state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Có lỗi xảy ra khi đăng xuất!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
  
    if (token) {      
      setIsLoggedIn(true);
    } else if (location.pathname !== "/" && location.pathname !== "/login") {      
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  if (!isLoggedIn) {
    return <Login />;
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