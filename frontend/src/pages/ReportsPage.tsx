
import { Reports } from "@/components/Reports";

interface ReportsPageProps {
  userRole: "to_truong" | "ke_toan";
}

const ReportsPage = ({ userRole }: ReportsPageProps) => {
  return <Reports userRole={userRole} />;
};

export default ReportsPage;
