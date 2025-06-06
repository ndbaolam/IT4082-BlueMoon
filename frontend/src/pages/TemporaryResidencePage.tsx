
import { TemporaryResidenceManagement } from "@/components/TemporaryResidenceManagement";

interface TemporaryResidencePageProps {
  userRole: "to_truong" | "ke_toan";
}

const TemporaryResidencePage = ({ userRole }: TemporaryResidencePageProps) => {
  return <TemporaryResidenceManagement userRole={userRole} />;
};

export default TemporaryResidencePage;
