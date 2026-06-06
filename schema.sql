-- ==========================================
-- FASA 1: SKEMA PANGKALAN DATA (schema.sql)
-- EVENT: LANGKAWI ECO RUN 2.0
-- TOOL: CLOUDFLARE D1 (SQLITE)
-- ==========================================

-- Kunci asing (Foreign Keys) perlu diaktifkan secara manual dalam SQLite jika diperlukan,
-- tetapi struktur ini sudah menyediakan hubungan relasi yang tepat.

-- 1. JADUAL ADMINS (Akaun Urusetia)
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,                  -- UUID v4 (cth: 'usr_123456...')
    username TEXT UNIQUE NOT NULL,        -- ID Log Masuk Admin
    password_hash TEXT NOT NULL,          -- Kata laluan yang di-hash (Bcrypt)
    role TEXT DEFAULT 'VOLUNTEER',         -- 'SUPER_ADMIN', 'VERIFIER', 'VOLUNTEER'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. JADUAL PARTICIPANTS (Profil Akaun Peserta)
CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,                  -- UUID v4
    full_name TEXT NOT NULL,              -- Nama penuh dalam IC/Pasport
    ic_or_passport TEXT UNIQUE NOT NULL,  -- ID Log Masuk Peserta (Unik)
    email TEXT UNIQUE NOT NULL,           -- E-mel komunikasi
    phone TEXT NOT NULL,                  -- No. Telefon Telefon
    gender TEXT CHECK(gender IN ('MALE', 'FEMALE')) NOT NULL,
    age INTEGER NOT NULL,                 -- Umur semasa pendaftaran
    password_hash TEXT NOT NULL,          -- Kata laluan dashboard (Bcrypt)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. JADUAL REGISTRATIONS (Data Larian Kontrak)
CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,                  -- UUID v4
    participant_id TEXT NOT NULL,         -- Hubungan ke jadual participants
    category TEXT CHECK(category IN ('5KM', '10KM')) NOT NULL,
    tshirt_size TEXT NOT NULL,            -- XS, S, M, L, XL, XXL, etc.
    bib_number TEXT UNIQUE DEFAULT NULL,  -- NULL semasa pending, ada nilai selepas verified
    emergency_name TEXT NOT NULL,         -- Nama waris
    emergency_phone TEXT NOT NULL,        -- No telefon waris
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- 4. JADUAL PAYMENTS (Log Transaksi & Resit R2)
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,                  -- UUID v4
    registration_id TEXT NOT NULL,        -- Hubungan ke jadual registrations
    receipt_r2_key TEXT NOT NULL,         -- Nama fail/path dalam R2 (cth: 'receipts/rcpt_9823.jpg')
    status TEXT CHECK(status IN ('PENDING', 'VERIFIED', 'REJECTED')) DEFAULT 'PENDING',
    rejection_reason TEXT DEFAULT NULL,   -- Diisi jika status = 'REJECTED'
    verified_by TEXT DEFAULT NULL,        -- ID Admin yang buat semakan
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES admins(id)
);

-- 5. INDEXES (Untuk mempercepatkan carian & tapisan data oleh Admin)
CREATE INDEX IF NOT EXISTS idx_participants_ic ON participants(ic_or_passport);
CREATE INDEX IF NOT EXISTS idx_registrations_category ON registrations(category);
CREATE INDEX IF NOT EXISTS idx_registrations_bib ON registrations(bib_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- DATA PERMULAAN: Cipta akaun Admin pertama secara automatik
-- Username: admin_langkawi
-- Password asal: Temp123! (Nota: Kita letak teks biasa dulu untuk mudahkan fasa setup awal ini)
INSERT INTO admins (id, username, password_hash, role) 
VALUES ('adm_001', 'admin_langkawi', 'Temp123!', 'SUPER_ADMIN')
ON CONFLICT(username) DO NOTHING;