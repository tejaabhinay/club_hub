import { useEffect, useState, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Scanner = () => {
  const { user } = useContext(AuthContext);
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onScanSuccess = async (decodedText, decodedResult) => {
      // Prevent multiple calls for the same scan in loop
      scanner.clear();
      setScanResult(decodedText);
      verifyAttendance(decodedText);
    };

    const onScanFailure = (error) => {
      // handle scan failure, usually better to ignore and keep scanning.
    };

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    
    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
      });
    };
  }, []);

  const verifyAttendance = async (eventId) => {
    const loadingToast = toast.loading('Verifying attendance...');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/events/verify-attendance',
        { eventId, userId: user._id },
        config
      );

      toast.success(data.message, { id: loadingToast });
      setMessage(`Success! ${data.message}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Verification failed', { id: loadingToast });
      setScanResult(null); // Reset to scan again if needed, or keep result to show error
      // Ideally we might want to re-init scanner or show a button to retry
    }
  };

  const resetScanner = () => {
      window.location.reload();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-6">Attendance Scanner</h1>
        
        {!scanResult ? (
          <div id="reader" className="w-full"></div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl text-white">Scan Complete</h3>
            {message && <div className="p-4 bg-green-500/20 text-green-400 rounded-lg">{message}</div>}
            
            <button 
                onClick={resetScanner}
                className="bg-secondary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
            >
                Scan Another
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Scanner;
