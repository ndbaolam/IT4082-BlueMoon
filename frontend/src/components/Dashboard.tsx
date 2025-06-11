import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, DollarSign, FileText, TrendingUp, TrendingDown } from "lucide-react";
import apiClient from "@/axiosConfig";
interface DashboardProps {
  userRole: "to_truong" | "ke_toan";
}

export const Dashboard = ({ userRole }: DashboardProps) => {
  const [stats, setStats] = useState({
    totalHouseholds: 0,
    totalPersons: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    monthlyGrowth: 0,
    collectionRate: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Lấy tổng số hộ khẩu
    apiClient.get("/hokhau/")
      .then(res => setStats(prev => ({ ...prev, totalHouseholds: res.data.length })))
      .catch(() => { });

    // Lấy tổng số nhân khẩu
    apiClient.get("/nhankhau/")
      .then(res => setStats(prev => ({ ...prev, totalPersons: res.data.length })))
      .catch(() => { });

    // Lấy tổng thu nhập (tổng tiền đã thu)
    apiClient.get("/noptien/")
      .then(res => {
        const totalRevenue = res.data.reduce((sum: number, nt: any) => sum + Number(nt.sotien || 0), 0);
        setStats(prev => ({ ...prev, totalRevenue }));
      })
      .catch(() => { });

    // Lấy hoạt động gần đây (ví dụ lấy 5 khoản thu mới nhất)
    apiClient.get("/khoanthu/")
      .then(res => {
        const activities = res.data.slice(-5).reverse().map((item: any) => ({
          id: item.id,
          type: "khoanthu",
          action: "Thêm khoản thu",
          details: item.tenkhoanthu,
          time: item.created_at || "",
        }));
        setRecentActivities(activities);
      })
      .catch(() => { });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Trang chủ - {userRole === "to_truong" ? "Tổ trưởng" : "Kế toán"}
        </h1>
        <p className="text-gray-600">Tổng quan về tình hình tổ dân phố</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Tổng hộ khẩu
            </CardTitle>
            <Home className="w-4 h-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHouseholds}</div>
            <div className="flex items-center text-xs text-blue-100">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{stats.monthlyGrowth}% từ tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">
              Tổng nhân khẩu
            </CardTitle>
            <Users className="w-4 h-4 text-green-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPersons}</div>
            <div className="flex items-center text-xs text-green-100">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12 người trong tháng
            </div>
          </CardContent>
        </Card>

        {userRole === "ke_toan" && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Tổng thu nhập
              </CardTitle>
              <DollarSign className="w-4 h-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <div className="flex items-center text-xs text-purple-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.5% từ tháng trước
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">
              Tỷ lệ thu phí
            </CardTitle>
            <FileText className="w-4 h-4 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collectionRate}%</div>
            <div className="flex items-center text-xs text-orange-100">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1% từ tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Hoạt động gần đây</CardTitle>
            <CardDescription>Những thay đổi mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50/50">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'household' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Thao tác nhanh</CardTitle>
            <CardDescription>Các chức năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                <Home className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium">Thêm hộ khẩu</p>
                <p className="text-sm text-gray-600">Đăng ký hộ khẩu mới</p>
              </div>
              <div className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium">Thêm nhân khẩu</p>
                <p className="text-sm text-gray-600">Đăng ký nhân khẩu mới</p>
              </div>
              {userRole === "ke_toan" && (
                <>
                  <div className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                    <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="font-medium">Thu phí</p>
                    <p className="text-sm text-gray-600">Ghi nhận khoản thu</p>
                  </div>
                  <div className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                    <FileText className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="font-medium">Báo cáo</p>
                    <p className="text-sm text-gray-600">Tạo báo cáo thống kê</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
