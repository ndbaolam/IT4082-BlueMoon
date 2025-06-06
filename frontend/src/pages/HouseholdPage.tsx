
import { HouseholdManagement } from "@/components/HouseholdManagement";

interface HouseholdPageProps {
  userRole: "to_truong" | "ke_toan";
}

const HouseholdPage = ({ userRole }: HouseholdPageProps) => {
  return <HouseholdManagement userRole={userRole} />;
};

export default HouseholdPage;
