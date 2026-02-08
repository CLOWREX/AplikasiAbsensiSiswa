import sqlite3
import psycopg2
from psycopg2.extras import execute_values

# CONFIGURATION
POSTGRES_URL = "postgresql://postgres:TJlkpPhlEEDebplvNxGsbWdPelCDOYgM@caboose.proxy.rlwy.net:28124/railway"
SQLITE_FILE = "absensi.db"

def start_migration():
    try:
        print("🔄 Menghubungkan ke database...")
        sl_conn = sqlite3.connect(SQLITE_FILE)
        sl_cur = sl_conn.cursor()

        pg_conn = psycopg2.connect(POSTGRES_URL)
        pg_cur = pg_conn.cursor()

        tables = ["users", "schedules", "qr_codes", "notifications", "attendances"] 

        for table in tables:
            print(f"📦 Memindahkan tabel: {table}...")
            
            sl_cur.execute(f"SELECT * FROM {table}")
            rows = sl_cur.fetchall()
            
            if not rows:
                print(f"⚠️ Tabel {table} kosong. Skip.")
                continue

            colnames = [desc[0] for desc in sl_cur.description]
            col_str = ",".join(colnames)
            
            query = f"INSERT INTO {table} ({col_str}) VALUES %s ON CONFLICT DO NOTHING"
            execute_values(pg_cur, query, rows)
            print(f"✅ {len(rows)} data pada tabel '{table}' berhasil dipindah.")

        pg_conn.commit()
        print("\n🚀 MIGRASI TOTAL SELESAI! Semua data sudah di Cloud Railway.")

    except Exception as e:
        print(f"❌ Error saat migrasi: {e}")
    finally:
        if 'sl_conn' in locals(): sl_conn.close()
        if 'pg_conn' in locals(): pg_conn.close()

if __name__ == "__main__":
    start_migration()