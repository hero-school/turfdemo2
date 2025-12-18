import React, { useState } from 'react';
import { Attendee, EventData } from '../types';
import { ATTENDEES_DATA } from '../constants';

interface CreateSquadModalProps {
  event: EventData;
  onClose: () => void;
  onCreate: (name: string, members: Attendee[]) => void;
}

export const CreateSquadModal: React.FC<CreateSquadModalProps> = ({ event, onClose, onCreate }) => {
  const [squadName, setSquadName] = useState(`Squad: ${event.title.split(':')[0]}`);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleCreate = () => {
    const members = ATTENDEES_DATA.filter(a => selectedIds.has(a.id));
    onCreate(squadName, members);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-turfBlack border-2 border-turfPurple flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-turfPurple bg-turfPurple/10 flex justify-between items-center">
            <h2 className="font-thunder-sim text-3xl text-white">ASSEMBLE SQUAD</h2>
            <button onClick={onClose} className="text-white hover:text-turfRed text-3xl font-thunder-sim leading-none">×</button>
        </div>

        {/* Name Input */}
        <div className="p-4 border-b border-turfPurple/30">
            <label className="block font-barlow text-xs uppercase text-turfPurple mb-1 font-bold">Squad Name</label>
            <input 
                type="text" 
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                className="w-full bg-transparent border-b border-white text-white font-thunder-sim text-xl py-1 focus:outline-none focus:border-turfPurple"
            />
        </div>

        {/* Member Selection */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="font-barlow text-xs uppercase text-white/50 mb-2">Select Members for {event.title}</p>
            
            {ATTENDEES_DATA.map(user => {
                const isSelected = selectedIds.has(user.id);
                return (
                    <div 
                        key={user.id}
                        onClick={() => toggleSelection(user.id)}
                        className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${isSelected ? 'bg-turfPurple text-white border-turfPurple' : 'bg-transparent text-white/70 border-white/20 hover:border-white'}`}
                    >
                        <div className={`w-5 h-5 border flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-white/50'}`}>
                            {isSelected && <div className="w-3 h-3 bg-turfPurple"></div>}
                        </div>
                        <img src={user.avatar} className="w-8 h-8 grayscale object-cover" />
                        <div className="flex-1">
                            <span className="font-thunder-sim text-lg leading-none block">{user.name}</span>
                            <span className="font-barlow text-[10px] uppercase opacity-70">{user.role}</span>
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-turfPurple/30 bg-black">
            <button 
                onClick={handleCreate}
                disabled={selectedIds.size === 0}
                className={`w-full py-4 font-thunder-sim text-2xl uppercase transition-colors ${selectedIds.size > 0 ? 'bg-turfPurple text-white hover:bg-white hover:text-turfPurple' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
                INITIATE SQUAD ({selectedIds.size})
            </button>
        </div>

      </div>
    </div>
  );
};
