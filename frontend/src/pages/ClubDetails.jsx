import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import useFetch from '../hooks/useFetch';
import AuthContext from '../context/AuthContext';
import ChatRoom from '../components/ChatRoom';
import EventList from '../components/EventList';
import CreateEventModal from '../components/CreateEventModal';
import { motion } from 'framer-motion';

const ClubDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [refreshEvents, setRefreshEvents] = useState(false);
  const { data: club, loading, error } = useFetch(`http://localhost:5000/api/clubs/${id}`);

  if (loading) return (
      <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
      </div>
  );
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!club) return <div className="text-white text-center mt-10">Club not found</div>;

  const isMember = user && (
    user.role === 'superadmin' ||
    club.members?.includes(user._id) || 
    club.head?._id === user._id || 
    club.coordinators?.some(c => c._id === user._id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section with Recruitment Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          {/* Recruitment Badge */}
          <div className="absolute top-0 right-0 p-4 sm:p-6 z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(0,0,0,0.5)] border backdrop-blur-md ${
                club.isRecruiting
                  ? 'bg-green-500/10 text-green-400 border-green-500/50 shadow-green-500/20'
                  : 'bg-red-500/10 text-red-500 border-red-500/50 shadow-red-500/20'
              }`}
            >
              {club.isRecruiting ? '🚀 WE ARE HIRING' : '🔒 MEMBERSHIP CLOSED'}
            </motion.div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4 pr-32">
            {club.name}
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl leading-relaxed">{club.description}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hierarchy & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Leadership Hierarchy Section */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-widest text-cyan-400/80">Leadership Structure</h2>
            
            <div className="flex flex-col items-center">
              {/* HEAD (Tier 1) */}
              <div className="relative z-10 flex flex-col items-center group">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-transform duration-500 group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border-2 border-gray-800">
                     {club.head?.profilePic ? (
                        <img src={club.head.profilePic} alt={club.head.name} className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-3xl font-bold text-white">{club.head?.name?.[0]}</span>
                     )}
                  </div>
                </div>
                <div className="mt-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider relative z-20">
                  Club Commander
                </div>
                <p className="text-xl font-bold text-white mt-2">{club.head?.name}</p>
              </div>

              {/* Connecting Line (Vertical Stem) */}
              <div className="w-0.5 h-16 bg-gradient-to-b from-orange-500 to-gray-700 my-2 shadow-[0_0_10px_rgba(255,165,0,0.5)]"></div>
              
              {/* Coordinators / Hierarchy Grid */}
              <div className="w-full relative">
                  {/* Horizontal Bar for Tree visual if multiple items */}
                  {club.hierarchy && club.hierarchy.length > 1 && (
                      <div className="absolute top-0 left-10 right-10 h-0.5 bg-gray-700 hidden sm:block"></div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full pt-4">
                      {club.hierarchy && club.hierarchy.map((member, index) => (
                          <motion.div 
                            key={index}
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center relative"
                          >
                              {/* Vertical connector from bar */}
                              <div className="absolute -top-4 w-0.5 h-4 bg-gray-700 hidden sm:block"></div>
                              
                              <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 p-4 rounded-xl flex flex-col items-center hover:bg-gray-800 transition w-full shadow-lg group">
                                  <div className="w-16 h-16 rounded-full bg-gray-700 mb-3 flex items-center justify-center overflow-hidden border border-gray-600 group-hover:border-cyan-400 transition-colors">
                                       {member.userRef?.profilePic ? (
                                          <img src={member.userRef.profilePic} alt={member.userRef.name} className="w-full h-full object-cover" />
                                       ) : (
                                          <span className="text-xl font-bold text-gray-300">{member.userRef?.name?.[0]}</span>
                                       )}
                                  </div>
                                  <p className="text-white font-medium text-sm text-center line-clamp-1">{member.userRef?.name}</p>
                                  <p className="text-cyan-400 text-[10px] font-bold uppercase mt-1 tracking-wider">{member.roleName}</p>
                              </div>
                          </motion.div>
                      ))}
                      
                      {/* Show Default Coordinators if no hierarchy defined yet (Backward Compatibility) */}
                      {(!club.hierarchy || club.hierarchy.length === 0) && club.coordinators?.map((coord) => (
                          <div key={coord._id} className="flex flex-col items-center relative">
                               <div className="absolute -top-4 w-0.5 h-4 bg-gray-700 hidden sm:block"></div>
                               <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl flex flex-col items-center w-full">
                                   <div className="w-16 h-16 rounded-full bg-gray-700 mb-3 flex items-center justify-center text-white font-bold text-xl border border-gray-600">
                                       {coord.name?.[0]}
                                   </div>
                                   <p className="text-white font-medium text-sm">{coord.name}</p>
                                   <p className="text-blue-400 text-[10px] font-bold uppercase mt-1">Coordinator</p>
                               </div>
                          </div>
                      ))}
                  </div>
                  
                  {(!club.hierarchy?.length && !club.coordinators?.length) && (
                      <p className="text-gray-500 text-center text-sm italic">No additional leadership members listed.</p>
                  )}
              </div>
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Club Achievements
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {club.achievements?.length > 0 ? (
                club.achievements.map((ach, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300 bg-white/5 p-4 rounded-lg border border-white/5 hover:border-yellow-500/30 transition-colors">
                    <span className="text-yellow-500 text-lg">•</span> {ach}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No achievements listed yet.</li>
              )}
            </ul>
          </motion.div>
        </div>

        {/* Right Column: Chat Room or Join CTA */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-8"
        >
            {isMember ? (
                <div className="sticky top-8 space-y-4">
                    {user?.role === 'superadmin' && (
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-center text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
                             👁️ Super Head Access • Spectator Mode
                        </div>
                    )}
                    {user?.role !== 'superadmin' && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-center font-bold text-sm mb-4">
                            ✅ You are a member
                        </div>
                    )}
                    <ChatRoom clubId={id} />
                </div>
            ) : (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-center sticky top-8 shadow-2xl">
                    <div className="text-6xl mb-6">👾</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Join the Squad</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">Connect with fellow members, access exclusive events, and participate in the live chat.</p>
                    {club.isRecruiting ? (
                         <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                            <span>Apply Now</span> <span>🚀</span>
                        </button>
                    ) : (
                        <button disabled className="w-full bg-gray-700 text-gray-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed border border-gray-600">
                            Applications Closed 🔒
                        </button>
                    )}
                </div>
            )}
        </motion.div>
      </div>
      
      {/* Upcoming Events Section (Full Width below grid) */}
      <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">
            🎟️ Upcoming Events
          </h2>
          <EventList clubId={id} refreshTrigger={refreshEvents} />
      </div>

     {/* Create Event Modal Trigger for Head/SuperAdmin */}
     {(user?.role === 'superadmin' || user?._id === club.head?._id) && (
        <CreateEventModal clubId={id} onEventCreated={() => setRefreshEvents(prev => !prev)} />
     )}
    </div>
  );
};

export default ClubDetails;
