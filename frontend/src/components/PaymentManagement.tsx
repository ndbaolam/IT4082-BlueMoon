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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/axiosConfig";
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
  const [payments, setPayments] = useState<NopTien[]>([]);
  const [hoKhauList, setHoKhauList] = useState<any[]>([]);
  const [khoanThuList, setKhoanThuList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<NopTien | null>(null);
  const [formData, setFormData] = useState<Partial<NopTien>>({});
  const { toast } = useToast();

  // Lấy danh sách phiếu nộp tiền từ API khi load component
  useEffect(() => {
    Promise.all([
      apiClient.get("/noptien/"),
      apiClient.get("/hokhau/"),
      apiClient.get("/khoanthu/"),
    ])
      .then(([resNopTien, resHoKhau, resKhoanThu]) => {        
        // Map hokhau_id -> sohokhau
        const hoKhauMap = new Map<number, string>();
        resHoKhau.data.forEach((hk: any) => {
          hoKhauMap.set(hk.id, hk.sohokhau || `Hộ khẩu ${hk.id}`);
        });

        // Map khoanthu_id -> tenkhoanthu
        const khoanThuMap = new Map<number, string>();
        resKhoanThu.data.forEach((kt: any) => {
          khoanThuMap.set(kt.id, kt.tenkhoanthu || `Khoản thu ${kt.id}`);
        });

        const paymentsWithNames = resNopTien.data.map((item: any) => {
          const khoanthu = resKhoanThu.data.find(
            (kt: any) => kt.id === item.khoanthu_id
          );
          return {
            ...item,
            hokhau_name:
              hoKhauMap.get(item.hokhau_id) || `ID ${item.hokhau_id}`,
            khoanthu_name:
              khoanthu?.tenkhoanthu || `Khoản thu ${item.khoanthu_id}`,
          };
        });
        setPayments(paymentsWithNames);
        setHoKhauList(resHoKhau.data);
        setKhoanThuList(resKhoanThu.data);
      })
      .catch(() =>
        toast({
          title: "Lỗi",
          description: "Không lấy được dữ liệu phiếu nộp tiền hoặc danh mục",
        })
      );
  }, []);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.nguoinop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.hokhau_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.khoanthu_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingPayment(null);
    setFormData({
      khoanthu_id: undefined,
      hokhau_id: undefined,
      nguoinop: "",
      sotien: undefined,
      ngaynop: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (payment: NopTien) => {
    setEditingPayment(payment);
    setFormData(payment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/noptien/${id}`);
      setPayments(payments.filter((p) => p.id !== id));
      toast({
        title: "Thành công",
        description: "Đã xóa phiếu nộp tiền thành công",
      });
    } catch {
      toast({ title: "Lỗi", description: "Xóa phiếu nộp tiền thất bại" });
    }
  };

  const handleSubmit = async () => {
    if (editingPayment) {
      // Update
      try {
        const res = await apiClient.put(
          `/noptien/${editingPayment.id}`,
          formData
        );
        setPayments(
          payments.map((p) => (p.id === editingPayment.id ? res.data : p))
        );
        toast({
          title: "Thành công",
          description: "Đã cập nhật phiếu nộp tiền thành công",
        });
      } catch {
        toast({
          title: "Lỗi",
          description: "Cập nhật phiếu nộp tiền thất bại",
        });
      }
    } else {
      // Create
      try {
        const res = await apiClient.post("/noptien/", formData);
        setPayments([...payments, res.data]);
        toast({
          title: "Thành công",
          description: "Đã thêm phiếu nộp tiền mới thành công",
        });
      } catch {
        toast({ title: "Lỗi", description: "Thêm phiếu nộp tiền thất bại" });
      }
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => Number(sum) + Number(payment.sotien),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Quản lý nộp tiền
            </h1>
            <p className="text-gray-600">
              Quản lý các phiếu thu tiền trong tổ dân phố
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
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
                <p className="text-2xl font-bold">
                  {formatCurrency(totalAmount)}
                </p>
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
                <CardDescription>
                  Tổng số: {payments.length} phiếu thu
                </CardDescription>
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
                  <TableHead>Số tiền đã nộp</TableHead>
                  <TableHead>Số tiền còn thiếu</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const khoanThu = khoanThuList.find(
                    (kt) => kt.id === payment.khoanthu_id
                  );                  
                  const tongPhaiNop = khoanThu?.sotien || 0;                  
                  const daNop = Number(payment.sotien) || 0;
                  const conThieu = tongPhaiNop - daNop;
                  return (
                    <TableRow key={payment.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">
                        {payment.hokhau_name}
                      </TableCell>
                      <TableCell>{payment.khoanthu_name}</TableCell>
                      <TableCell>{payment.nguoinop}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(daNop)}
                      </TableCell>
                      <TableCell
                        className={
                          conThieu > 0
                            ? "font-semibold text-red-600"
                            : "font-semibold text-gray-500"
                        }
                      >
                        {formatCurrency(conThieu > 0 ? conThieu : 0)}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.ngaynop).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-blue-600 hover:bg-blue-50 mr-2"
                          onClick={() => handleEdit(payment)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(payment.id)}
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                  <Label htmlFor="hokhau_id">Hộ khẩu *</Label>
                  <Select
                    value={formData.hokhau_id ? String(formData.hokhau_id) : ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, hokhau_id: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="hokhau_id">
                      <SelectValue placeholder="Chọn hộ khẩu" />
                    </SelectTrigger>
                    <SelectContent>
                      {hoKhauList.map((hk) => (
                        <SelectItem key={hk.id} value={String(hk.id)}>
                          {hk.sohokhau || `Hộ khẩu ${hk.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="khoanthu_id">Khoản thu *</Label>
                  <Select
                    value={
                      formData.khoanthu_id ? String(formData.khoanthu_id) : ""
                    }
                    onValueChange={(value) =>
                      setFormData({ ...formData, khoanthu_id: Number(value) })
                    }
                  >
                    <SelectTrigger id="khoanthu_id">
                      <SelectValue placeholder="Chọn khoản thu" />
                    </SelectTrigger>
                    <SelectContent>
                      {khoanThuList.length === 0 && (
                        <div>Không có khoản thu nào</div>
                      )}
                      {khoanThuList.map((kt) => (
                        <SelectItem key={kt.id} value={String(kt.id)}>
                          {kt.tenkhoanthu || `Khoản thu ${kt.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nguoinop">Người nộp *</Label>
                <Input
                  id="nguoinop"
                  value={formData.nguoinop || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nguoinop: e.target.value })
                  }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sotien: parseFloat(e.target.value),
                      })
                    }
                    placeholder="Số tiền nộp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ngaynop">Ngày nộp</Label>
                  <Input
                    id="ngaynop"
                    type="date"
                    value={formData.ngaynop || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ngaynop: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                {editingPayment ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
