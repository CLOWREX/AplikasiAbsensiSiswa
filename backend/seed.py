from app.database import SessionLocal, engine, Base
from app import models
from datetime import datetime, date
import random

MODE = "users_only"  
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
    pool = []
    for f in INDO_FIRST:
        for l in INDO_LAST:
            pool.append(f"{f} {l}")
    for f in FOREIGN_FIRST:
        for l in FOREIGN_LAST:
            pool.append(f"{f} {l}")
    random.shuffle(pool)
    return pool

def fast_hash(password: str):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=4) 
    return pwd_context.hash(password)

try:
    print(f"🚀 Running seed in mode: {MODE}")
    today_date = date.today()

    if MODE == "full":
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("✅ Database reset complete.")

    teacher = db.query(models.User).filter(models.User.username == "111111111111111111").first()
    if not teacher:
        teacher = models.User(
            username="111111111111111111",
            password=fast_hash("teacher123"),
            fullname="Mr. Budi Santoso",
            role="teacher",
            phone="085719991893",
            student_class=None
        )
        db.add(teacher)
        db.flush()

    db.query(models.User).filter(models.User.role=="student").delete(synchronize_session=False)
    db.commit()

    nis_counter = START_NIS
    students = []
    used_names = set(["Bella Angeline Revanya"])

    students.append({
        "username": "13096",
        "name": "Bella Angeline Revanya",
        "phone": "085156775762",
        "student_class": "XI RPL"
    })

    name_pool = generate_name_pool()

    for _ in range(STUDENTS_TOTAL - 1):
        if nis_counter == 13096:
            nis_counter += 1
        while True:
            if not name_pool:
                f = random.choice(INDO_FIRST + FOREIGN_FIRST)
                l = random.choice(INDO_LAST + FOREIGN_LAST)
                full_name = f"{f} {l}"
            else:
                full_name = name_pool.pop()
            if full_name not in used_names:
                used_names.add(full_name)
                break

        year = random.choice(["X","XI","XII"])
        major = random.choice(["BD","BR","AKL1","AKL2","MP","ML","RPL"])
        students.append({
            "username": str(nis_counter),
            "name": full_name,
            "student_class": f"{year} {major}"
        })
        nis_counter += 1

    for s in students:
        db.add(models.User(
            username=s["username"],
            password=fast_hash("student123"),
            fullname=s["name"],
            role="student",
            student_class=s["student_class"],
            phone=f"0851{s['username']}"
        ))
    db.commit()

    attendance_data = []

    for s in students:
        status_choice = random.choices(
            ["Present On time", "Present Late", "Sick", "Permission", "Missing"],
            weights=[0.5, 0.2, 0.1, 0.1, 0.1],  
            k=1
        )[0]

        if status_choice != "Missing":
            time = f"{random.randint(6,7):02d}:{random.randint(0,59):02d}" 
            desc = "On time" if status_choice == "Present On time" else "Late"
            attendance_data.append({
                "username": s["username"],
                "status": status_choice.split()[0],  
                "time": time,
                "desc": desc
            })

    for a in attendance_data:
        user = db.query(models.User).filter(models.User.username==a["username"]).first()
        if user:
            db.add(models.Attendance(
                user_id=user.id,
                status=a["status"],
                explanation=a.get("desc","On time"),
                date=today_date,
                time=a["time"]
            ))

    db.query(models.Schedule).delete()
    db.commit()

    schedules = [
        {"day":"Monday","time":"06:30 - 07:15","subject":"Upacara","teacher":"Sekolah","room":"Lapangan"},
        {"day":"Monday","time":"07:15 - 09:30","subject":"Pendidikan Agama","teacher":"Nurul Asfiyah, S.Pd / Tiomsi Sitorus, S.Th","room":"Ruang Teori"},
        {"day":"Monday","time":"09:50 - 11:20","subject":"PJOK","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lapangan"},
        {"day":"Monday","time":"11:20 - 13:30","subject":"Sejarah","teacher":"Siti Sarifah, S.Pd","room":"Ruang Teori"},
        {"day":"Monday","time":"13:30 - 15:00","subject":"Mapel Pilihan","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori"},

        {"day":"Tuesday","time":"06:30 - 10:35","subject":"Konsentrasi Keahlian (KK)","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lab RPL"},
        {"day":"Tuesday","time":"10:35 - 12:05","subject":"Mapel Pilihan","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori"},
        {"day":"Tuesday","time":"12:45 - 15:00","subject":"PKK","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori"},

        {"day":"Wednesday","time":"06:30 - 07:15","subject":"BK","teacher":"Muh. Nurrahman, S.Kom","room":"Ruang Teori"},
        {"day":"Wednesday","time":"07:15 - 08:00","subject":"Bahasa Jepang","teacher":"Wuryaningrum, S.Pd","room":"Ruang Teori"},
        {"day":"Wednesday","time":"08:00 - 09:30","subject":"Bahasa Inggris","teacher":"Mega Rahmawati, S.Pd","room":"Ruang Teori"},
        {"day":"Wednesday","time":"09:50 - 15:00","subject":"Konsentrasi Keahlian (KK)","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lab RPL"},

        {"day":"Thursday","time":"06:30 - 08:45","subject":"Matematika","teacher":"Sarwadi, S.Pd","room":"Ruang Teori"},
        {"day":"Thursday","time":"08:45 - 12:05","subject":"Konsentrasi Keahlian (KK)","teacher":"Muh. Nurrohman, S.Kom","room":"Lab RPL"},
        {"day":"Thursday","time":"12:45 - 15:00","subject":"Konsentrasi Keahlian (KK)","teacher":"Mujahid Robbani Salahuddin, S.Pd","room":"Lab RPL"},

        {"day":"Friday","time":"06:30 - 07:15","subject":"Kegiatan Rutin Jumat","teacher":"Sekolah","room":"Lapangan"},
        {"day":"Friday","time":"07:15 - 08:35","subject":"Bahasa Inggris","teacher":"Mega Rahmawati, S.Pd","room":"Ruang Teori"},
        {"day":"Friday","time":"08:35 - 09:55","subject":"PKK","teacher":"Faris Naufal, S.Pd","room":"Ruang Teori"},
        {"day":"Friday","time":"10:15 - 13:40","subject":"Bahasa Indonesia","teacher":"Sudewo Pranowo, M.Pd","room":"Ruang Teori"},
        {"day":"Friday","time":"13:40 - 15:00","subject":"PP","teacher":"Habibah, S.Pd","room":"Ruang Teori"},
    ]

    for sch in schedules:
        db.add(models.Schedule(**sch))

    db.commit()
    print("✅ Seeding complete (users + merged schedule).")

    print(f"✅ Seeding complete. Total students: {len(students)}")
    print("✅ Attendance now includes On time, Late, Sick, Permission, Missing.")

except Exception as e:
    print(f"❌ Error during seeding: {e}")
    db.rollback()
finally:
    db.close()
