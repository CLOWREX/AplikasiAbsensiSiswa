export const STUDENTS = [
  { id: 1, nama: "Ahmad", kelas: "10A" },
  { id: 2, nama: "Budi", kelas: "10A" },
  { id: 3, nama: "Citra", kelas: "10B" },
];

export function loadAbsensi() {
  try {
    return JSON.parse(localStorage.getItem("absensi_list")) || [];
  } catch { return []; }
}

export function saveAbsensi(list){
  localStorage.setItem("absensi_list", JSON.stringify(list));
}
