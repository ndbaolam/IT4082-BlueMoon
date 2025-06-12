import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/axiosConfig";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

interface ReportsProps {
  userRole: "to_truong" | "ke_toan";
}

export const Reports = ({ userRole }: ReportsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showFinanceReport, setShowFinanceReport] = useState(false);
  const [pieData, setPieData] = useState<any[]>([]);
  const [showPersonReport, setShowPersonReport] = useState(false);
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0 });
  const [residenceStats, setResidenceStats] = useState({
    tamtru: 0,
    tamvang: 0,
  });

  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalHouseholds: 0,
    outstandingAmount: 0,
    collectionRate: 0,
    totalMustPay: 0, // Tổng số tiền khoản thu bắt buộc
  });

  useEffect(() => {
    Promise.all([
      apiClient.get("/khoanthu/"),
      apiClient.get("/hokhau/"),
      apiClient.get("/noptien/"),
    ]).then(([resKhoanThu, resHoKhau, resNopTien]) => {
      const households = resHoKhau.data;
      // Tổng số tiền khoản thu bắt buộc = tổng các khoản thu bắt buộc * số hộ khẩu
      const noptien = resNopTien.data;
      const pieChartData = resKhoanThu.data.map((kt: any) => {
        const totalMustPay = (Number(kt.sotien) || 0) * households.length;
        const totalPaid = noptien
          .filter((nt: any) => nt.khoanthu_id === kt.id)
          .reduce((sum: number, nt: any) => sum + Number(nt.sotien || 0), 0);
        return {
          id: kt.id,
          tenkhoanthu: kt.tenkhoanthu,
          totalPaid,
          totalMustPay,
        };
      });
      setPieData(pieChartData);
      const khoanThuBatBuoc = resKhoanThu.data.filter((kt: any) => kt.batbuoc);
      const totalMustPayPerHousehold = khoanThuBatBuoc.reduce(
        (sum: number, kt: any) => sum + Number(kt.sotien || 0),
        0
      );
      const totalMustPay = totalMustPayPerHousehold * households.length;
      // Tổng số tiền đã thanh toán
      const totalRevenue = resNopTien.data.reduce(
        (sum: number, nt: any) => sum + Number(nt.sotien || 0),
        0
      );
      // Số tiền chưa thu = tổng khoản thu bắt buộc - đã thanh toán
      const outstandingAmount = totalMustPay - totalRevenue;
      // Tỷ lệ thu phí
      const collectionRate =
        totalMustPay > 0
          ? Math.round((totalRevenue / totalMustPay) * 1000) / 10
          : 0;
      setReportData((prev) => ({
        ...prev,
        totalMustPay,
        totalRevenue,
        outstandingAmount: outstandingAmount > 0 ? outstandingAmount : 0,
        collectionRate,
        totalHouseholds: households.length,
      }));
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const recentReports = [
    {
      name: "Báo cáo thu chi tháng 10/2024",
      type: "Tài chính",
      date: "2024-11-01",
      status: "Hoàn thành",
    },
    {
      name: "Báo cáo biến đổi nhân khẩu Q3/2024",
      type: "Nhân khẩu",
      date: "2024-10-15",
      status: "Hoàn thành",
    },
    {
      name: "Báo cáo tình hình thu phí tháng 9/2024",
      type: "Thu phí",
      date: "2024-10-01",
      status: "Hoàn thành",
    },
    {
      name: "Báo cáo thu chi tháng 10/2024",
      type: "Tài chính",
      date: "2024-11-01",
      status: "Hoàn thành",
    },
    {
      name: "Báo cáo biến đổi nhân khẩu Q3/2024",
      type: "Nhân khẩu",
      date: "2024-10-15",
      status: "Hoàn thành",
    },
  ];

  if (showFinanceReport) {
    return (
      <div className="space-y-6 p-10">
        <Button
          onClick={() => setShowFinanceReport(false)}
          className="mb-4"
          variant="outline"
        >
          ← Quay lại
        </Button>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Biểu đồ thu chi từng khoản thu
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pieData.map((kt) => (
            <div
              key={kt.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100 hover:shadow-2xl transition-shadow duration-200"
            >
              <div className="font-semibold mb-2 text-center text-base text-gray-800">
                {kt.tenkhoanthu}
              </div>
              <div className="w-48 h-48 flex items-center justify-center">
                <Pie
                  data={{
                    labels: ["Đã nộp", "Chưa nộp"],
                    datasets: [
                      {
                        data: [
                          kt.totalPaid,
                          Math.max(kt.totalMustPay - kt.totalPaid, 0),
                        ],
                        backgroundColor: ["#22c55e", "#f87171"],
                        borderWidth: 2,
                        borderColor: ["#e5e7eb", "#e5e7eb"],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { font: { size: 14 } },
                      },
                      tooltip: { enabled: true },
                    },
                    cutout: "60%",
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div className="flex justify-between w-full text-sm mt-4 px-2">
                <span className="text-green-600 font-medium">
                  Đã nộp: {formatCurrency(kt.totalPaid)}
                </span>
                <span className="text-red-500 font-medium">
                  Chưa nộp:{" "}
                  {formatCurrency(Math.max(kt.totalMustPay - kt.totalPaid, 0))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showPersonReport) {
    return (
      <div className="space-y-6 p-10">
        <Button
          onClick={() => setShowPersonReport(false)}
          className="mb-4"
          variant="outline"
        >
          ← Quay lại
        </Button>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Biểu đồ nhân khẩu
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100">
            <div className="font-semibold mb-2 text-center text-base text-gray-800">
              Tỷ lệ giới tính
            </div>
            <div className="w-48 h-48 flex items-center justify-center">
              <Pie
                data={{
                  labels: ["Nam", "Nữ"],
                  datasets: [
                    {
                      data: [genderStats.male, genderStats.female],
                      backgroundColor: ["#3b82f6", "#f472b6"],
                      borderWidth: 2,
                      borderColor: ["#e5e7eb", "#e5e7eb"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { font: { size: 14 } },
                    },
                    tooltip: { enabled: true },
                  },
                  cutout: "60%",
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <div className="flex justify-between w-full text-sm mt-4 px-2">
              <span className="text-blue-600 font-medium">
                Nam: {genderStats.male}
              </span>
              <span className="text-pink-500 font-medium">
                Nữ: {genderStats.female}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100">
            <div className="font-semibold mb-2 text-center text-base text-gray-800">
              Tỷ lệ tạm trú / tạm vắng
            </div>
            <div className="w-48 h-48 flex items-center justify-center">
              <Pie
                data={{
                  labels: ["Tạm trú", "Tạm vắng"],
                  datasets: [
                    {
                      data: [residenceStats.tamtru, residenceStats.tamvang],
                      backgroundColor: ["#34d399", "#fbbf24"],
                      borderWidth: 2,
                      borderColor: ["#e5e7eb", "#e5e7eb"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { font: { size: 14 } },
                    },
                    tooltip: { enabled: true },
                  },
                  cutout: "60%",
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <div className="flex justify-between w-full text-sm mt-4 px-2">
              <span className="text-green-600 font-medium">
                Tạm trú: {residenceStats.tamtru}
              </span>
              <span className="text-yellow-500 font-medium">
                Tạm vắng: {residenceStats.tamvang}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo thống kê</h1>
          <p className="text-gray-600 mt-2">
            Tạo và quản lý các báo cáo thống kê
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Tháng</SelectItem>
              <SelectItem value="quarter">Quý</SelectItem>
              <SelectItem value="year">Năm</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Khoản thu bắt buộc
            </CardTitle>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(reportData.totalMustPay)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng thu nhập
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(reportData.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng hộ khẩu
            </CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {reportData.totalHouseholds}
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5 hộ mới trong tháng
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tỷ lệ thu phí
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {reportData.collectionRate}%
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Số tiền chưa thu
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(reportData.outstandingAmount)}
            </div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="w-3 h-3 mr-1" />
              -8.3% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tạo báo cáo mới</CardTitle>
            <CardDescription>Chọn loại báo cáo bạn muốn tạo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => setShowFinanceReport(true)}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Báo cáo thu chi</div>
                    <div className="text-sm text-gray-500">
                      Tổng hợp thu nhập và chi phí
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={async () => {
                  // Lấy dữ liệu nhân khẩu và tạm trú/tạm vắng
                  const [resNK, resTTTV] = await Promise.all([
                    apiClient.get("/nhankhau/"),
                    apiClient.get("/tamtrutamvang/"),
                  ]);
                  // Thống kê giới tính
                  const male = resNK.data.filter(
                    (nk: any) => nk.gioitinh === "Nam"
                  ).length;
                  const female = resNK.data.filter(
                    (nk: any) => nk.gioitinh === "Nữ"
                  ).length;
                  setGenderStats({ male, female });
                  // Thống kê tạm trú/tạm vắng
                  const tamtru = resTTTV.data.filter((r: any) => r.trangthai === "tạm trú").length;
                  const tamvang = resTTTV.data.filter((r: any) => r.trangthai === "tạm vắng").length;
                  setResidenceStats({ tamtru, tamvang });
                  setShowPersonReport(true);
                }}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Báo cáo nhân khẩu</div>
                    <div className="text-sm text-gray-500">
                      Thống kê biến đổi nhân khẩu
                    </div>
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Báo cáo thu phí</div>
                    <div className="text-sm text-gray-500">
                      Tình hình thu các khoản phí
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo gần đây</CardTitle>
            <CardDescription>
              Các báo cáo đã được tạo trong thời gian gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-gray-500">
                        {report.type} • {report.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {report.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
