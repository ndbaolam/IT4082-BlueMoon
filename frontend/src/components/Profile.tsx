import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Settings } from "lucide-react";
import apiClient from "@/axiosConfig";
interface ProfileProps {
  userRole: "to_truong" | "ke_toan";
}

export const Profile = ({ userRole }: ProfileProps) => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    joinDate: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Lấy thông tin cá nhân từ backend
    apiClient
      .get("/users/me")
      .then((response) => {
        const data = response.data;
        setProfileData({
          fullName: `${data.first_name} ${data.last_name}`,
          email: data.email,
          phone: data.sodienthoai || "",
          address: data.diachi || "",
          joinDate: data.created_at
            ? new Date(data.created_at).toLocaleDateString("vi-VN")
            : "",
        });
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, []);


  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put(`/users/${profileData.email}`, {
        first_name: profileData.fullName.split(" ")[0],
        last_name: profileData.fullName.split(" ").slice(1).join(" "),
        sodienthoai: profileData.phone,
        diachi: profileData.address,
      });
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      alert("Cập nhật thông tin thất bại!");
    }
  };

    const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await apiClient.put(`/users/${profileData.email}`, {
        password: passwordData.newPassword,
      });
      alert("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert("Đổi mật khẩu thất bại!");
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản và cài đặt bảo mật</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                {profileData.fullName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{profileData.fullName}</CardTitle>
            <CardDescription className="capitalize">
              {userRole === "to_truong" ? "Tổ trưởng" : "Kế toán"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{profileData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số điện thoại:</span>
                <span className="font-medium">{profileData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày tham gia:</span>
                <span className="font-medium">{profileData.joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Mật khẩu
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="profile" className="space-y-4">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Ngày tham gia</Label>
                      <Input
                        id="joinDate"
                        value={profileData.joinDate}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit">Cập nhật thông tin</Button>
                </form>
              </TabsContent>

              <TabsContent value="password" className="space-y-4">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                  <Button type="submit">Đổi mật khẩu</Button>
                </form>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Cài đặt hệ thống</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Thông báo email</div>
                        <div className="text-sm text-gray-500">Nhận thông báo qua email</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Bật
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Đồng bộ dữ liệu</div>
                        <div className="text-sm text-gray-500">Tự động đồng bộ dữ liệu</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Bật
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Sao lưu tự động</div>
                        <div className="text-sm text-gray-500">Sao lưu dữ liệu hàng ngày</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Bật
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};