
import { HouseholdHistoryManagement } from "@/components/HouseholdHistoryManagement";

interface HouseholdHistoryPageProps {
  userRole: "to_truong" | "ke_toan";
}

const HouseholdHistoryPage = ({ userRole }: HouseholdHistoryPageProps) => {
  return <HouseholdHistoryManagement userRole={userRole} />;
};

export default HouseholdHistoryPage;
