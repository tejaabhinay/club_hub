import useFetch from '../hooks/useFetch';
import ClubCard from '../components/ClubCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { motion } from 'framer-motion';

const ClubDiscovery = () => {
  const { data: clubs, loading, error } = useFetch('http://localhost:5000/api/clubs');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white mb-8"
      >
        Discover Clubs
      </motion.h2>
      
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
        </div>
      )}
      
      {error && <div className="text-red-500">Error: {error}</div>}
      
      {!loading && !error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {clubs && clubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ClubDiscovery;
