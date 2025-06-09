
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/axiosConfig";

interface NhanKhau {
  id: number;
  hoten: string;
  ngaysinh: string;
  gioitinh: string;
  dantoc: string;
  tongiao: string;
  cccd: string;
  ngaycap: string;
  noicap: string;
  nghenghiep: string;
  ghichu: string;
}

interface PersonManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const PersonManagement = ({ userRole }: PersonManagementProps) => {
  const [persons, setPersons] = useState<NhanKhau[]>([]);

  useEffect(() => {
    apiClient.get("/nhankhau")
      .then(res => setPersons(res.data))
      .catch(() => toast({ title: "Lỗi", description: "Không lấy được danh sách nhân khẩu" }));
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<NhanKhau | null>(null);
  const [formData, setFormData] = useState<Partial<NhanKhau>>({});
  const { toast } = useToast();

  const filteredPersons = persons.filter(person =>
    person.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.cccd.includes(searchTerm) ||
    person.nghenghiep.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingPerson(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (person: NhanKhau) => {
    setEditingPerson(person);
    setFormData(person);
    setIsDialogOpen(true);
  };

  const handleDelete =async (id: number) => {
    try {
      await apiClient.delete(`/nhankhau/${id}`);
      setPersons(persons.filter(p => p.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa nhân khẩu thành công",
      });
    } catch {
      toast({ title: "Lỗi", description: "Xóa nhân khẩu thất bại" });
    }
  };

  const handleSubmit = async () => {
    if (editingPerson) {
      //update
      try {
        const res = await apiClient.put(`/nhankhau/${editingPerson.id}`, formData);
        setPersons(persons.map(p => p.id === editingPerson.id ? res.data : p));
        toast({
          title: "Thành công",
          description: "Đã cập nhật nhân khẩu thành công",
        });
      } catch {
        toast({ title: "Lỗi", description: "Cập nhật thất bại" });
      }
    } else {
      //create new person
      try {
        const res = await apiClient.post("/nhankhau", formData);
        setPersons([...persons, res.data]);
        toast({
          title: "Thành công",
          description: "Đã thêm nhân khẩu mới thành công",
        });
      } catch {
        toast({ title: "Lỗi", description: "Thêm mới thất bại" });
      }
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý nhân khẩu</h1>
            <p className="text-gray-600">Quản lý thông tin nhân khẩu trong tổ dân phố</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhân khẩu
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <User className="w-6 h-6 mr-2 text-green-600" />
                  Danh sách nhân khẩu
                </CardTitle>
                <CardDescription>Tổng số: {persons.length} người</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, CCCD, nghề nghiệp..."
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
                  <TableHead>CCCD</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Nghề nghiệp</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersons.map((person) => (
                  <TableRow key={person.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{person.hoten}</TableCell>
                    <TableCell>{person.cccd}</TableCell>
                    <TableCell>{new Date(person.ngaysinh).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{person.gioitinh}</TableCell>
                    <TableCell>{person.nghenghiep}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(person)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(person.id)}
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPerson ? "Chỉnh sửa nhân khẩu" : "Thêm nhân khẩu mới"}
              </DialogTitle>
              <DialogDescription>
                Điền đầy đủ thông tin nhân khẩu
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hoten">Họ và tên *</Label>
                <Input
                  id="hoten"
                  value={formData.hoten || ""}
                  onChange={(e) => setFormData({...formData, hoten: e.target.value})}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ngaysinh">Ngày sinh</Label>
                <Input
                  id="ngaysinh"
                  type="date"
                  value={formData.ngaysinh || ""}
                  onChange={(e) => setFormData({...formData, ngaysinh: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gioitinh">Giới tính</Label>
                <Select value={formData.gioitinh || ""} onValueChange={(value) => setFormData({...formData, gioitinh: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dantoc">Dân tộc</Label>
                <Input
                  id="dantoc"
                  value={formData.dantoc || ""}
                  onChange={(e) => setFormData({...formData, dantoc: e.target.value})}
                  placeholder="Dân tộc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tongiao">Tôn giáo</Label>
                <Input
                  id="tongiao"
                  value={formData.tongiao || ""}
                  onChange={(e) => setFormData({...formData, tongiao: e.target.value})}
                  placeholder="Tôn giáo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cccd">CCCD</Label>
                <Input
                  id="cccd"
                  value={formData.cccd || ""}
                  onChange={(e) => setFormData({...formData, cccd: e.target.value})}
                  placeholder="Số CCCD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ngaycap">Ngày cấp CCCD</Label>
                <Input
                  id="ngaycap"
                  type="date"
                  value={formData.ngaycap || ""}
                  onChange={(e) => setFormData({...formData, ngaycap: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noicap">Nơi cấp</Label>
                <Input
                  id="noicap"
                  value={formData.noicap || ""}
                  onChange={(e) => setFormData({...formData, noicap: e.target.value})}
                  placeholder="Nơi cấp CCCD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nghenghiep">Nghề nghiệp</Label>
                <Input
                  id="nghenghiep"
                  value={formData.nghenghiep || ""}
                  onChange={(e) => setFormData({...formData, nghenghiep: e.target.value})}
                  placeholder="Nghề nghiệp"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="ghichu">Ghi chú</Label>
                <Textarea
                  id="ghichu"
                  value={formData.ghichu || ""}
                  onChange={(e) => setFormData({...formData, ghichu: e.target.value})}
                  placeholder="Ghi chú thêm"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-600 to-blue-600">
                {editingPerson ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
