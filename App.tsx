import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { Onboarding } from './screens/Onboarding';
import { EventListScreen } from './screens/EventList';
import { AttendeeListScreen } from './screens/AttendeeList';
import { ConnectModal } from './components/ConnectModal';
import { EventRoomScreen } from './screens/EventRoom';
import { ChatTab } from './screens/ChatTab';
import { CanvasTab } from './screens/CanvasTab';
import { CanvasDetailScreen } from './screens/CanvasDetail';
import { DirectMessageScreen } from './screens/DirectMessage';
import { SquadChatScreen } from './screens/SquadChat';
import { AppMode, EventData, Attendee, Tab, GalleryPost, DirectMessageSummary, Squad } from './types';

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  
  // Permanent Night Mode
  const mode: AppMode = 'night';
  
  const [currentTab, setCurrentTab] = useState<Tab>('events');
  
  // Navigation State
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [activeRoom, setActiveRoom] = useState<EventData | null>(null);
  
  // New Navigation States
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [activeDM, setActiveDM] = useState<DirectMessageSummary | null>(null);
  
  // Squad State
  const [squads, setSquads] = useState<Squad[]>([]);
  const [activeSquad, setActiveSquad] = useState<Squad | null>(null);

  // We use the gradient background globally. 
  const textColorClass = 'text-white';

  // --- Handlers ---

  const handleOnboardingComplete = () => setHasOnboarded(true);

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    // Reset drilled-down states when switching main contexts
    if (tab === 'events') {
        setActiveRoom(null);
        setActiveDM(null);
        setActiveSquad(null);
        setSelectedPost(null);
    } else if (tab === 'chat') {
        setSelectedEvent(null);
        setSelectedAttendee(null);
        setSelectedPost(null);
        // keep active rooms/squads if navigating back? for now reset for simplicity
        // setActiveRoom(null);
    } else if (tab === 'canvas') {
        setSelectedEvent(null);
        setActiveRoom(null);
        setActiveDM(null);
        setActiveSquad(null);
    }
  };

  // Event Tab Logic
  const handleSelectEvent = (event: EventData) => setSelectedEvent(event);
  const handleBackToEvents = () => setSelectedEvent(null);
  const handleConnect = (attendee: Attendee) => setSelectedAttendee(attendee);
  const handleCloseConnect = () => setSelectedAttendee(null);
  
  const handleSendRequest = () => {
    setSelectedAttendee(null);
    alert("Signal Sent! Check the Chat Hub.");
  };

  const handleJoinRoomFromEvent = () => {
    setActiveRoom(selectedEvent);
  };
  
  const handleCreateSquad = (name: string, members: Attendee[]) => {
      if (!selectedEvent) return;
      
      const newSquad: Squad = {
          id: Date.now().toString(),
          name,
          eventId: selectedEvent.id,
          eventName: selectedEvent.title,
          members,
          createdAt: new Date().toISOString()
      };
      
      setSquads([...squads, newSquad]);
      // Navigate to squad chat immediately? Or just notify? 
      // Let's notify for now, then user goes to Signal tab.
      alert(`Squad "${name}" Initialized. Check Signal Tab.`);
  };

  // Chat Tab Logic
  const handleOpenRoomFromChat = (event: EventData) => {
    setActiveRoom(event);
  };
  
  const handleOpenDM = (dm: DirectMessageSummary) => {
    setActiveDM(dm);
  };

  const handleOpenSquad = (squad: Squad) => {
    setActiveSquad(squad);
  };

  const handleCloseRoom = () => {
    setActiveRoom(null);
  };
  
  const handleCloseDM = () => {
    setActiveDM(null);
  };

  const handleCloseSquad = () => {
    setActiveSquad(null);
  };

  // Canvas Logic
  const handleSelectPost = (post: GalleryPost) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  // --- Render Logic ---

  return (
    <div className={`relative h-screen w-full flex flex-col overflow-hidden transition-colors duration-500 bg-grain turf-gradient-bg ${textColorClass}`}>
      
      {!hasOnboarded ? (
         <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          {/* Main Content Area */}
          <main className="flex-1 relative z-10 h-full w-full overflow-hidden flex flex-col">
            
            {/* --- TAB: EVENTS --- */}
            {currentTab === 'events' && !activeRoom && (
                selectedEvent ? (
                    <AttendeeListScreen 
                        event={selectedEvent} 
                        mode={mode} 
                        onBack={handleBackToEvents} 
                        onConnect={handleConnect}
                        onJoinRoom={handleJoinRoomFromEvent}
                        onCreateSquad={handleCreateSquad}
                    />
                ) : (
                    <EventListScreen mode={mode} onSelectEvent={handleSelectEvent} />
                )
            )}

            {/* --- TAB: CHAT --- */}
            {currentTab === 'chat' && !activeRoom && !activeDM && !activeSquad && (
                <ChatTab 
                    mode={mode} 
                    onOpenRoom={handleOpenRoomFromChat} 
                    onOpenDM={handleOpenDM}
                    squads={squads}
                    onOpenSquad={handleOpenSquad}
                />
            )}

            {/* --- TAB: CANVAS --- */}
            {currentTab === 'canvas' && !selectedPost && (
                <CanvasTab mode={mode} onSelectPost={handleSelectPost} />
            )}

            {/* --- GLOBAL OVERLAYS (Detail Screens) --- */}
            
            {/* Event Room */}
            {activeRoom && (
                <div className="absolute inset-0 z-30 bg-turfBlack">
                     <EventRoomScreen 
                        event={activeRoom} 
                        mode={mode} 
                        onBack={handleCloseRoom}
                    />
                </div>
            )}

            {/* Squad Chat */}
            {activeSquad && (
                <div className="absolute inset-0 z-30 bg-turfBlack">
                    <SquadChatScreen 
                        squad={activeSquad}
                        onBack={handleCloseSquad}
                    />
                </div>
            )}

            {/* Direct Message Screen */}
            {activeDM && (
                <div className="absolute inset-0 z-30 bg-turfBlack">
                    <DirectMessageScreen 
                        dm={activeDM}
                        mode={mode}
                        onBack={handleCloseDM}
                    />
                </div>
            )}

            {/* Canvas Detail Screen */}
            {selectedPost && (
                <div className="absolute inset-0 z-30 bg-turfBlack">
                    <CanvasDetailScreen 
                        post={selectedPost}
                        mode={mode}
                        onBack={handleClosePost}
                    />
                </div>
            )}

            {/* Connect Modal */}
            {selectedAttendee && selectedEvent && (
                <ConnectModal 
                    attendee={selectedAttendee} 
                    event={selectedEvent}
                    onClose={handleCloseConnect} 
                    onSend={handleSendRequest}
                />
            )}

          </main>

          {/* Bottom Navigation */}
          <NavBar 
            currentTab={currentTab} 
            onTabChange={handleTabChange} 
            mode={mode}
          />
        </>
      )}
    </div>
  );
}
