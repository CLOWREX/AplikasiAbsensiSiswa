import React from "react";

export default function NotFound(){
  return (
    <div style={{paddingTop:86,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 86px)"}}>
      <div className="card" style={{textAlign:"center"}}>
        <h1 style={{margin:0}}>404</h1>
        <p>Halaman tidak ditemukan</p>
      </div>
    </div>
  );
}
