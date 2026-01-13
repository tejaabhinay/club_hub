import { Link } from 'react-router-dom';

const ClubCard = ({ club }) => {
  return (
    <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:transform hover:scale-105 transition duration-300 shadow-xl overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/40 transition"></div>
      
      <h3 className="text-xl font-bold text-white mb-2 relative z-10">{club.name}</h3>
      <p className="text-gray-400 text-sm mb-4 bg-clip-text relative z-10 line-clamp-3">
        {club.description}
      </p>
      
      <div className="mt-4 flex justify-between items-center relative z-10">
        <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
          {club.members?.length || 0} Members
        </span>
        <Link
          to={`/clubs/${club._id}`}
          className="text-secondary hover:text-white text-sm font-semibold transition"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ClubCard;
