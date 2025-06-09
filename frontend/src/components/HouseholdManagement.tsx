
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HoKhau {
  id: number;
  sohokhau: string;
  sonha: string;
  duong: string;
  phuong: string;
  quan: string;
  ngaylamhokhau: string;
  chu_ho_id: number;
  chu_ho_name?: string;
}

interface HouseholdManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const HouseholdManagement = ({ userRole }: HouseholdManagementProps) => {
  const [households, setHouseholds] = useState<HoKhau[]>([
  {
    "id": 1,
    "sohokhau": "HK001",
    "sonha": "12A",
    "duong": "Hoàng Hoa Thám",
    "phuong": "Phường Ngọc Hà",
    "quan": "Ba Đình",
    "ngaylamhokhau": "2023-01-15",
    "chu_ho_id": 1,
    "chu_ho_name": "Nguyễn Văn A"
  },
  {
    "id": 2,
    "sohokhau": "HK002",
    "sonha": "45",
    "duong": "Kim Mã",
    "phuong": "Phường Kim Mã",
    "quan": "Ba Đình",
    "ngaylamhokhau": "2023-02-20",
    "chu_ho_id": 2,
    "chu_ho_name": "Trần Thị B"
  },
  {
    "id": 3,
    "sohokhau": "HK003",
    "sonha": "89B",
    "duong": "Giải Phóng",
    "phuong": "Phường Đồng Tâm",
    "quan": "Hai Bà Trưng",
    "ngaylamhokhau": "2023-03-12",
    "chu_ho_id": 3,
    "chu_ho_name": "Phạm Văn C"
  },
  {
    "id": 4,
    "sohokhau": "HK004",
    "sonha": "22",
    "duong": "Xã Đàn",
    "phuong": "Phường Nam Đồng",
    "quan": "Đống Đa",
    "ngaylamhokhau": "2023-04-10",
    "chu_ho_id": 4,
    "chu_ho_name": "Lê Thị D"
  },
  {
    "id": 5,
    "sohokhau": "HK005",
    "sonha": "10C",
    "duong": "Láng Hạ",
    "phuong": "Phường Láng Hạ",
    "quan": "Đống Đa",
    "ngaylamhokhau": "2023-05-05",
    "chu_ho_id": 5,
    "chu_ho_name": "Hoàng Văn E"
  },
  {
    "id": 6,
    "sohokhau": "HK006",
    "sonha": "305",
    "duong": "Cầu Giấy",
    "phuong": "Phường Quan Hoa",
    "quan": "Cầu Giấy",
    "ngaylamhokhau": "2023-06-18",
    "chu_ho_id": 6,
    "chu_ho_name": "Vũ Thị F"
  },
  {
    "id": 7,
    "sohokhau": "HK007",
    "sonha": "78",
    "duong": "Trần Duy Hưng",
    "phuong": "Phường Trung Hòa",
    "quan": "Cầu Giấy",
    "ngaylamhokhau": "2023-07-02",
    "chu_ho_id": 7,
    "chu_ho_name": "Đặng Văn G"
  },
  {
    "id": 8,
    "sohokhau": "HK008",
    "sonha": "18",
    "duong": "Nguyễn Chí Thanh",
    "phuong": "Phường Láng Thượng",
    "quan": "Đống Đa",
    "ngaylamhokhau": "2023-08-09",
    "chu_ho_id": 8,
    "chu_ho_name": "Ngô Thị H"
  },
  {
    "id": 9,
    "sohokhau": "HK009",
    "sonha": "99",
    "duong": "Phạm Văn Đồng",
    "phuong": "Phường Mai Dịch",
    "quan": "Cầu Giấy",
    "ngaylamhokhau": "2023-09-14",
    "chu_ho_id": 9,
    "chu_ho_name": "Đoàn Văn I"
  },
  {
    "id": 10,
    "sohokhau": "HK010",
    "sonha": "65",
    "duong": "Lê Đức Thọ",
    "phuong": "Phường Mỹ Đình 2",
    "quan": "Nam Từ Liêm",
    "ngaylamhokhau": "2023-10-01",
    "chu_ho_id": 10,
    "chu_ho_name": "Mai Thị K"
  }
]
);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<HoKhau | null>(null);
  const [formData, setFormData] = useState<Partial<HoKhau>>({});
  const { toast } = useToast();

  const filteredHouseholds = households.filter(household =>
    household.sohokhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
    household.chu_ho_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    household.duong.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingHousehold(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (household: HoKhau) => {
    setEditingHousehold(household);
    setFormData(household);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setHouseholds(households.filter(h => h.id !== id));
    toast({
      title: "Thành công",
      description: "Đã xóa hộ khẩu thành công",
    });
  };

  const handleSubmit = () => {
    if (editingHousehold) {
      setHouseholds(households.map(h => 
        h.id === editingHousehold.id ? { ...h, ...formData } : h
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật hộ khẩu thành công",
      });
    } else {
      const newHousehold = {
        ...formData,
        id: Math.max(...households.map(h => h.id)) + 1,
      } as HoKhau;
      setHouseholds([...households, newHousehold]);
      toast({
        title: "Thành công",
        description: "Đã thêm hộ khẩu mới thành công",
      });
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý hộ khẩu</h1>
            <p className="text-gray-600">Quản lý thông tin hộ khẩu trong tổ dân phố</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm hộ khẩu
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900">Danh sách hộ khẩu</CardTitle>
                <CardDescription>Tổng số: {households.length} hộ khẩu</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ..."
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
                  <TableHead>Số hộ khẩu</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Chủ hộ</TableHead>
                  <TableHead>Ngày lập</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHouseholds.map((household) => (
                  <TableRow key={household.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{household.sohokhau}</TableCell>
                    <TableCell>
                      {household.sonha} {household.duong}, {household.phuong}, {household.quan}
                    </TableCell>
                    <TableCell>{household.chu_ho_name}</TableCell>
                    <TableCell>{new Date(household.ngaylamhokhau).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(household)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(household.id)}
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
                {editingHousehold ? "Chỉnh sửa hộ khẩu" : "Thêm hộ khẩu mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin hộ khẩu vào form bên dưới
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sohokhau">Số hộ khẩu</Label>
                <Input
                  id="sohokhau"
                  value={formData.sohokhau || ""}
                  onChange={(e) => setFormData({...formData, sohokhau: e.target.value})}
                  placeholder="Nhập số hộ khẩu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sonha">Số nhà</Label>
                <Input
                  id="sonha"
                  value={formData.sonha || ""}
                  onChange={(e) => setFormData({...formData, sonha: e.target.value})}
                  placeholder="Số nhà"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duong">Đường</Label>
                <Input
                  id="duong"
                  value={formData.duong || ""}
                  onChange={(e) => setFormData({...formData, duong: e.target.value})}
                  placeholder="Tên đường"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phuong">Phường</Label>
                <Input
                  id="phuong"
                  value={formData.phuong || ""}
                  onChange={(e) => setFormData({...formData, phuong: e.target.value})}
                  placeholder="Tên phường"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quan">Quận</Label>
                <Input
                  id="quan"
                  value={formData.quan || ""}
                  onChange={(e) => setFormData({...formData, quan: e.target.value})}
                  placeholder="Tên quận"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ngaylamhokhau">Ngày lập hộ khẩu</Label>
                <Input
                  id="ngaylamhokhau"
                  type="date"
                  value={formData.ngaylamhokhau || ""}
                  onChange={(e) => setFormData({...formData, ngaylamhokhau: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-purple-600">
                {editingHousehold ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
