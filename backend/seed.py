from app.database import SessionLocal, engine, Base
from app import models
from datetime import date, timedelta
import random

MODE = "full"  
STUDENTS_TOTAL = 757
START_NIS = 13001

db = SessionLocal()

INDO_FIRST = ["Andi","Siti","Budi","Dewi","Eko","Farhan","Gita","Hadi","Indah","Joko",
              "Kiki","Lutfi","Maulana","Nina","Oky","Putri","Qori","Rizky","Sule","Tio",
              "Umar","Vina","Wanda","Xena","Yuni","Zaskia","Ahmad","Baim","Cinta","Deddy",
              "Ernest","Fiersa","Gading","Hesti"]
INDO_LAST = ["Pratama","Aminah","Rejeki","Lestari","Prasetyo","Septian","Gutawa","Wijaya",
             "Permata","Susilo","Amalia","Hakim","Malik","Zatulini","Setiawan","Salju",
             "Sandioriva","Billar","Sutisna","Nugroho","Bin Khattab","Panduwinata",
             "Hamida","Warrior","Shara","Adya","Dhani","Wong","Laura","Corbuzier",
             "Prakasa","Besari","Marten","Purwadinata"]

FOREIGN_FIRST = ["John","Jane","Michael","Emily","William","Olivia","James","Sophia","Benjamin","Isabella",
                 "Lucas","Mia","Alexander","Charlotte","Ethan","Amelia","Daniel","Harper","Matthew","Abigail"]
FOREIGN_LAST = ["Doe","Smith","Brown","Davis","Johnson","Martinez","Wilson","Anderson","Taylor","Thomas",
                "Moore","Jackson","White","Harris","Martin","Thompson","Garcia","Clark","Lewis","Robinson"]

def generate_name_pool():
    pool = [f"{f} {l}" for f in INDO_FIRST for l in INDO_LAST]
    pool += [f"{f} {l}" for f in FOREIGN_FIRST for l in FOREIGN_LAST]
    random.shuffle(pool)
    return pool

def fast_hash(password: str):
    return password  

