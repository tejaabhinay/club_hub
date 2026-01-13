import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateEventModal = ({ clubId, onEventCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
      title: '',
      description: '',
      date: '',
      venue: ''
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const config = {
              headers: { Authorization: `Bearer ${user.token}` }
          };
          await axios.post('http://localhost:5000/api/events', { ...formData, clubId }, config);
          toast.success('Event created successfully!');
          setFormData({ title: '', description: '', date: '', venue: '' });
          setIsOpen(false);
          onEventCreated();
      } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to create event');
      }
  };

  // Only show for Club Head or SuperAdmin (Assume parent passes access check or we check here)
  
  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(236,72,153,0.5)] z-50"
      >
        +
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1b26] border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Event Title</label>
                        <input 
                            type="text" 
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea 
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date & Time</label>
                            <input 
                                type="datetime-local" 
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Venue</label>
                            <input 
                                type="text" 
                                name="venue"
                                required
                                value={formData.venue}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button 
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-shadow"
                        >
                            Publish Event
                        </button>
                    </div>
                </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateEventModal;
