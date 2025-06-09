import psycopg2
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Lấy thông tin kết nối từ .env hoặc dùng default
POSTGRES_USER = os.getenv("POSTGRES_USER", "ktpm")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "ktpm")
POSTGRES_DB = os.getenv("POSTGRES_DB", "ktpm")
DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:5432/{POSTGRES_DB}"

print(f"Attempting to connect to: {DATABASE_URL}")

# Test 1: Kết nối trực tiếp với psycopg2
print("\n=== Test 1: Direct psycopg2 connection ===")
try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD
    )
    print("✅ psycopg2 connection successful!")
    
    # Test query
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"PostgreSQL version: {version[0]}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ psycopg2 connection failed: {e}")

# Test 2: Kết nối với SQLAlchemy
print("\n=== Test 2: SQLAlchemy connection ===")
try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute("SELECT 1")
        print("✅ SQLAlchemy connection successful!")
        
except Exception as e:
    print(f"❌ SQLAlchemy connection failed: {e}")

# Test 3: Kiểm tra các biến môi trường
print("\n=== Test 3: Environment Variables ===")
print(f"POSTGRES_USER: {POSTGRES_USER}")
print(f"POSTGRES_PASSWORD: {POSTGRES_PASSWORD}")
print(f"POSTGRES_DB: {POSTGRES_DB}")
print(f"DATABASE_URL: {DATABASE_URL}")