try:
    print(f"🚀 Running seed in mode: {MODE}")
    
    if MODE == "full":
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("✅ Database reset & tables created.")

    qr_files = ["qr_2026-01-31.png", "qr_2026-02-01.png", "qr_13001.png", "qr_13002.png"]
    for f in qr_files:
        db.add(models.QRCode(file_path=f"{f}", created_at=date.today()))

    teacher = models.User(
        username="111111111111111111",
        password=fast_hash("teacher123"),
        fullname="Mr. Budi Santoso",
        role="teacher",
        phone="085719991893"
    )
    db.add(teacher)
    db.flush()

    nis_counter = START_NIS
    students_data = [{"username": "13096", "name": "Bella Angeline Revanya", "student_class": "XI RPL"}]
    used_names = {"Bella Angeline Revanya"}
    name_pool = generate_name_pool()

    for _ in range(STUDENTS_TOTAL - 1):
        if nis_counter == 13096: nis_counter += 1
        while True:
            full_name = name_pool.pop() if name_pool else f"{random.choice(INDO_FIRST)} {random.choice(FOREIGN_LAST)}"
            if full_name not in used_names:
                used_names.add(full_name)
                break
        year = random.choice(["X","XI","XII"])
        major = random.choice(["BD","BR","AKL1","AKL2","MP","ML","RPL"])
        students_data.append({
            "username": str(nis_counter),
            "name": full_name,
            "student_class": f"{year} {major}"
        })
        nis_counter += 1

    for s in students_data:
        db.add(models.User(
            username=s["username"],
            password=fast_hash("student123"),
            fullname=s["name"],
            role="student",
            student_class=s["student_class"],
            phone=f"0851{s['username']}"
        ))
    db.commit()
    print(f"✅ {len(students_data)} Students created.")

    print("⏳ Generating attendance for the last 7 days...")
    sick_reasons = ["Demam tinggi", "Flu dan batuk", "Sakit perut", "Pusing/Migrain", "Diare"]
    permit_reasons = ["Acara keluarga", "Urusan mendadak", "Menengok saudara", "Kepentingan pribadi"]
    db_students = db.query(models.User).filter(models.User.role == "student").all()

    for day_offset in range(7):
        current_date = date.today() - timedelta(days=day_offset)
        if current_date.strftime('%A') == 'Sunday':
            continue
        attendance_entries = []
        for student in db_students:
            status_choice = random.choices(
                ["Present On time", "Present Late", "Sick", "Permission", "Alpha"],
                weights=[0.6, 0.15, 0.05, 0.05, 0.15], k=1
            )[0]
            time_str = f"{random.randint(6,7):02d}:{random.randint(0,59):02d}" if "Present" in status_choice else ""
            if "Present" in status_choice:
                expl = ""
                desc = "On time" if "On time" in status_choice else "Late"
                status_db = "Present"
            elif status_choice == "Sick":
                expl = random.choice(sick_reasons)
                desc = "Sick"
                status_db = "Sick"
            elif status_choice == "Permission":
                expl = random.choice(permit_reasons)
                desc = "Permission"
                status_db = "Permission"
            else:
                expl = "Absent without permission"
                desc = "Alpha"
                status_db = "Absent"
            attendance_entries.append(models.Attendance(
                user_id=student.id,
                status=status_db,
                explanation=expl,
                date=current_date,
                time=time_str,
                time_status=desc
            ))
        db.bulk_save_objects(attendance_entries)
        db.commit()
        print(f"   📅 Date {current_date} processed.")

    schedules = [
        {"day":"Monday","time":"06:30 - 07:15","subject":"Upacara","teacher":"Sekolah","room":"Lapangan"},
        {"day":"Monday","time":"07:15 - 09:30","subject":"Pendidikan Agama","teacher":"Nurul Asfiyah, S.Pd / Tiomsi Sitorus, S.Th","room":"Ruang Teori 1"},
        {"day":"Monday","time":"09:50 - 11:20","subject":"PJOK","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lapangan"},
        {"day":"Monday","time":"11:20 - 13:30","subject":"Sejarah","teacher":"Siti Sarifah, S.Pd","room":"Ruang Teori 1"},
        {"day":"Monday","time":"13:30 - 15:00","subject":"Mapel Pilihan","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori 1"},

        {"day":"Tuesday","time":"06:30 - 10:35","subject":"Konsentrasi Keahlian (KK)","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lab RPL"},
        {"day":"Tuesday","time":"10:35 - 12:05","subject":"Mapel Pilihan","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori 1"},
        {"day":"Tuesday","time":"12:45 - 15:00","subject":"PKK","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori 1"},

        {"day":"Wednesday","time":"06:30 - 07:15","subject":"BK","teacher":"Muh. Nurrahman, S.Kom","room":"Ruang Teori 1"},
        {"day":"Wednesday","time":"07:15 - 08:00","subject":"Bahasa Jepang","teacher":"Wuryaningrum, S.Pd","room":"Ruang Teori 1"},
        {"day":"Wednesday","time":"08:00 - 09:30","subject":"Bahasa Inggris","teacher":"Mega Rahmawati, S.Pd","room":"Ruang Teori 1"},
        {"day":"Wednesday","time":"09:50 - 15:00","subject":"Konsentrasi Keahlian (KK)","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lab RPL"},

        {"day":"Thursday","time":"06:30 - 08:45","subject":"Matematika","teacher":"Sarwadi, S.Pd","room":"Ruang Teori 1"},
        {"day":"Thursday","time":"08:45 - 12:05","subject":"Konsentrasi Keahlian (KK)","teacher":"Muh. Nurrohman, S.Kom","room":"Lab RPL"},
        {"day":"Thursday","time":"12:45 - 15:00","subject":"Konsentrasi Keahlian (KK)","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lab RPL"},

        {"day":"Friday","time":"06:30 - 07:15","subject":"Kegiatan Rutin Jumat","teacher":"Sekolah","room":"Lapangan"},
        {"day":"Friday","time":"07:15 - 08:35","subject":"Bahasa Inggris","teacher":"Mega Rahmawati, S.Pd","room":"Ruang Teori 1"},
        {"day":"Friday","time":"08:35 - 09:55","subject":"PKK","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori 1"},
        {"day":"Friday","time":"10:15 - 13:40","subject":"Bahasa Indonesia","teacher":"Sudewo Pranowo, M.Pd","room":"Ruang Teori 1"},
        {"day":"Friday","time":"13:40 - 15:00","subject":"PP","teacher":"Habibah, S.Pd","room":"Ruang Teori 1"},
    ]
    
    for sch in schedules:
        db.add(models.Schedule(**sch))
    db.commit()

    print(f"\n🔥 SEEDING COMPLETED SUCCESSFULLY!")
    print(f"Total Records: {db.query(models.Attendance).count()} attendance entries.")

except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
