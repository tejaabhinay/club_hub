import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import SkeletonLoader from './SkeletonLoader';

const EventList = ({ clubId, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/events/club/${clubId}`);
      // Sort by date (nearest first)
      const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sortedEvents);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [clubId, refreshTrigger]);

  if (loading) return <SkeletonLoader />;

  if (events.length === 0) {
      return (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
              <p className="text-gray-400 italic">No upcoming events scheduled.</p>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <motion.div
            key={event._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <EventCard 
                event={event} 
                onRegister={fetchEvents}
                isSuperAdmin={user?.role === 'superadmin'}
            />
        </motion.div>
      ))}
    </div>
  );
};

export default EventList;
