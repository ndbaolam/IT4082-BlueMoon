
import { Profile } from "@/components/Profile";

interface ProfilePageProps {
  userRole: "to_truong" | "ke_toan";
}

const ProfilePage = ({ userRole }: ProfilePageProps) => {
  return <Profile userRole={userRole} />;
};

export default ProfilePage;
