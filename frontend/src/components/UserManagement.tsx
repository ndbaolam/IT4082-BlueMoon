
import { useState } from "react";
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

interface User {
  id: number;
  username: string;
  email: string;
  role: "to_truong" | "ke_toan";
  fullName: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface UserManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const UserManagement = ({ userRole }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([
  {
    "id": 3,
    "username": "ketoan2",
    "email": "ketoan2@todan.vn",
    "role": "ke_toan",
    "fullName": "Nguyễn Thị Hằng",
    "phone": "0911223344",
    "status": "active",
    "createdAt": "2025-01-25"
  },
  {
    "id": 4,
    "username": "ketoan3",
    "email": "ketoan3@todan.vn",
    "role": "ke_toan",
    "fullName": "Lê Văn Tài",
    "phone": "0922334455",
    "status": "active",
    "createdAt": "2025-01-28"
  },
  {
    "id": 5,
    "username": "ketoan4",
    "email": "ketoan4@todan.vn",
    "role": "ke_toan",
    "fullName": "Phạm Thị Minh",
    "phone": "0933445566",
    "status": "inactive",
    "createdAt": "2025-02-02"
  },
  {
    "id": 6,
    "username": "ketoan5",
    "email": "ketoan5@todan.vn",
    "role": "ke_toan",
    "fullName": "Trần Văn Long",
    "phone": "0944556677",
    "status": "active",
    "createdAt": "2025-02-10"
  },
  {
    "id": 7,
    "username": "ketoan6",
    "email": "ketoan6@todan.vn",
    "role": "ke_toan",
    "fullName": "Vũ Thị Lan",
    "phone": "0955667788",
    "status": "active",
    "createdAt": "2025-02-15"
  }
]
);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ role: "ke_toan", status: "active" });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "Thành công",
      description: "Đã xóa người dùng thành công",
    });
  };

  const handleSubmit = () => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...formData } : u
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật người dùng thành công",
      });
    } else {
      const newUser = {
        ...formData,
        id: Math.max(...users.map(u => u.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      } as User;
      setUsers([...users, newUser]);
      toast({
        title: "Thành công",
        description: "Đã thêm người dùng mới thành công",
      });
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
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "to_truong" ? "default" : "secondary"}>
                        {user.role === "to_truong" ? "Tổ trưởng" : "Kế toán"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status === "active" ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
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
                <Label htmlFor="username">Tên đăng nhập *</Label>
                <Input
                  id="username"
                  value={formData.username || ""}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Tên đăng nhập"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select value={formData.role || ""} onValueChange={(value: "to_truong" | "ke_toan") => setFormData({...formData, role: value})}>
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
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status || ""} onValueChange={(value: "active" | "inactive") => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
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
