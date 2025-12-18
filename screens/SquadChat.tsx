import React, { useState } from 'react';
import { Squad, ChatMessage } from '../types';

interface SquadChatProps {
  squad: Squad;
  onBack: () => void;
}

export const SquadChatScreen: React.FC<SquadChatProps> = ({ squad, onBack }) => {
  // Mock initial message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: 'init',
        user: 'System',
        text: `Squad created for ${squad.eventName}. Coordinate safely.`,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isMe: false
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
        id: Date.now().toString(),
        user: 'Me',
        text: input,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isMe: true
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-grain relative">
        {/* Header */}
        <div className="p-4 border-b border-turfPurple bg-turfPurple/20 backdrop-blur-sm">
            <button onClick={onBack} className="text-xs font-barlow uppercase font-bold mb-1 opacity-70 text-white">← Back to Signal</button>
            <h1 className="font-thunder-sim text-3xl leading-none text-white truncate pr-4">
                {squad.name}
            </h1>
            
            {/* Member Avatars */}
            <div className="flex items-center gap-1 mt-2">
                {squad.members.map((m, i) => (
                    <div key={m.id} className="relative group">
                         <img src={m.avatar} className="w-6 h-6 rounded-full border border-white/30 grayscale object-cover" title={m.name} />
                    </div>
                ))}
                <div className="w-6 h-6 rounded-full border border-white/30 bg-turfWhite text-turfBlack flex items-center justify-center text-[10px] font-bold">
                    ME
                </div>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
            {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 border ${msg.isMe 
                        ? 'bg-turfPurple text-white border-turfPurple'
                        : 'bg-white/10 text-white border-white/20'
                    }`}>
                        {!msg.isMe && <span className="block text-[10px] font-bold uppercase mb-1 opacity-50">{msg.user}</span>}
                        <p className="font-barlow text-sm leading-tight">{msg.text}</p>
                    </div>
                    <span className="text-[10px] font-barlow mt-1 opacity-50 text-white">{msg.timestamp}</span>
                </div>
            ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-turfPurple/30 bg-black">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Squad comms..."
                    className="flex-1 p-3 font-barlow bg-transparent border border-turfPurple/50 focus:outline-none focus:border-turfPurple text-white placeholder-white/50"
                />
                <button type="submit" className="px-4 font-thunder-sim text-xl uppercase bg-turfPurple text-white hover:bg-white hover:text-turfPurple transition-colors">
                    SEND
                </button>
            </div>
        </form>
    </div>
  );
};
