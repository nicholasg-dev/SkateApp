import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Player, RsvpStatus } from './types';

// Lazy-load route components for code-splitting
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const PlayerList = React.lazy(() => import('./components/PlayerList'));
const SessionManager = React.lazy(() => import('./components/SessionManager'));
const TeamBalancer = React.lazy(() => import('./components/TeamBalancer'));
const PublicRegistration = React.lazy(() => import('./components/PublicRegistration'));

// Loading fallback shown while chunks are downloading
const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <div style={{
      width: 40, height: 40,
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);



const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoaded = React.useRef(false);

  // Persistence: Load from Netlify Blobs
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/.netlify/functions/store-players');
        console.log('Store-players response:', res.status, res.headers.get('content-type'));
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            console.error('Expected JSON but got:', contentType);
            throw new Error('Non-JSON response from store-players');
          }
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setPlayers(data);
            hasLoaded.current = true;
          } else {
            // Fallback: Check local storage migration if blob is empty
            const saved = localStorage.getItem('skateapp_players_v3');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed.length > 0) {
                setPlayers(parsed);
                hasLoaded.current = true;
              }
            }
          }
        } else {
          console.error('Store-players returned:', res.status, await res.text());
        }
      } catch (error) {
        console.error('Failed to load roster from cloud:', error);
        // Fallback to local storage on error
        const saved = localStorage.getItem('skateapp_players_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            setPlayers(parsed);
            hasLoaded.current = true;
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Persistence: Save to Netlify Blobs (Debounced)
  useEffect(() => {
    // Don't save while loading or before first successful load
    if (isLoading || !hasLoaded.current) return;
    // Never save an empty array — protects against accidental wipe
    if (players.length === 0) return;

    // Save to local storage immediately for UI responsiveness
    localStorage.setItem('skateapp_players_v3', JSON.stringify(players));

    // Debounce save to cloud to prevent flooding
    const timeoutId = setTimeout(async () => {
      try {
        await fetch('/.netlify/functions/store-players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(players)
        });
        console.log('Roster saved to cloud');
      } catch (error) {
        console.error('Failed to save roster to cloud:', error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [players, isLoading]);

  const updatePlayerStatus = (playerId: string, status: RsvpStatus) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, status } : p));
  };

  const resetAllStatuses = () => {
    setPlayers(prev => prev.map(p => ({ ...p, status: RsvpStatus.PENDING })));
  };

  const finalizeNoReplies = () => {
    setPlayers(prev => prev.map(p =>
      p.status === RsvpStatus.PENDING || p.status === RsvpStatus.NO_REPLY
        ? { ...p, status: RsvpStatus.DECLINED }
        : p
    ));
  };

  const addNewPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player]);
  };

  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Registration Route (No Sidebar) */}
          <Route path="/register" element={<PublicRegistration addPlayer={addNewPlayer} />} />

          {/* Protected/Dashboard Routes (With Sidebar) */}
          <Route path="/*" element={
            <Layout isAdmin={isAdmin} setIsAdmin={setIsAdmin}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Dashboard players={players} isAdmin={isAdmin} />} />
                  <Route path="/roster" element={<PlayerList players={players} setPlayers={setPlayers} isAdmin={isAdmin} />} />
                  <Route path="/invites" element={
                    <SessionManager
                      players={players}
                      updatePlayerStatus={updatePlayerStatus}
                      resetAllStatuses={resetAllStatuses}
                      finalizeNoReplies={finalizeNoReplies}
                      isAdmin={isAdmin}
                    />
                  } />
                  <Route path="/teams" element={<TeamBalancer players={players} isAdmin={isAdmin} />} />
                  {/* Fallback for unknown routes inside dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;