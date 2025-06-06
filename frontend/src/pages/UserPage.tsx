
import { UserManagement } from "@/components/UserManagement";

interface UserPageProps {
  userRole: "to_truong" | "ke_toan";
}

const UserPage = ({ userRole }: UserPageProps) => {
  return <UserManagement userRole={userRole} />;
};

export default UserPage;
