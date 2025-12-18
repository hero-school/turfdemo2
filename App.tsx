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

  // Global text color
  const textColorClass = 'text-white';

  // --- Handlers ---
  const handleOnboardingComplete = () => setHasOnboarded(true);

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    if (tab === 'events') {
      setActiveRoom(null);
      setActiveDM(null);
      setActiveSquad(null);
      setSelectedPost(null);
    } else if (tab === 'chat') {
      setSelectedEvent(null);
      setSelectedAttendee(null);
      setSelectedPost(null);
    } else if (tab === 'canvas') {
      setSelectedEvent(null);
      setActiveRoom(null);
      setActiveDM(null);
      setActiveSquad(null);
    }
  };

  const handleSelectEvent = (event: EventData) => setSelectedEvent(event);
  const handleBackToEvents = () => setSelectedEvent(null);
  const handleConnect = (attendee: Attendee) => setSelectedAttendee(attendee);
  const handleCloseConnect = () => setSelectedAttendee(null);
  const handleSendRequest = () => {
    setSelectedAttendee(null);
    alert("Signal Sent! Check the Chat Hub.");
  };
  const handleJoinRoomFromEvent = () => setActiveRoom(selectedEvent);
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
    alert(`Squad "${name}" Initialized. Check Signal Tab.`);
  };
  const handleOpenRoomFromChat = (event: EventData) => setActiveRoom(event);
  const handleOpenDM = (dm: DirectMessageSummary) => setActiveDM(dm);
  const handleOpenSquad = (squad: Squad) => setActiveSquad(squad);
  const handleCloseRoom = () => setActiveRoom(null);
  const handleCloseDM = () => setActiveDM(null);
  const handleCloseSquad = () => setActiveSquad(null);
  const handleSelectPost = (post: GalleryPost) => setSelectedPost(post);
  const handleClosePost = () => setSelectedPost(null);

  // --- Render ---
  return (
    <div className={`relative h-screen w-full flex flex-col overflow-hidden turf-gradient-bg ${textColorClass}`}>
      {!hasOnboarded ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
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

            {/* --- GLOBAL OVERLAYS --- */}
            {activeRoom && (
              <div className="absolute inset-0 z-30 bg-turfBlack">
                <EventRoomScreen event={activeRoom} mode={mode} onBack={handleCloseRoom} />
              </div>
            )}
            {activeSquad && (
              <div className="absolute inset-0 z-30 bg-turfBlack">
                <SquadChatScreen squad={activeSquad} onBack={handleCloseSquad} />
              </div>
            )}
            {activeDM && (
              <div className="absolute inset-0 z-30 bg-turfBlack">
                <DirectMessageScreen dm={activeDM} mode={mode} onBack={handleCloseDM} />
              </div>
            )}
            {selectedPost && (
              <div className="absolute inset-0 z-30 bg-turfBlack">
                <CanvasDetailScreen post={selectedPost} mode={mode} onBack={handleClosePost} />
              </div>
            )}
            {selectedAttendee && selectedEvent && (
              <ConnectModal
                attendee={selectedAttendee}
                event={selectedEvent}
                onClose={handleCloseConnect}
                onSend={handleSendRequest}
              />
            )}
          </main>

          <NavBar currentTab={currentTab} onTabChange={handleTabChange} mode={mode} />
        </>
      )}
    </div>
  );
}
