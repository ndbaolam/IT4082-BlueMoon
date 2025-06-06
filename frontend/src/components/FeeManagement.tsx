
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KhoanThu {
  id: number;
  ngaytao: string;
  thoihan: string;
  tenkhoanthu: string;
  batbuoc: boolean;
  ghichu: string;
}

interface FeeManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const FeeManagement = ({ userRole }: FeeManagementProps) => {
  const [fees, setFees] = useState<KhoanThu[]>([
    {
      id: 1,
      ngaytao: "2024-01-01",
      thoihan: "2024-12-31",
      tenkhoanthu: "Phí quản lý chung cư",
      batbuoc: true,
      ghichu: "Thu hàng tháng"
    },
    {
      id: 2,
      ngaytao: "2024-01-15",
      thoihan: "2024-06-30",
      tenkhoanthu: "Phí bảo trì thang máy",
      batbuoc: false,
      ghichu: "Thu theo quý"
    },
    {
      id: 3,
      ngaytao: "2024-02-01",
      thoihan: "2024-12-31",
      tenkhoanthu: "Phí an ninh",
      batbuoc: true,
      ghichu: "Thu hàng tháng, bắt buộc cho tất cả hộ"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<KhoanThu | null>(null);
  const [formData, setFormData] = useState<Partial<KhoanThu>>({});
  const { toast } = useToast();

  const filteredFees = fees.filter(fee =>
    fee.tenkhoanthu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingFee(null);
    setFormData({ batbuoc: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (fee: KhoanThu) => {
    setEditingFee(fee);
    setFormData(fee);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setFees(fees.filter(f => f.id !== id));
    toast({
      title: "Thành công",
      description: "Đã xóa khoản thu thành công",
    });
  };

  const handleSubmit = () => {
    if (editingFee) {
      setFees(fees.map(f => 
        f.id === editingFee.id ? { ...f, ...formData } : f
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật khoản thu thành công",
      });
    } else {
      const newFee = {
        ...formData,
        id: Math.max(...fees.map(f => f.id)) + 1,
        ngaytao: new Date().toISOString().split('T')[0],
      } as KhoanThu;
      setFees([...fees, newFee]);
      toast({
        title: "Thành công",
        description: "Đã thêm khoản thu mới thành công",
      });
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  // Only ke_toan can access this page
  if (userRole !== "ke_toan") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Không có quyền truy cập</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Chỉ kế toán mới có quyền quản lý khoản thu.
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý khoản thu</h1>
            <p className="text-gray-600">Quản lý các khoản thu phí trong tổ dân phố</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm khoản thu
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-orange-600" />
                  Danh sách khoản thu
                </CardTitle>
                <CardDescription>Tổng số: {fees.length} khoản thu</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm khoản thu..."
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
                  <TableHead>Tên khoản thu</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.map((fee) => (
                  <TableRow key={fee.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{fee.tenkhoanthu}</TableCell>
                    <TableCell>{new Date(fee.ngaytao).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{new Date(fee.thoihan).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <Badge variant={fee.batbuoc ? "destructive" : "secondary"}>
                        {fee.batbuoc ? "Bắt buộc" : "Tự nguyện"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{fee.ghichu}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(fee)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(fee.id)}
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
                {editingFee ? "Chỉnh sửa khoản thu" : "Thêm khoản thu mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin khoản thu cần thêm/chỉnh sửa
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tenkhoanthu">Tên khoản thu *</Label>
                <Input
                  id="tenkhoanthu"
                  value={formData.tenkhoanthu || ""}
                  onChange={(e) => setFormData({...formData, tenkhoanthu: e.target.value})}
                  placeholder="Nhập tên khoản thu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thoihan">Thời hạn</Label>
                <Input
                  id="thoihan"
                  type="date"
                  value={formData.thoihan || ""}
                  onChange={(e) => setFormData({...formData, thoihan: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="batbuoc"
                  checked={formData.batbuoc || false}
                  onCheckedChange={(checked) => setFormData({...formData, batbuoc: checked})}
                />
                <Label htmlFor="batbuoc">Khoản thu bắt buộc</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ghichu">Ghi chú</Label>
                <Textarea
                  id="ghichu"
                  value={formData.ghichu || ""}
                  onChange={(e) => setFormData({...formData, ghichu: e.target.value})}
                  placeholder="Ghi chú về khoản thu"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-orange-600 to-red-600">
                {editingFee ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
