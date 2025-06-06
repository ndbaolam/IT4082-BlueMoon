
import { PaymentManagement } from "@/components/PaymentManagement";

interface PaymentPageProps {
  userRole: "to_truong" | "ke_toan";
}

const PaymentPage = ({ userRole }: PaymentPageProps) => {
  return <PaymentManagement userRole={userRole} />;
};

export default PaymentPage;
