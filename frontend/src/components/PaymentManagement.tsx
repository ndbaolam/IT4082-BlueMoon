
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NopTien {
  id: number;
  hokhau_id: number;
  khoanthu_id: number;
  nguoinop: string;
  sotien: number;
  ngaynop: string;
  hokhau_name?: string;
  khoanthu_name?: string;
}

interface PaymentManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const PaymentManagement = ({ userRole }: PaymentManagementProps) => {
  const [payments, setPayments] = useState<NopTien[]>([
    {
      id: 1,
      hokhau_id: 1,
      khoanthu_id: 1,
      nguoinop: "Nguyễn Văn A",
      sotien: 500000,
      ngaynop: "2024-01-15",
      hokhau_name: "HK001",
      khoanthu_name: "Phí quản lý chung cư"
    },
    {
      id: 2,
      hokhau_id: 2,
      khoanthu_id: 1,
      nguoinop: "Trần Thị B",
      sotien: 500000,
      ngaynop: "2024-01-20",
      hokhau_name: "HK002",
      khoanthu_name: "Phí quản lý chung cư"
    },
    {
      id: 3,
      hokhau_id: 1,
      khoanthu_id: 2,
      nguoinop: "Nguyễn Văn A",
      sotien: 200000,
      ngaynop: "2024-02-01",
      hokhau_name: "HK001",
      khoanthu_name: "Phí bảo trì thang máy"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<NopTien | null>(null);
  const [formData, setFormData] = useState<Partial<NopTien>>({});
  const { toast } = useToast();

  const filteredPayments = payments.filter(payment =>
    payment.nguoinop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.hokhau_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.khoanthu_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingPayment(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (payment: NopTien) => {
    setEditingPayment(payment);
    setFormData(payment);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPayments(payments.filter(p => p.id !== id));
    toast({
      title: "Thành công",
      description: "Đã xóa phiếu nộp tiền thành công",
    });
  };

  const handleSubmit = () => {
    if (editingPayment) {
      setPayments(payments.map(p => 
        p.id === editingPayment.id ? { ...p, ...formData } : p
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật phiếu nộp tiền thành công",
      });
    } else {
      const newPayment = {
        ...formData,
        id: Math.max(...payments.map(p => p.id)) + 1,
        ngaynop: formData.ngaynop || new Date().toISOString().split('T')[0],
      } as NopTien;
      setPayments([...payments, newPayment]);
      toast({
        title: "Thành công",
        description: "Đã thêm phiếu nộp tiền mới thành công",
      });
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.sotien, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý nộp tiền</h1>
            <p className="text-gray-600">Quản lý các phiếu thu tiền trong tổ dân phố</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm phiếu thu
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <CreditCard className="w-6 h-6 mr-2" />
              Tổng quan thu tiền
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-100">Tổng số phiếu thu</p>
                <p className="text-2xl font-bold">{filteredPayments.length}</p>
              </div>
              <div>
                <p className="text-green-100">Tổng tiền đã thu</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                  Danh sách phiếu thu
                </CardTitle>
                <CardDescription>Tổng số: {payments.length} phiếu thu</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo người nộp, hộ khẩu..."
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
                  <TableHead>Hộ khẩu</TableHead>
                  <TableHead>Khoản thu</TableHead>
                  <TableHead>Người nộp</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{payment.hokhau_name}</TableCell>
                    <TableCell>{payment.khoanthu_name}</TableCell>
                    <TableCell>{payment.nguoinop}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(payment.sotien)}
                    </TableCell>
                    <TableCell>{new Date(payment.ngaynop).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(payment)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(payment.id)}
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
                {editingPayment ? "Chỉnh sửa phiếu thu" : "Thêm phiếu thu mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin nộp tiền vào form bên dưới
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hokhau_id">Hộ khẩu ID</Label>
                  <Input
                    id="hokhau_id"
                    type="number"
                    value={formData.hokhau_id || ""}
                    onChange={(e) => setFormData({...formData, hokhau_id: parseInt(e.target.value)})}
                    placeholder="ID hộ khẩu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="khoanthu_id">Khoản thu ID</Label>
                  <Input
                    id="khoanthu_id"
                    type="number"
                    value={formData.khoanthu_id || ""}
                    onChange={(e) => setFormData({...formData, khoanthu_id: parseInt(e.target.value)})}
                    placeholder="ID khoản thu"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nguoinop">Người nộp *</Label>
                <Input
                  id="nguoinop"
                  value={formData.nguoinop || ""}
                  onChange={(e) => setFormData({...formData, nguoinop: e.target.value})}
                  placeholder="Tên người nộp tiền"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sotien">Số tiền *</Label>
                  <Input
                    id="sotien"
                    type="number"
                    value={formData.sotien || ""}
                    onChange={(e) => setFormData({...formData, sotien: parseFloat(e.target.value)})}
                    placeholder="Số tiền nộp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ngaynop">Ngày nộp</Label>
                  <Input
                    id="ngaynop"
                    type="date"
                    value={formData.ngaynop || ""}
                    onChange={(e) => setFormData({...formData, ngaynop: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-600 to-emerald-600">
                {editingPayment ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
