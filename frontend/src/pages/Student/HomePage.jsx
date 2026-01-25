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
            // Navigate di parent setelah modal hilang
            window.location.href = "/history"; // atau useNavigate di sini
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
