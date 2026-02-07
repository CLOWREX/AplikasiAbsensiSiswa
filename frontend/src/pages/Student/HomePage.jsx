import React, { useState } from "react";
import QRScannerModal from "./QRScannerModal";

const HomePage = () => {
  const [showScanner, setShowScanner] = useState(false);

  const openScanner = () => setShowScanner(true);
  const closeScanner = () => setShowScanner(false);

  return (
    <div className="relative">
      <button
        className="bg-[#5dbcd2] text-white p-3 rounded"
        onClick={openScanner}
      >
        Open QR Scanner
      </button>

      {showScanner && (
        <QRScannerModal
          onClose={() => {
            closeScanner();
            window.location.href = "/history"; 
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
