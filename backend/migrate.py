import sqlite3
import psycopg2
from psycopg2.extras import execute_values

POSTGRES_URL = "postgresql://postgres:AcvlwcGGACeZAEvOFFbFJkkpAlQAfvmT@metro.proxy.rlwy.net:18879/railway"
SQLITE_FILE = "absensi.db"

def start_migration():
    try:
        print("🔄 Menghubungkan ke database...")
        sl_conn = sqlite3.connect(SQLITE_FILE)
        sl_cur = sl_conn.cursor()

        pg_conn = psycopg2.connect(POSTGRES_URL)
        pg_cur = pg_conn.cursor()

        pg_cur.execute("SET search_path TO public")

        pg_cur.execute("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';")
        existing_tables = [t[0] for t in pg_cur.fetchall()]
        print(f"🔎 Tabel yang terdeteksi di Railway: {existing_tables}")

        tables_to_migrate = ["users", "schedules", "qr_codes", "notifications", "attendances"] 

        for table in tables_to_migrate:
            if table not in existing_tables:
                print(f"❌ Error: Tabel '{table}' tetap tidak ditemukan di Railway! Lewati...")
                continue
                
            print(f"📦 Memindahkan tabel: {table}...")
            sl_cur.execute(f"SELECT * FROM {table}")
            rows = sl_cur.fetchall()
            
            if not rows:
                print(f"⚠️ Tabel {table} di SQLite kosong. Skip.")
                continue

            colnames = [desc[0] for desc in sl_cur.description]
            col_str = ",".join(colnames)
            
            query = f'INSERT INTO public."{table}" ({col_str}) VALUES %s ON CONFLICT DO NOTHING'
            execute_values(pg_cur, query, rows)
            print(f"✅ {len(rows)} data pada tabel '{table}' berhasil dipindah.")

        pg_conn.commit()
        print("\n🚀 PROSES SELESAI!")

    except Exception as e:
        print(f"❌ Error saat migrasi: {e}")
    finally:
        if 'sl_conn' in locals(): sl_conn.close()
        if 'pg_conn' in locals(): pg_conn.close()

if __name__ == "__main__":
    start_migration()