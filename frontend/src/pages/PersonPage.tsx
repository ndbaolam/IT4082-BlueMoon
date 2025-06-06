
import { PersonManagement } from "@/components/PersonManagement";

interface PersonPageProps {
  userRole: "to_truong" | "ke_toan";
}

const PersonPage = ({ userRole }: PersonPageProps) => {
  return <PersonManagement userRole={userRole} />;
};

export default PersonPage;
