import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clubId: '',
    date: ''
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Fetch clubs to populate dropdown
  const { data: clubs } = useFetch('http://localhost:5000/api/clubs');
  // Fetch events to list them
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        setEvents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post('http://localhost:5000/api/events', formData, config);
      setEvents([...events, data]);
      setFormData({ title: '', description: '', clubId: '', date: '' });
      toast.success('Event Created Successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error creating event');
    }
  };

  const generateQR = async (eventId) => {
    try {
      const url = await QRCode.toDataURL(eventId);
      setQrCodeUrl(url);
      setSelectedEventId(eventId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Create Event Form */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 bg-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-secondary sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 bg-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-secondary sm:text-sm"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Club</label>
              <select
                name="clubId"
                value={formData.clubId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 bg-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-secondary sm:text-sm"
                required
              >
                <option value="">Select a Club</option>
                {clubs && clubs.map(club => (
                  <option key={club._id} value={club._id}>{club.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Date</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-0 bg-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-secondary sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
            >
              Create Event
            </button>
          </form>
        </div>

        {/* Event List & QR Generator */}
         <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Existing Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-400">No events found.</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {events.map(event => (
                <div key={event._id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => generateQR(event._id)}
                    className="bg-accent/20 text-accent hover:bg-accent/30 text-sm font-bold py-1 px-3 rounded transition"
                  >
                    Generate QR
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* QR Code Display */}
          {qrCodeUrl && selectedEventId && (
            <div className="mt-8 text-center p-4 bg-white rounded-lg">
              <h3 className="text-gray-900 font-bold mb-2">QR Code for Selected Event</h3>
              <img src={qrCodeUrl} alt="Event QR Code" className="mx-auto" />
              <p className="text-xs text-gray-500 mt-2">Scan this to mark attendance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
