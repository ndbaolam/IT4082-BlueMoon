import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/axiosConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface HoKhau {
  id: number;
  sohokhau: string;
  sophong: string;
  ngaylamhokhau: string;
  chu_ho_id: number;
  chu_ho_name?: string;
}

interface HouseholdManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const HouseholdManagement = ({ userRole }: HouseholdManagementProps) => {
  const [households, setHouseholds] = useState<HoKhau[]>([]);
  const [nhanKhauList, setNhanKhauList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<HoKhau | null>(null);
  const [formData, setFormData] = useState<Partial<HoKhau>>({});
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([apiClient.get("/hokhau"), apiClient.get("/nhankhau")])
      .then(([resHoKhau, resNhanKhau]) => {
        // Map chu_ho_id -> hoten
        const nhanKhauMap = new Map<number, string>();
        resNhanKhau.data.forEach((nk: any) => {
          nhanKhauMap.set(nk.id, nk.hoten || `Nhân khẩu ${nk.id}`);
        });

        const householdsWithChuHoName = resHoKhau.data.map((hk: any) => ({
          ...hk,
          chu_ho_name: nhanKhauMap.get(hk.chu_ho_id) || `ID ${hk.chu_ho_id}`,
        }));

        setHouseholds(householdsWithChuHoName);
        setNhanKhauList(resNhanKhau.data);
      })
      .catch(() =>
        toast({
          title: "Lỗi",
          description: "Không lấy được danh sách hộ khẩu hoặc nhân khẩu",
        })
      );
  }, []);

  const filteredHouseholds = households.filter(
    (household) =>
      household.sohokhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.chu_ho_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/hokhau/${id}`);
      setHouseholds(households.filter((h) => h.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa hộ khẩu thành công",
      });
    } catch {
      toast({ title: "Lỗi", description: "Xóa hộ khẩu thất bại" });
    }
  };

  const handleSubmit = async () => {
    if (editingHousehold) {
      // Update
      try {
        const res = await apiClient.put(
          `/hokhau/${editingHousehold.id}`,
          formData
        );
        setHouseholds(
          households.map((h) => (h.id === editingHousehold.id ? res.data : h))
        );
        toast({
          title: "Thành công",
          description: "Đã cập nhật hộ khẩu thành công",
        });
      } catch {
        toast({ title: "Lỗi", description: "Cập nhật thất bại" });
      }
    } else {
      // Create
      try {
        const res = await apiClient.post("/hokhau", formData);
        console.log("New household created:", formData);
        setHouseholds([...households, res.data]);
        toast({
          title: "Thành công",
          description: "Đã thêm hộ khẩu mới thành công",
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Quản lý hộ khẩu
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin hộ khẩu trong tổ dân phố
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm hộ khẩu
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900">
                  Danh sách hộ khẩu
                </CardTitle>
                <CardDescription>
                  Tổng số: {households.length} hộ khẩu
                </CardDescription>
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
                    <TableCell className="font-medium">
                      {household.sohokhau}
                    </TableCell>
                    <TableCell>
                      {household.sophong}
                    </TableCell>
                    <TableCell>{household.chu_ho_name}</TableCell>
                    <TableCell>
                      {new Date(household.ngaylamhokhau).toLocaleDateString(
                        "vi-VN"
                      )}
                    </TableCell>
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
                  onChange={(e) =>
                    setFormData({ ...formData, sohokhau: e.target.value })
                  }
                  placeholder="Nhập số hộ khẩu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sophong">Số phòng</Label>
                <Input
                  id="sophong"
                  value={formData.sophong || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sophong: e.target.value })
                  }
                  placeholder="Số phòng"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ngaylamhokhau">Ngày lập hộ khẩu</Label>
                <Input
                  id="ngaylamhokhau"
                  type="date"
                  value={formData.ngaylamhokhau || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ngaylamhokhau: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chu_ho_id">Chủ hộ</Label>
                <Select
                  value={formData.chu_ho_id ? String(formData.chu_ho_id) : ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, chu_ho_id: parseInt(value) })
                  }
                >
                  <SelectTrigger id="chu_ho_id">
                    <SelectValue placeholder="Chọn chủ hộ" />
                  </SelectTrigger>
                  <SelectContent>
                    {nhanKhauList.map((nk) => (
                      <SelectItem key={nk.id} value={String(nk.id)}>
                        {nk.hoten || `Nhân khẩu ${nk.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {editingHousehold ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
