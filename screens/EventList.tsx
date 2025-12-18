import React from 'react';
import { EVENTS_DATA } from '../constants';
import { EventData } from '../types';

interface EventListProps {
  mode: 'day' | 'night';
  onSelectEvent: (event: EventData) => void;
}

export const EventListScreen: React.FC<EventListProps> = ({ mode, onSelectEvent }) => {
  const textColor = mode === 'day' ? 'text-turfBlack' : 'text-turfWhite';
  const subTextColor = mode === 'day' ? 'text-turfBlack/60' : 'text-turfWhite/80';
  // Use semi-transparent backgrounds to let gradient shine through but ensure readability
  const cardBg = mode === 'day' ? 'bg-white/90' : 'bg-black/40 backdrop-blur-md';
  const borderColor = mode === 'day' ? 'border-turfBlack' : 'border-white/20';

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-20 overflow-y-auto animate-fade-in">
      <div className="mb-8">
        <h1 className={`font-thunder-sim text-6xl leading-[0.85] ${textColor} drop-shadow-md`}>
          TURF <br/> AGENDA
        </h1>
        <p className={`font-barlow uppercase text-sm mt-2 font-bold tracking-wider ${subTextColor}`}>
          Select an event to find your squad
        </p>
      </div>

      <div className="space-y-4">
        {EVENTS_DATA.map((event) => (
          <div 
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className={`relative p-5 border-l-4 transition-all active:scale-95 cursor-pointer group ${cardBg} ${borderColor} ${mode === 'day' ? 'shadow-sm border-turfYellow hover:bg-white' : 'border-turfPurple hover:bg-black/60'}`}
          >
            <div className="flex justify-between items-start mb-2">
                <span className={`font-barlow text-xs font-bold uppercase px-2 py-0.5 border ${mode === 'day' ? 'border-turfBlack text-turfBlack' : 'border-turfWhite text-turfWhite'}`}>
                    {event.type}
                </span>
                <span className={`font-barlow font-bold ${subTextColor}`}>
                    {event.time}
                </span>
            </div>
            
            <h3 className={`font-thunder-sim text-4xl leading-none mb-4 ${textColor}`}>
                {event.title}
            </h3>

            <div className="flex items-end justify-between border-t border-dashed pt-3" style={{ borderColor: mode === 'day' ? '#00000020' : '#FFFFFF40' }}>
                <span className={`font-barlow text-sm uppercase ${subTextColor}`}>
                    {event.location}
                </span>
                
                <div className="text-right">
                    <span className={`block font-thunder-sim text-3xl leading-none ${mode === 'day' ? 'text-turfRed' : 'text-turfYellow'}`}>
                        {event.attendeeCount}
                    </span>
                    <span className="text-[10px] font-barlow uppercase tracking-widest opacity-60">Going</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};