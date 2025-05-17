CREATE TABLE users (
    id SERIAL PRIMARY KEY
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    vaitro VARCHAR(20) NOT NULL
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
    ghichu TEXT
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
    CONSTRAINT fk_chu_ho FOREIGN KEY (chu_ho_id) REFERENCES nhankhau(id) ON DELETE RESTRICT
);

CREATE TABLE hokhau_nhankhau (
    hokhau_id INT NOT NULL,
    nhankhau_id INT NOT NULL,
    ngaythem DATE,
    quanhevoichuho VARCHAR(50),
    PRIMARY KEY (hokhau_id, nhankhau_id),
    CONSTRAINT fk_hokhau FOREIGN KEY (hokhau_id) REFERENCES hokhau(id) ON DELETE CASCADE,
    CONSTRAINT fk_nhankhau FOREIGN KEY (nhankhau_id) REFERENCES nhankhau(id) ON DELETE CASCADE
);

CREATE TABLE lichsu_hokhau (
    id SERIAL PRIMARY KEY,
    hokhau_id INT NOT NULL,
    nhankhau_id INT NOT NULL,
    loaithaydoi SMALLINT NOT NULL CHECK (loaithaydoi IN (1, 2)), -- 1: thêm, 2: xóa
    thoigian TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    CONSTRAINT fk_nhankhau_tt FOREIGN KEY (nhankhau_id) REFERENCES nhankhau(id) ON DELETE CASCADE
);

CREATE TABLE khoanthu (
    id SERIAL PRIMARY KEY,
    ngaytao DATE NOT NULL DEFAULT CURRENT_DATE,
    thoihan DATE,
    tenkhoanthu VARCHAR(100) NOT NULL,
    batbuoc BOOLEAN NOT NULL DEFAULT TRUE,
    ghichu TEXT
);

CREATE TABLE noptien (
    id SERIAL PRIMARY KEY,
    hokhau_id INT NOT NULL,
    khoanthu_id INT NOT NULL,
    nguoinop VARCHAR(100) NOT NULL,
    sotien NUMERIC(12,2) NOT NULL,
    ngaynop DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_hokhau_nt FOREIGN KEY (hokhau_id) REFERENCES hokhau(id) ON DELETE CASCADE,
    CONSTRAINT fk_khoanthu_nt FOREIGN KEY (khoanthu_id) REFERENCES khoanthu(id) ON DELETE CASCADE
);

-- Quan hệ 1-1: hokhau.chu_ho_id → nhankhau.id

-- Quan hệ 1-n: hokhau_nhankhau lưu các nhân khẩu thuộc hộ khẩu

-- Quan hệ n-n: lichsu_hokhau lưu lịch sử nhân khẩu thay đổi hộ khẩu

-- Quan hệ 1-n: tamtrutamvang theo nhân khẩu

-- Quan hệ n-n: noptien lưu thông tin hộ khẩu nộp tiền khoản thu