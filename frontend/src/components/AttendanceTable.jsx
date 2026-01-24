import React, { useEffect, useState } from "react";
import { loadAbsensi } from "../data/dummyData";

export default function AttendanceTable(){
  const [list, setList] = useState([]);
  useEffect(()=>{ setList(loadAbsensi()); }, []);
  return (
    <div className="card">
      <h3 style={{margin:0}}>Riwayat Absensi</h3>
      <table className="table" style={{marginTop:12}}>
        <thead>
          <tr>
            <th>Nama</th><th>Kelas</th><th>Waktu</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.length===0 && <tr><td colSpan="4" style={{padding:12}}>Belum ada data</td></tr>}
          {list.map((r)=>(
            <tr key={r.id}>
              <td>{r.nama}</td>
              <td>{r.kelas}</td>
              <td>{new Date(r.waktu).toLocaleString()}</td>
              <td>
                <span className={
                  r.status==="Hadir"?"status-badge status-hadir":
                  r.status==="Izin"?"status-badge status-izin":"status-badge status-alpa"
                }>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
