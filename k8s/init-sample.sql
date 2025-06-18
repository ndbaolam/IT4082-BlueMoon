CREATE TYPE user_role AS ENUM ('ketoan', 'totruong');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    vaitro user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    sodienthoai VARCHAR(20),
    diachi VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    trangthai BOOLEAN DEFAULT TRUE
);

CREATE TABLE nhankhau (
    id SERIAL PRIMARY KEY,
    hoten VARCHAR(100) NOT NULL,
    ngaysinh DATE,
    gioitinh VARCHAR(10),
    dantoc VARCHAR(50),
    tongiao VARCHAR(50),
    cccd VARCHAR(12) UNIQUE,
    ngaycap DATE,
    noicap VARCHAR(100),
    nghenghiep VARCHAR(100),
    ghichu TEXT,
    trangthai BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hokhau (
    id SERIAL PRIMARY KEY,
    sohokhau VARCHAR(20) UNIQUE NOT NULL,
    sonha VARCHAR(100),
    duong VARCHAR(100),
    phuong VARCHAR(100),
    quan VARCHAR(100),
    ngaylamhokhau DATE,
    chu_ho_id INT NOT NULL,
    trangthai BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chu_ho FOREIGN KEY (chu_ho_id) REFERENCES nhankhau(id) ON DELETE RESTRICT
);

CREATE TABLE hokhau_nhankhau (
    hokhau_id INT NOT NULL,
    nhankhau_id INT NOT NULL,
    ngaythem DATE,
    quanhevoichuho VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (hokhau_id, nhankhau_id),
    CONSTRAINT fk_hokhau FOREIGN KEY (hokhau_id) REFERENCES hokhau(id) ON DELETE CASCADE,
    CONSTRAINT fk_nhankhau FOREIGN KEY (nhankhau_id) REFERENCES nhankhau(id) ON DELETE CASCADE
);

CREATE TABLE lichsu_hokhau (
    id SERIAL PRIMARY KEY,
    hokhau_id INT NOT NULL,
    nhankhau_id INT NOT NULL,
    loaithaydoi SMALLINT NOT NULL CHECK (loaithaydoi IN (1, 2)), -- 1: thêm, 2: xóa
    thoigian TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ghichu TEXT,
    CONSTRAINT fk_hokhau_ls FOREIGN KEY (hokhau_id) REFERENCES hokhau(id) ON DELETE CASCADE,
    CONSTRAINT fk_nhankhau_ls FOREIGN KEY (nhankhau_id) REFERENCES nhankhau(id) ON DELETE CASCADE
);

CREATE TABLE tamtrutamvang (
    id SERIAL PRIMARY KEY,
    nhankhau_id INT NOT NULL,
    trangthai VARCHAR(20) NOT NULL CHECK (trangthai IN ('tạm trú', 'tạm vắng')),
    diachitamtrutamvang VARCHAR(255),
    thoigian DATE,
    noidungdenghi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nhankhau_tt FOREIGN KEY (nhankhau_id) REFERENCES nhankhau(id) ON DELETE CASCADE
);

CREATE TABLE khoanthu (
    id SERIAL PRIMARY KEY,
    ngaytao DATE NOT NULL DEFAULT CURRENT_DATE,
    thoihan DATE,
    tenkhoanthu VARCHAR(100) NOT NULL,
    batbuoc BOOLEAN NOT NULL DEFAULT TRUE,
    sotien INT NOT NULL,
    ghichu TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE noptien (
    id SERIAL PRIMARY KEY,
    hokhau_id INT NOT NULL,
    khoanthu_id INT NOT NULL,
    nguoinop VARCHAR(100) NOT NULL,
    sotien NUMERIC(12,2) NOT NULL,
    ngaynop DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hokhau_nt FOREIGN KEY (hokhau_id) REFERENCES hokhau(id) ON DELETE CASCADE,
    CONSTRAINT fk_khoanthu_nt FOREIGN KEY (khoanthu_id) REFERENCES khoanthu(id) ON DELETE CASCADE
);

-- BƯỚC 1: Insert nhankhau TRƯỚC
INSERT INTO nhankhau (hoten, ngaysinh, gioitinh, dantoc, tongiao, cccd, ngaycap, noicap, nghenghiep, ghichu)
VALUES
('Nguyễn Văn A', '1990-01-01', 'nam', 'Kinh', 'Không', '001122334455', '2010-01-01', 'Hà Nội', 'Kỹ sư', 'Chuyên bào chữa ly hôn, tội phạm công nghệ cao'),
('Trần Thị B', '1992-02-02', 'nu', 'Kinh', 'Phật giáo', '002233445566', '2012-02-02', 'Hà Nội', 'Giáo viên', 'Giáo viên cấp 3 truờng THPT Chu Văn An - Hà Nội'),
('Lê Văn C', '1985-03-03', 'nam', 'Kinh', 'Không', '003344556677', '2008-03-03', 'Hà Nội', 'Lái xe', 'Từng gây tai nạn chết người'),
('Phạm Thị D', '1988-04-04', 'nu', 'Kinh', 'Thiên chúa giáo', '004455667788', '2009-04-04', 'HCM', 'Kế toán', 'Biển thủ công quỹ của công ty gây thất thóat hơn 100 tỷ đồng'),
('Hoàng Văn E', '1975-05-05', 'nam', 'Tày', 'Không', '005566778899', '2000-05-05', 'HCM', 'Bác sĩ', 'Để quên kéo trong thận bệnh nhân'),
('Người 6', '1980-01-01', 'nam', 'Kinh', 'Không', '0000000006', '2010-01-01', 'Hà Nội', 'Giáo viên', 'Thành viên tích cực của tổ dân phố'),
('Người 7', '1980-01-01', 'nam', 'Kinh', 'Thiên chúa giáo', '0000000007', '2010-01-01', 'Hà Nội', 'Kỹ sư', 'Có tiền án nhẹ'),
('Người 8', '1980-01-01', 'nam', 'Kinh', 'Không', '0000000008', '2010-01-01', 'Hà Nội', 'Lái xe', 'Tham gia công tác địa phương'),
('Người 9', '1980-01-01', 'nam', 'Kinh', 'Phật giáo', '0000000009', '2010-01-01', 'Hà Nội', 'Bác sĩ', 'Tham gia công tác địa phương'),
('Người 10', '1980-01-01', 'nu', 'Kinh', 'Không', '0000000010', '2010-01-01', 'Hà Nội', 'Kế toán', 'Không có ghi chú'),
('Người 11', '1980-01-01', 'nam', 'Kinh', 'Không', '0000000011', '2010-01-01', 'Hà Nội', 'Kế toán', 'Tham gia công tác địa phương'),
('Người 12', '1980-01-01', 'nu', 'Kinh', 'Phật giáo', '0000000012', '2010-01-01', 'Hà Nội', 'Kế toán', 'Thành viên tích cực của tổ dân phố'),
('Người 13', '1980-01-01', 'nam', 'Kinh', 'Thiên chúa giáo', '0000000013', '2010-01-01', 'Hà Nội', 'Kế toán', 'Tham gia công tác địa phương'),
('Người 14', '1980-01-01', 'nu', 'Kinh', 'Không', '0000000014', '2010-01-01', 'Hà Nội', 'Giáo viên', 'Thành viên tích cực của tổ dân phố'),
('Người 15', '1980-01-01', 'nu', 'Kinh', 'Không', '0000000015', '2010-01-01', 'Hà Nội', 'Bác sĩ', 'Thành viên tích cực của tổ dân phố');

INSERT INTO hokhau (sohokhau, sophong, ngaylamhokhau, chu_ho_id)
VALUES
('HK001', '10A', '2020-01-01', 1),
('HK002', '25B', '2019-03-15', 3),
('HK003', '18C', '2021-05-10', 5),
('HK004', '33D', '2022-02-20', 4),
('HK005', '99E', '2018-12-25', 2),
('HK106', '6A', '2020-01-01', 6),
('HK107', '7A', '2020-01-01', 7),
('HK108', '8A', '2020-01-01', 8),
('HK109', '9A', '2020-01-01', 9),
('HK1010', '10A', '2020-01-01', 10),
('HK1011', '11A', '2020-01-01', 11),
('HK1012', '12A', '2020-01-01', 12),
('HK1013', '13A', '2020-01-01', 13),
('HK1014', '14A', '2020-01-01', 14),
('HK1015', '15A', '2020-01-01', 15);


INSERT INTO hokhau_nhankhau (hokhau_id, nhankhau_id, ngaythem, quanhevoichuho)
VALUES
(1, 1, '2020-01-01', 'Chủ hộ'),
(1, 2, '2020-01-02', 'Vợ'),
(2, 3, '2019-03-15', 'Chủ hộ'),
(2, 4, '2019-03-20', 'Vợ'),
(3, 5, '2021-05-10', 'Chủ hộ'),
(6, 6, '2020-01-01', 'Chủ hộ'),
(7, 7, '2020-01-01', 'Chủ hộ'),
(8, 8, '2020-01-01', 'Chủ hộ'),
(9, 9, '2020-01-01', 'Chủ hộ'),
(10, 10, '2020-01-01', 'Chủ hộ'),
(11, 11, '2020-01-01', 'Chủ hộ'),
(12, 12, '2020-01-01', 'Chủ hộ'),
(13, 13, '2020-01-01', 'Chủ hộ'),
(14, 14, '2020-01-01', 'Chủ hộ'),
(15, 15, '2020-01-01', 'Chủ hộ');

INSERT INTO khoanthu (tenkhoanthu, thoihan, batbuoc, sotien, ghichu)
VALUES
('Phí vệ sinh', '2025-12-31', true, 10000000, 'Phí hàng năm'),
('Quỹ an ninh', '2025-06-30', true, 20000000, 'Bắt buộc toàn hộ'),
('Ủng hộ người nghèo', NULL, false, 30000000, 'Tự nguyện'),
('Phí sửa đường', '2025-10-10', true, 10000000, ''),
('Quỹ khuyến học', NULL, false, 16900000,'Tự nguyện ủng hộ học sinh'),
('Phí gửi xe', '2025-07-01', true, 3600000, 'Theo xe máy/ô tô'),
('Khoản thu 7', '2025-12-31', true, 4127361, 'Bắt buộc'),
('Khoản thu 8', '2025-12-31', false, 2044043, 'Tự nguyện'),
('Khoản thu 9', '2025-12-31', true, 2923546, 'Bắt buộc'),
('Khoản thu 10', '2025-12-31', false, 1585263, 'Tự nguyện'),
('Khoản thu 11', '2025-12-31', true, 1583990, 'Bắt buộc'),
('Khoản thu 12', '2025-12-31', false, 4781558, 'Tự nguyện'),
('Khoản thu 13', '2025-12-31', true, 2893076, 'Bắt buộc'),
('Khoản thu 14', '2025-12-31', false, 3110424, 'Tự nguyện'),
('Khoản thu 15', '2025-12-31', true, 2735688, 'Bắt buộc'),
('Khoản thu 16', '2025-12-31', false, 3772234, 'Tự nguyện');

INSERT INTO noptien (hokhau_id, khoanthu_id, nguoinop, sotien, ngaynop)
VALUES
(1, 1, 'Nguyễn Văn A', 500000, '2025-01-15'),
(1, 2, 'Trần Thị B', 300000, '2025-03-01'),
(2, 1, 'Lê Văn C', 500000, '2025-02-01'),
(3, 3, 'Hoàng Văn E', 200000, '2025-04-10'),
(4, 4, 'Phạm Thị D', 1000000, '2025-05-20'),
(6, 7, 'Người 6', 215307, '2025-06-01'),
(7, 8, 'Người 7', 418826, '2025-06-01'),
(8, 9, 'Người 8', 449942, '2025-06-01'),
(9, 10, 'Người 9', 192932, '2025-06-01'),
(10, 1, 'Người 10', 208997, '2025-06-01'),
(11, 2, 'Người 11', 136321, '2025-06-01'),
(12, 3, 'Người 12', 269193, '2025-06-01'),
(13, 4, 'Người 13', 152625, '2025-06-01'),
(14, 5, 'Người 14', 413379, '2025-06-01'),
(15, 6, 'Người 15', 208188, '2025-06-01');

INSERT INTO lichsu_hokhau (hokhau_id, nhankhau_id, loaithaydoi)
VALUES
(1, 2, 1),
(2, 4, 1),
(1, 2, 2),
(3, 5, 1),
(8, 8, 2),
(9, 9, 2),
(10, 10, 2),
(11, 11, 2),
(12, 12, 1),
(14, 14, 1),
(6, 6, 1),
(7, 7, 1),
(13, 13, 1),
(15, 15, 1);

INSERT INTO tamtrutamvang (nhankhau_id, trangthai, diachitamtrutamvang, thoigian, noidungdenghi)
VALUES
(2, 'tamvang', 'TP.HCM', '2025-06-01', 'Về quê'),
(3, 'tamtru', 'Đà Nẵng', '2025-07-15', 'Công tác'),
(5, 'tamvang', 'Nghệ An', '2025-08-10', 'Thăm người thân'),
(1, 'tamtru', 'Hải Phòng', '2025-06-10', 'Làm việc'),
(4, 'tamtru', 'Cần Thơ', '2025-09-05', 'Chăm sóc người thân'),
(6, 'tamtru', 'Địa chỉ 6', '2025-06-01', 'Lý do 6'),
(7, 'tamtru', 'Địa chỉ 7', '2025-06-01', 'Lý do 7'),
(8, 'tamvang', 'Địa chỉ 8', '2025-06-01', 'Lý do 8'),
(9, 'tamtru', 'Địa chỉ 9', '2025-06-01', 'Lý do 9'),
(10, 'tamvang', 'Địa chỉ 10', '2025-06-01', 'Lý do 10'),
(11, 'tamtru', 'Địa chỉ 11', '2025-06-01', 'Lý do 11'),
(12, 'tamtru', 'Địa chỉ 12', '2025-06-01', 'Lý do 12'),
(13, 'tamtru', 'Địa chỉ 13', '2025-06-01', 'Lý do 13'),
(14, 'tamtru', 'Địa chỉ 14', '2025-06-01', 'Lý do 14'),
(15, 'tamtru', 'Địa chỉ 15', '2025-06-01', 'Lý do 15');

INSERT INTO users (password, vaitro, first_name, last_name, email, sodienthoai, diachi)
VALUES
('1', 'ketoan', 'Mai', 'An', 'an.mai@example.com', '0901123456', 'Hà Nội'),
('1', 'totruong', 'Lê', 'Bình', 'binh.le@example.com', '0902233445', 'Hà Nội'),
('1', 'ketoan', 'Ngô', 'Cường', 'cuong.ngo@example.com', '0903344556', 'Hà Nội'),
('1', 'totruong', 'Đặng', 'Dũng', 'dung.dang@example.com', '0904455667', 'HCM'),
('1', 'ketoan', 'Trần', 'Hà', 'ha.tran@example.com', '0905566778', 'Đà Nẵng');
