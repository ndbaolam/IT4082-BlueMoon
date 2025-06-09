
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TamTruTamVang {
  id: number;
  nhankhau_id: number;
  trangthai: string; // 'tạm trú' or 'tạm vắng'
  diachitamtrutamvang: string;
  thoigian: string;
  noidungdenghi: string;
  nhankhau_name?: string;
}

interface TemporaryResidenceManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const TemporaryResidenceManagement = ({ userRole }: TemporaryResidenceManagementProps) => {
  const [residences, setResidences] = useState<TamTruTamVang[]>([
  {
    "id": 4,
    "nhankhau_id": 4,
    "trangthai": "tạm trú",
    "diachitamtrutamvang": "12 Phạm Hùng, Nam Từ Liêm, Hà Nội",
    "thoigian": "2024-03-05",
    "noidungdenghi": "Công tác 3 tháng",
    "nhankhau_name": "Phạm Thị D"
  },
  {
    "id": 5,
    "nhankhau_id": 5,
    "trangthai": "tạm vắng",
    "diachitamtrutamvang": "88 Kim Mã, Ba Đình, Hà Nội",
    "thoigian": "2024-03-12",
    "noidungdenghi": "Chăm sóc người thân",
    "nhankhau_name": "Hoàng Văn E"
  },
  {
    "id": 6,
    "nhankhau_id": 6,
    "trangthai": "tạm trú",
    "diachitamtrutamvang": "32 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    "thoigian": "2024-03-20",
    "noidungdenghi": "Thực tập tại công ty",
    "nhankhau_name": "Nguyễn Thị F"
  },
  {
    "id": 7,
    "nhankhau_id": 7,
    "trangthai": "tạm vắng",
    "diachitamtrutamvang": "25 Giảng Võ, Đống Đa, Hà Nội",
    "thoigian": "2024-03-25",
    "noidungdenghi": "Về quê giải quyết việc cá nhân",
    "nhankhau_name": "Trần Văn G"
  },
  {
    "id": 8,
    "nhankhau_id": 8,
    "trangthai": "tạm trú",
    "diachitamtrutamvang": "59 Láng Hạ, Ba Đình, Hà Nội",
    "thoigian": "2024-04-01",
    "noidungdenghi": "Chuyển đến sống với người thân",
    "nhankhau_name": "Lê Thị H"
  }
]
);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResidence, setEditingResidence] = useState<TamTruTamVang | null>(null);
  const [formData, setFormData] = useState<Partial<TamTruTamVang>>({});
  const { toast } = useToast();

  const filteredResidences = residences.filter(residence => {
    const matchesSearch = residence.nhankhau_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      residence.diachitamtrutamvang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || residence.trangthai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingResidence(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (residence: TamTruTamVang) => {
    setEditingResidence(residence);
    setFormData(residence);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setResidences(residences.filter(r => r.id !== id));
    toast({
      title: "Thành công",
      description: "Đã xóa đăng ký tạm trú/tạm vắng thành công",
    });
  };

  const handleSubmit = () => {
    if (editingResidence) {
      setResidences(residences.map(r => 
        r.id === editingResidence.id ? { ...r, ...formData } : r
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật đăng ký thành công",
      });
    } else {
      const newResidence = {
        ...formData,
        id: Math.max(...residences.map(r => r.id)) + 1,
      } as TamTruTamVang;
      setResidences([...residences, newResidence]);
      toast({
        title: "Thành công",
        description: "Đã thêm đăng ký mới thành công",
      });
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  const getStatusBadge = (status: string) => {
    return status === "tạm trú" ? "default" : "secondary";
  };

  const tamTruCount = residences.filter(r => r.trangthai === "tạm trú").length;
  const tamVangCount = residences.filter(r => r.trangthai === "tạm vắng").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý tạm trú - tạm vắng</h1>
            <p className="text-gray-600">Quản lý đăng ký tạm trú và tạm vắng của nhân khẩu</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm đăng ký
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Tổng đăng ký</p>
                  <p className="text-3xl font-bold">{residences.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Tạm trú</p>
                  <p className="text-3xl font-bold">{tamTruCount}</p>
                </div>
                <MapPin className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Tạm vắng</p>
                  <p className="text-3xl font-bold">{tamVangCount}</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-indigo-600" />
                  Danh sách đăng ký
                </CardTitle>
                <CardDescription>Tổng số: {residences.length} đăng ký</CardDescription>
              </div>
              <div className="flex space-x-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="tạm trú">Tạm trú</SelectItem>
                    <SelectItem value="tạm vắng">Tạm vắng</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên, địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân khẩu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResidences.map((residence) => (
                  <TableRow key={residence.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{residence.nhankhau_name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(residence.trangthai) as any}>
                        {residence.trangthai === "tạm trú" ? "Tạm trú" : "Tạm vắng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{residence.diachitamtrutamvang}</TableCell>
                    <TableCell>{new Date(residence.thoigian).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="max-w-xs truncate">{residence.noidungdenghi}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(residence)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(residence.id)}
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
                {editingResidence ? "Chỉnh sửa đăng ký" : "Thêm đăng ký mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin đăng ký tạm trú/tạm vắng
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nhankhau_id">Nhân khẩu ID</Label>
                  <Input
                    id="nhankhau_id"
                    type="number"
                    value={formData.nhankhau_id || ""}
                    onChange={(e) => setFormData({...formData, nhankhau_id: parseInt(e.target.value)})}
                    placeholder="ID nhân khẩu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trangthai">Trạng thái</Label>
                  <Select value={formData.trangthai || ""} onValueChange={(value) => setFormData({...formData, trangthai: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tạm trú">Tạm trú</SelectItem>
                      <SelectItem value="tạm vắng">Tạm vắng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diachitamtrutamvang">Địa chỉ tạm trú/tạm vắng</Label>
                <Input
                  id="diachitamtrutamvang"
                  value={formData.diachitamtrutamvang || ""}
                  onChange={(e) => setFormData({...formData, diachitamtrutamvang: e.target.value})}
                  placeholder="Địa chỉ chi tiết"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thoigian">Thời gian</Label>
                <Input
                  id="thoigian"
                  type="date"
                  value={formData.thoigian || ""}
                  onChange={(e) => setFormData({...formData, thoigian: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noidungdenghi">Nội dung đề nghị</Label>
                <Textarea
                  id="noidungdenghi"
                  value={formData.noidungdenghi || ""}
                  onChange={(e) => setFormData({...formData, noidungdenghi: e.target.value})}
                  placeholder="Lý do tạm trú/tạm vắng"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                {editingResidence ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
