
import { Dashboard } from "@/components/Dashboard";

interface DashboardPageProps {
  userRole: "to_truong" | "ke_toan";
}

const DashboardPage = ({ userRole }: DashboardPageProps) => {
  return <Dashboard userRole={userRole} />;
};

export default DashboardPage;
