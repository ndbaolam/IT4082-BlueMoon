
import { FeeManagement } from "@/components/FeeManagement";

interface FeePageProps {
  userRole: "to_truong" | "ke_toan";
}

const FeePage = ({ userRole }: FeePageProps) => {
  return <FeeManagement userRole={userRole} />;
};

export default FeePage;
