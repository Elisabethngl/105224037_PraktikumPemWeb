import subprocess

psql = r"C:\Program Files\PostgreSQL\18\bin\psql.exe"

sql_role = """
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'praktikum') THEN
      CREATE ROLE praktikum WITH LOGIN SUPERUSER CREATEDB CREATEROLE PASSWORD 'lokal-saja-123';
   ELSE
      ALTER ROLE praktikum WITH LOGIN SUPERUSER CREATEDB CREATEROLE PASSWORD 'lokal-saja-123';
   END IF;
END
$$;
"""

subprocess.run([psql, "-U", "postgres", "-h", "127.0.0.1", "-d", "postgres", "-c", sql_role], check=True)

check_db = subprocess.run([psql, "-U", "postgres", "-h", "127.0.0.1", "-d", "postgres", "-tAc", "SELECT 1 FROM pg_database WHERE datname='produk'"], capture_output=True, text=True)

if "1" not in check_db.stdout:
    subprocess.run([psql, "-U", "postgres", "-h", "127.0.0.1", "-d", "postgres", "-c", "CREATE DATABASE produk OWNER praktikum;"], check=True)
    print("Database produk created!")
else:
    print("Database produk already exists!")

# Test connecting as praktikum user to produk database
test_conn = subprocess.run([psql, "-U", "praktikum", "-h", "127.0.0.1", "-d", "produk", "-c", "SELECT current_user, current_database();"], capture_output=True, text=True)
print("Connection test:")
print(test_conn.stdout)
