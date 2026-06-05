import React, { useState } from 'react';
import { Search, Phone, Video, Info, Send } from 'lucide-react';

const INITIAL_CONVERSATIONS = [
  { id: 1, name: "Sarah Smith", role: "Parent (Alice Freeman)", lastMsg: "That's wonderful news! Th...", time: "10:42 AM" },
  { id: 2, name: "Michael Johnson", role: "Parent", lastMsg: "Can we schedule a meeting...", time: "09:15 AM" },
  { id: 3, name: "David Martinez", role: "Student", lastMsg: "I have submitted my assign...", time: "Yesterday" },
  { id: 4, name: "Emma Chen", role: "Student", lastMsg: "Thank you for the feedback...", time: "Yesterday" },
  { id: 5, name: "Priya Patel", role: "Student", lastMsg: "Sir, could you please expla...", time: "Mon" },
];

const TeacherMessages = () => {
  const [selectedChat, setSelectedChat] = useState(INITIAL_CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = useState('');
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Good morning Mrs. Smith! I wanted to give you a quick update on Alice's performance in class lately.", sender: "teacher" },
    { id: 2, text: "Good morning Mr. Fox! Oh, I'd love to hear about it. How is she doing?", sender: "parent" },
    { id: 3, text: "She is doing fantastically. She just scored a 92% on her mid-term physics exam!", sender: "teacher" }
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: "teacher"
    };
    
    setChatHistory([...chatHistory, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="flex h-screen bg-gray-50 p-6">
      {/* Sidebar */}
      <div className="w-1/3 bg-white rounded-l-3xl border-r p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Messages</h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input className="w-full pl-10 p-3 border rounded-xl" placeholder="Search messages..." />
        </div>
        
        <div className="space-y-3">
          {INITIAL_CONVERSATIONS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              className={`p-4 rounded-2xl cursor-pointer transition ${selectedChat.id === chat.id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between font-bold text-gray-900 mb-1">
                {chat.name} 
                <span className="text-xs font-normal text-gray-400">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{chat.lastMsg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 bg-white rounded-r-3xl flex flex-col shadow-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">{selectedChat.name}</h2>
            <p className="text-sm text-gray-500">{selectedChat.role}</p>
          </div>
          
          <div className="flex gap-6 text-gray-400 relative">
            {/* Phone Icon with Call Menu */}
            <Phone 
              size={22} 
              className="cursor-pointer hover:text-indigo-600" 
              onClick={() => setShowCallMenu(!showCallMenu)} 
            />
            
            {showCallMenu && (
              <div className="absolute right-16 top-10 bg-white border shadow-xl rounded-xl p-2 w-32 z-50">
                <button 
                  className="block w-full text-left p-2 hover:bg-gray-50 rounded"
                  onClick={() => { alert('Starting Voice Call...'); setShowCallMenu(false); }}
                >
                  Voice Call
                </button>
                <button 
                  className="block w-full text-left p-2 hover:bg-gray-50 rounded"
                  onClick={() => { alert('Starting Video Call...'); setShowCallMenu(false); }}
                >
                  Video Call
                </button>
              </div>
            )}

            <Video size={22} className="cursor-pointer hover:text-indigo-600" /> 
            <Info size={22} className="cursor-pointer hover:text-indigo-600" />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          {chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-2xl max-w-md ${
                msg.sender === 'teacher' 
                ? 'bg-indigo-600 text-white ml-auto' 
                : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t flex gap-4">
          <input 
            className="flex-1 p-4 border rounded-xl" 
            placeholder="Type a message..." 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;