import React, { useState } from 'react';
import { Player, SessionConfig, RsvpStatus } from '../types';
import { generateInviteEmail } from '../services/aiService';
import { Send, RefreshCw, Wand2, CheckCircle, XCircle, Clock, Lock, Mail, Loader2, Search } from 'lucide-react';

interface SessionManagerProps {
  players: Player[];
  updatePlayerStatus: (playerId: string, status: RsvpStatus) => void;
  resetAllStatuses: () => void;
  finalizeNoReplies: () => void;
  isAdmin: boolean;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  players,
  updatePlayerStatus,
  resetAllStatuses,
  finalizeNoReplies,
  isAdmin
}) => {
  const [config, setConfig] = useState<SessionConfig>({
    date: '2024-11-25',
    time: '20:00',
    location: 'Skating Edge Arena',
    maxPlayers: 20,
    maxGoalies: 2,
    inviteMessage: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [invitesSent, setInvitesSent] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  // Selection State
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(() => players.map(p => p.id));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(id)
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => setSelectedPlayerIds(players.map(p => p.id));
  const handleUnselectAll = () => setSelectedPlayerIds([]);

  // Security Check
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 animate-fade-in">
        <div className="p-4 bg-slate-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-600">Access Denied</h2>
        <p>You need administrator privileges to manage sessions.</p>
      </div>
    );
  }

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    const message = await generateInviteEmail(config);
    setConfig(prev => ({ ...prev, inviteMessage: message }));
    setIsGenerating(false);
  };

  const handleSendInvites = async () => {
    if (!config.inviteMessage) {
      alert('Please generate or write an invite message first.');
      return;
    }

    // Prompt admin for their secret to authorize bulk email sending
    const adminSecret = prompt('Enter admin secret to authorize sending emails:');
    if (!adminSecret) return;

    setIsSendingEmails(true);
    setSendResult(null);

    if (selectedPlayerIds.length === 0) {
      alert('Please select at least one player to invite.');
      setIsSendingEmails(false);
      return;
    }

    const recipients = players
      .filter(p => selectedPlayerIds.includes(p.id))
      .map((p) => ({ email: p.email, name: p.name }));

    try {
      const res = await fetch('/.netlify/functions/send-weekly-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: adminSecret,
          sessionDate: config.date,
          sessionTime: config.time,
          location: config.location,
          maxPlayers: config.maxPlayers,
          maxGoalies: config.maxGoalies,
          inviteMessage: config.inviteMessage,
          recipients,
        }),
      });

      const data = await res.json();

      if (res.ok || res.status === 207) {
        resetAllStatuses();
        setInvitesSent(true);
        const msg = data.errors?.length
          ? `⚠️ Sent ${data.totalSent}/${data.totalRecipients} emails (some failed)`
          : `✅ Successfully sent to ${data.totalSent} players!`;
        setSendResult({ success: !data.errors?.length, message: msg });
      } else if (res.status === 403) {
        setSendResult({ success: false, message: '❌ Invalid admin secret. Emails not sent.' });
      } else {
        setSendResult({ success: false, message: `❌ Failed: ${data.error || 'Unknown error'}` });
      }
    } catch (err) {
      console.error('Send failed:', err);
      setSendResult({ success: false, message: '❌ Network error. Could not reach the server.' });
    } finally {
      setIsSendingEmails(false);
    }
  };

  const pendingCount = players.filter(p => p.status === RsvpStatus.PENDING).length;
  const acceptedCount = players.filter(p => p.status === RsvpStatus.ACCEPTED).length;
  const declinedCount = players.filter(p => p.status === RsvpStatus.DECLINED || p.status === RsvpStatus.NO_REPLY).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Session Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
                value={config.date}
                onChange={e => setConfig({ ...config, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
              <input
                type="time"
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
                value={config.time}
                onChange={e => setConfig({ ...config, time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
                value={config.location}
                onChange={e => setConfig({ ...config, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Max Players</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
                value={config.maxPlayers}
                onChange={e => setConfig({ ...config, maxPlayers: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Max Goalies</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
                value={config.maxGoalies}
                onChange={e => setConfig({ ...config, maxGoalies: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              AI Invite Generator
            </h2>
            <button
              onClick={handleGenerateEmail}
              disabled={isGenerating}
              className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-100 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? 'Drafting...' : 'Generate New Draft'}
            </button>
          </div>
          <textarea
            className="w-full h-48 border border-slate-300 rounded-md p-3 text-sm font-mono bg-slate-50 focus:bg-white transition-colors focus:ring-2 focus:ring-purple-500 outline-none"
            value={config.inviteMessage}
            onChange={e => setConfig({ ...config, inviteMessage: e.target.value })}
            placeholder="Click generate to create a hype email using AI..."
          />
          <div className="mt-4 space-y-3">
            <button
              onClick={handleSendInvites}
              disabled={isSendingEmails || selectedPlayerIds.length === 0}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {isSendingEmails ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending to {selectedPlayerIds.length} players...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Bulk Invites ({selectedPlayerIds.length} players)
                </>
              )}
            </button>
            {sendResult && (
              <div className={`p-3 rounded-lg text-sm font-medium ${sendResult.success
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                {sendResult.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RSVP Management Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">RSVP Tracker</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
              <div className="text-xs text-green-700 font-medium uppercase tracking-wide">In</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-yellow-700 font-medium uppercase tracking-wide">Pending</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
              <div className="text-2xl font-bold text-red-600">{declinedCount}</div>
              <div className="text-xs text-red-700 font-medium uppercase tracking-wide">Out</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search players by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow hover:shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Actions (Simulation) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={selectedPlayerIds.length === players.length && players.length > 0}
                  onChange={(e) => e.target.checked ? handleSelectAll() : handleUnselectAll()}
                />
                <h3 className="font-semibold text-sm text-slate-600">Select All</h3>
              </div>
              <button
                onClick={finalizeNoReplies}
                className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
              >
                Mark Unreplied as Declined
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
              {filteredPlayers.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">
                  No players found matching "{searchTerm}"
                </div>
              ) : (
                filteredPlayers.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedPlayerIds.includes(player.id)}
                        onChange={() => toggleSelection(player.id)}
                      />
                      <div>
                        <div className="font-medium text-sm text-slate-900">{player.name}</div>
                        <div className={`text-xs font-semibold ${player.status === RsvpStatus.ACCEPTED ? 'text-green-600' :
                          player.status === RsvpStatus.DECLINED ? 'text-red-600' :
                            player.status === RsvpStatus.NO_REPLY ? 'text-slate-400' :
                              'text-yellow-600'
                          }`}>{player.status.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => updatePlayerStatus(player.id, RsvpStatus.ACCEPTED)}
                        className={`p-1.5 rounded-md transition-colors ${player.status === RsvpStatus.ACCEPTED ? 'bg-green-100 text-green-600' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                        title="Mark Accepted"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updatePlayerStatus(player.id, RsvpStatus.DECLINED)}
                        className={`p-1.5 rounded-md transition-colors ${player.status === RsvpStatus.DECLINED ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                        title="Mark Declined"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updatePlayerStatus(player.id, RsvpStatus.PENDING)}
                        className={`p-1.5 rounded-md transition-colors ${player.status === RsvpStatus.PENDING ? 'bg-yellow-100 text-yellow-600' : 'text-slate-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                        title="Reset to Pending"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;