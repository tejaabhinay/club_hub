import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { format } from 'date-fns';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const EventCard = ({ event, onRegister, isSuperAdmin }) => {
  const { user } = useContext(AuthContext);
  const [localRegistered, setLocalRegistered] = useState(false);
  const isRegisteredResult = localRegistered || event.registeredStudents?.includes(user?._id);
  const dateObj = new Date(event.date);

  const handleRegister = async () => {
    if (!user) {
        toast.error('Please login to register');
        return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(`http://localhost:5000/api/events/${event._id}/register`, {}, config);
      
      setLocalRegistered(true); // Instant UI feedback
      toast.success('Success! You are on the list 🎟️', {
          style: {
              background: '#333',
              color: '#fff',
          },
          iconTheme: {
              primary: '#4ade80',
              secondary: '#FFFAEE',
          },
      });
      onRegister(); // Refresh list background update
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative flex flex-col md:flex-row bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl max-w-2xl w-full mx-auto group"
    >
      {/* Left side: Date Ticket Stub */}
      <div className="md:w-32 bg-gradient-to-br from-indigo-600 to-purple-700 p-4 flex flex-col items-center justify-center text-white relative md:border-r-2 border-dashed border-gray-800">
         <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#0f172a] rounded-full"></div>
         <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#0f172a] rounded-full hidden md:block"></div>
         
         <span className="text-3xl font-bold">{format(dateObj, 'dd')}</span>
         <span className="text-sm uppercase tracking-widest font-semibold">{format(dateObj, 'MMM')}</span>
         <span className="text-xs opacity-75 mt-1">{format(dateObj, 'yyyy')}</span>
      </div>

      {/* Right side: Event Details */}
      <div className="flex-1 p-6 flex flex-col justify-between relative">
        {/* Decorative Barcode Line */}
        <div className="absolute top-0 right-0 h-full w-2 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAeCAYAAACp9+6NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB9JREFUeNpi/P//PwMIMDICYSAJBAy4AWYIuwIEGACAaw3+9h83EwAAAABJRU5ErkJggg==')] opacity-10"></div>

        <div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                    <span>📍</span> {event.venue}
                </div>
                <div className="flex items-center gap-1">
                    <span>⏰</span> {format(dateObj, 'hh:mm a')}
                </div>
                {/* Delete Icon for SuperAdmin (Placeholder Logic) */}
                {isSuperAdmin && (
                   <button className="text-red-400 hover:text-red-300 ml-auto" title="Delete Event">
                       🗑️
                   </button>
                )}
            </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
             <div className="text-xs text-gray-500 font-mono">
                 ID: #{event._id.slice(-6).toUpperCase()}
             </div>
             {isRegisteredResult ? (
                 <button disabled className="bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-2 rounded-lg text-sm font-bold cursor-not-allowed">
                     ✓ Registered
                 </button>
             ) : (
                 <button 
                    onClick={handleRegister}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg text-sm font-bold transition-transform active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                 >
                     Get Ticket
                 </button>
             )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
