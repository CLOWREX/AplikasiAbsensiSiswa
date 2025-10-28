import React, { useState } from "react";
import QRCode from "qrcode";

export default function QRGenerator({ onNew }) {
  const [kelas, setKelas] = useState("10A");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [token, setToken] = useState(null);

  const generate = async () => {
    const t = `qr_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const payload = { token: t, kelas, expires_at: Date.now() + 1000*60*10 };
    const str = JSON.stringify(payload);
    const url = await QRCode.toDataURL(str, { width: 300 });
    setQrDataUrl(url);
    setToken(payload);
    if(onNew) onNew(payload);
  };

  return (
    <div className="card qr-card">
      <h3 style={{margin:0}}>Generate QR Harian</h3>
      <div style={{width:"100%", display:"flex", gap:8, marginTop:12}}>
        <select value={kelas} onChange={(e)=>setKelas(e.target.value)}>
          <option>10A</option>
          <option>10B</option>
          <option>11A</option>
        </select>
        <button className="primary" onClick={generate}>Generate</button>
      </div>

      {qrDataUrl && (
        <div className="qr-canvas" style={{marginTop:12}}>
          <img className="qr-big" src={qrDataUrl} alt="qr" />
        </div>
      )}

      {token && <div className="small">Token: {token.token} • Expired: {new Date(token.expires_at).toLocaleTimeString()}</div>}
    </div>
  );
}
