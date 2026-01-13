import { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const ChatRoom = ({ clubId }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('join_room', clubId);

    socketRef.current.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [clubId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageData = {
      clubId,
      senderId: user._id, 
      senderName: user.name,
      content: newMessage,
    };

    await socketRef.current.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 h-[500px] flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Club Chat</h3>
      
      <div className="flex-grow overflow-y-auto mb-4 space-y-3 custom-scrollbar">
        {messages.map((msg, index) => {
          const isMyMessage = msg.senderId === user?._id;
          return (
            <div
              key={index}
              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  isMyMessage
                    ? 'bg-secondary text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                {!isMyMessage && (
                  <p className="text-xs text-secondary font-bold mb-1">{msg.senderName}</p>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow rounded-md border-0 bg-white/10 py-2 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-secondary sm:text-sm"
        />
        <button
          type="submit"
          className="bg-secondary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
