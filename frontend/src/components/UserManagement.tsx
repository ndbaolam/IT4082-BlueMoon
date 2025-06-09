import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/axiosConfig";

interface User {
  id: number;
  email: string;
  vaitro: "to_truong" | "ke_toan";
  first_name: string;
  last_name: string;
  sodienthoai?: string;
  diachi?: string;
  trangthai: boolean;
  created_at: string;
}

interface UserManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const UserManagement = ({ userRole }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User & { password?: string }>>({});
  const { toast } = useToast();

  // Lấy danh sách người dùng từ API khi load component
  useEffect(() => {
    apiClient.get("/users/")
      .then(res => setUsers(res.data))
      .catch(() => toast({ title: "Lỗi", description: "Không lấy được danh sách người dùng" }));
  }, []);

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ vaitro: "ke_toan", trangthai: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      await apiClient.delete(`/users/${user.email}`);
      setUsers(users.filter(u => u.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa người dùng thành công",
      });
    } catch {
      toast({ title: "Lỗi", description: "Xóa người dùng thất bại" });
    }
  };

  const handleSubmit = async () => {
    if (editingUser) {
      // Update
      try {
        await apiClient.put(`/users/${formData.email}`, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          vaitro: formData.vaitro,
          sodienthoai: formData.sodienthoai,
          diachi: formData.diachi,
          trangthai: formData.trangthai,
        });
        setUsers(users.map(u =>
          u.id === editingUser.id ? { ...u, ...formData } as User : u
        ));
        toast({
          title: "Thành công",
          description: "Đã cập nhật người dùng thành công",
        });
      } catch {
        toast({ title: "Lỗi", description: "Cập nhật người dùng thất bại" });
      }
    } else {
      // Create
      try {
        const res = await apiClient.post("/users/register", {
          password: formData.password || "123456",
          vaitro: formData.vaitro,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          sodienthoai: formData.sodienthoai,
          diachi: formData.diachi,
          trangthai: formData.trangthai,
        });
        setUsers([...users, res.data]);
        toast({
          title: "Thành công",
          description: "Đã thêm người dùng mới thành công",
        });
      } catch {
        toast({ title: "Lỗi", description: "Thêm người dùng thất bại" });
      }
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  // Only to_truong can access this page
  if (userRole !== "to_truong") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Không có quyền truy cập</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Chỉ tổ trưởng mới có quyền quản lý người dùng.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
            <p className="text-gray-600">Quản lý tài khoản người dùng hệ thống</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-blue-600" />
                  Danh sách người dùng
                </CardTitle>
                <CardDescription>Tổng số: {users.length} người dùng</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.vaitro === "to_truong" ? "default" : "secondary"}>
                        {user.vaitro === "to_truong" ? "Tổ trưởng" : "Kế toán"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.trangthai ? "default" : "destructive"}>
                        {user.trangthai ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.sodienthoai || ""}</TableCell>
                    <TableCell>{user.diachi || ""}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin người dùng cần thêm/chỉnh sửa
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Họ *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ""}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Họ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Tên *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ""}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  disabled={!!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mật khẩu"
                  disabled={!!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaitro">Vai trò</Label>
                <Select value={formData.vaitro || ""} onValueChange={(value: "to_truong" | "ke_toan") => setFormData({ ...formData, vaitro: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to_truong">Tổ trưởng</SelectItem>
                    <SelectItem value="ke_toan">Kế toán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trangthai">Trạng thái</Label>
                <Select value={formData.trangthai === false ? "inactive" : "active"} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, trangthai: value === "active" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sodienthoai">Số điện thoại</Label>
                <Input
                  id="sodienthoai"
                  value={formData.sodienthoai || ""}
                  onChange={(e) => setFormData({ ...formData, sodienthoai: e.target.value })}
                  placeholder="Số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diachi">Địa chỉ</Label>
                <Input
                  id="diachi"
                  value={formData.diachi || ""}
                  onChange={(e) => setFormData({ ...formData, diachi: e.target.value })}
                  placeholder="Địa chỉ"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
