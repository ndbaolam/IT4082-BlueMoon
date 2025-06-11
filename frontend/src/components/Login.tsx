import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import qs from "qs";
import apiClient from "@/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext'

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    vaitro: "to_truong",
    first_name: "",
    last_name: "",
    sodienthoai: "",
    diachi: "",
  });
  
  const {userRole, setUserRole, isLoggedIn, setIsLoggedIn } = useAuth()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/users/register", {
        password: formData.password,
        vaitro: formData.vaitro,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        sodienthoai: formData.sodienthoai,
        diachi: formData.diachi,
      });

      if (response.status === 201 || response.status === 200) {
        alert("Đăng ký thành công!");
        setIsLoggedIn(true);
      } else {
        alert("Đăng ký thất bại!");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        alert("Lỗi: " + error.response.data.detail);
      } else {
        alert("Có lỗi xảy ra trong quá trình đăng ký!");
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.post(
        "/users/login",
        qs.stringify({
          username: email.trim(),
          password: password.trim(),
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Login successful:", data);
        localStorage.setItem("access_token", data.access_token);
        setIsLoggedIn(true)
        setUserRole(data.vaitro)
        navigate("/dashboard");
      } else {
        alert("Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Sai thông tin đăng nhập!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLoggedIn ? "Đăng nhập hệ thống" : "Đăng ký tài khoản"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLoggedIn
                ? "Quản lý tổ dân phố"
                : "Tạo tài khoản mới để truy cập hệ thống"}
            </CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tên đăng nhập
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="h-12"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Đăng nhập
                </Button>
              </form>                        
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
