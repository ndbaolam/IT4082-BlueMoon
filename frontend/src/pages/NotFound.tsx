
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
          <CardTitle className="text-2xl text-gray-900">Trang không tồn tại</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate("/")} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
