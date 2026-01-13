import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get('http://localhost:5000/api/clubs/super-view', config);
                setClubs(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch club data');
                setLoading(false);
            }
        };

        fetchClubs();
    }, [user.token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-primary">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex justify-between items-center border-b border-gray-700 pb-4"
            >
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        COMMAND CENTER
                    </h1>
                    <p className="text-gray-400 mt-1">SuperAdmin Access Granted • System Status: Online</p>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                     <span className="text-green-400 font-mono">● Live Feed</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {clubs.map((club, index) => (
                    <motion.div
                        key={club._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-colors duration-300"
                    >
                        {/* Card Header */}
                        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{club.name}</h2>
                                <p className="text-gray-400 text-sm line-clamp-2">{club.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition">
                                    Edit
                                </button>
                                <button className="bg-red-600/20 text-red-400 hover:bg-red-600/40 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition">
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 p-6 bg-gray-900/30">
                            <div className="bg-gray-800/80 p-4 rounded-xl text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Members</p>
                                <p className="text-3xl font-mono text-cyan-400">{club.memberCount}</p>
                            </div>
                            <div className="bg-gray-800/80 p-4 rounded-xl text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Achievements</p>
                                <p className="text-3xl font-mono text-purple-400">{club.achievements?.length || 0}</p>
                            </div>
                        </div>

                        {/* Faces Section */}
                        <div className="p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Leadership Team</h3>
                            
                            <div className="space-y-4">
                                {/* Head */}
                                <div className="flex items-center gap-4 bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                                        {club.head?.name?.[0] || '?'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{club.head?.name || 'Unassigned'}</p>
                                        <p className="text-xs text-yellow-500 font-bold uppercase">Club Head</p>
                                    </div>
                                </div>

                                {/* Coordinators Scroll */}
                                {club.coordinators && club.coordinators.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                        {club.coordinators.map((coord) => (
                                            <div key={coord._id} className="flex-shrink-0 flex items-center gap-3 bg-gray-800/40 p-2 pr-4 rounded-full border border-gray-700/50">
                                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {coord.name?.[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-200">{coord.name}</span>
                                                    <span className="text-[10px] text-blue-400 font-bold uppercase">Coord</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Members Peek (Horizontal Scroll if implemented, or just count) */}
                        <div className="px-6 pb-6 pt-2">
                             <div className="text-xs text-gray-500 font-mono">ID: {club._id}</div>
                        </div>

                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
