
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LichSuHoKhau {
  id: number;
  hokhau_id: number;
  nhankhau_id: number;
  loaithaydoi: number; // 1: thêm, 2: xóa
  thoigian: string;
  hokhau_name?: string;
  nhankhau_name?: string;
}

interface HouseholdHistoryManagementProps {
  userRole: "to_truong" | "ke_toan";
}

export const HouseholdHistoryManagement = ({ userRole }: HouseholdHistoryManagementProps) => {
  const [histories, setHistories] = useState<LichSuHoKhau[]>([
    {
      id: 1,
      hokhau_id: 1,
      nhankhau_id: 1,
      loaithaydoi: 1,
      thoigian: "2024-01-15T10:30:00",
      hokhau_name: "HK001",
      nhankhau_name: "Nguyễn Văn A"
    },
    {
      id: 2,
      hokhau_id: 1,
      nhankhau_id: 2,
      loaithaydoi: 1,
      thoigian: "2024-01-20T14:15:00",
      hokhau_name: "HK001",
      nhankhau_name: "Trần Thị B"
    },
    {
      id: 3,
      hokhau_id: 2,
      nhankhau_id: 3,
      loaithaydoi: 2,
      thoigian: "2024-02-01T09:00:00",
      hokhau_name: "HK002",
      nhankhau_name: "Lê Văn C"
    },
    {
    "id": 4,
    "hokhau_id": 2,
    "nhankhau_id": 4,
    "loaithaydoi": 1,
    "thoigian": "2024-02-10T08:45:00",
    "hokhau_name": "HK002",
    "nhankhau_name": "Phạm Thị D"
  },
  {
    "id": 5,
    "hokhau_id": 1,
    "nhankhau_id": 5,
    "loaithaydoi": 2,
    "thoigian": "2024-02-15T11:20:00",
    "hokhau_name": "HK001",
    "nhankhau_name": "Hoàng Văn E"
  },
  {
    "id": 6,
    "hokhau_id": 3,
    "nhankhau_id": 6,
    "loaithaydoi": 1,
    "thoigian": "2024-03-01T10:00:00",
    "hokhau_name": "HK003",
    "nhankhau_name": "Nguyễn Thị F"
  },
  {
    "id": 7,
    "hokhau_id": 3,
    "nhankhau_id": 7,
    "loaithaydoi": 2,
    "thoigian": "2024-03-05T13:30:00",
    "hokhau_name": "HK003",
    "nhankhau_name": "Trần Văn G"
  },
  {
    "id": 8,
    "hokhau_id": 2,
    "nhankhau_id": 8,
    "loaithaydoi": 1,
    "thoigian": "2024-03-10T15:10:00",
    "hokhau_name": "HK002",
    "nhankhau_name": "Lê Thị H"
  }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHistory, setEditingHistory] = useState<LichSuHoKhau | null>(null);
  const [formData, setFormData] = useState<Partial<LichSuHoKhau>>({});
  const { toast } = useToast();

  const filteredHistories = histories.filter(history =>
    history.hokhau_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    history.nhankhau_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingHistory(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (history: LichSuHoKhau) => {
    setEditingHistory(history);
    setFormData(history);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setHistories(histories.filter(h => h.id !== id));
    toast({
      title: "Thành công",
      description: "Đã xóa lịch sử thành công",
    });
  };

  const handleSubmit = () => {
    if (editingHistory) {
      setHistories(histories.map(h => 
        h.id === editingHistory.id ? { ...h, ...formData } : h
      ));
      toast({
        title: "Thành công",
        description: "Đã cập nhật lịch sử thành công",
      });
    } else {
      const newHistory = {
        ...formData,
        id: Math.max(...histories.map(h => h.id)) + 1,
        thoigian: new Date().toISOString(),
      } as LichSuHoKhau;
      setHistories([...histories, newHistory]);
      toast({
        title: "Thành công",
        description: "Đã thêm lịch sử mới thành công",
      });
    }
    setIsDialogOpen(false);
    setFormData({});
  };

  const getChangeTypeText = (type: number) => {
    return type === 1 ? "Thêm vào" : "Xóa khỏi";
  };

  const getChangeTypeBadge = (type: number) => {
    return type === 1 ? "default" : "destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lịch sử hộ khẩu</h1>
            <p className="text-gray-600">Theo dõi lịch sử thay đổi thành viên hộ khẩu</p>
          </div>
          {userRole === "to_truong" && (
            <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm lịch sử
            </Button>
          )}
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <History className="w-6 h-6 mr-2 text-purple-600" />
                  Lịch sử thay đổi
                </CardTitle>
                <CardDescription>Tổng số: {histories.length} thay đổi</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo hộ khẩu, nhân khẩu..."
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
                  <TableHead>Nhân khẩu</TableHead>
                  <TableHead>Loại thay đổi</TableHead>
                  <TableHead>Thời gian</TableHead>
                  {userRole === "to_truong" && <TableHead className="text-right">Thao tác</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistories.map((history) => (
                  <TableRow key={history.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{history.hokhau_name}</TableCell>
                    <TableCell>{history.nhankhau_name}</TableCell>
                    <TableCell>
                      <Badge variant={getChangeTypeBadge(history.loaithaydoi) as any}>
                        {getChangeTypeText(history.loaithaydoi)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(history.thoigian).toLocaleString('vi-VN')}</TableCell>
                    {userRole === "to_truong" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(history)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(history.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {userRole === "to_truong" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingHistory ? "Chỉnh sửa lịch sử" : "Thêm lịch sử mới"}
                </DialogTitle>
                <DialogDescription>
                  Ghi lại thay đổi thành viên hộ khẩu
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                  <Label htmlFor="loaithaydoi">Loại thay đổi</Label>
                  <Select 
                    value={formData.loaithaydoi?.toString() || ""} 
                    onValueChange={(value) => setFormData({...formData, loaithaydoi: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại thay đổi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Thêm vào hộ khẩu</SelectItem>
                      <SelectItem value="2">Xóa khỏi hộ khẩu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  {editingHistory ? "Cập nhật" : "Thêm mới"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
