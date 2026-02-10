import React, { useState } from 'react';
import { Player, RsvpStatus } from '../types';
import { Plus, Trash2, Eye, EyeOff, Shield, User, CircleDot, Link as LinkIcon, Check, DollarSign, Briefcase } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  isAdmin: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, setPlayers, isAdmin }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showEmails, setShowEmails] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    email: '',
    skillLevel: 5,
    position: 'Forward',
    role: 'Regular',
    feesPaid: false,
    notes: ''
  });

  const handleAddPlayer = () => {
    if (!newPlayer.name || !newPlayer.email) return;
    
    const player: Player = {
      id: crypto.randomUUID(),
      name: newPlayer.name,
      email: newPlayer.email,
      skillLevel: newPlayer.skillLevel || 5,
      position: newPlayer.position as 'Forward' | 'Defense' | 'Goalie',
      role: newPlayer.role as 'Regular' | 'Sub',
      feesPaid: newPlayer.feesPaid || false,
      status: RsvpStatus.PENDING,
      notes: newPlayer.notes
    };

    setPlayers([...players, player]);
    setIsAdding(false);
    setNewPlayer({ name: '', email: '', skillLevel: 5, position: 'Forward', role: 'Regular', feesPaid: false, notes: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this player?')) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const updatePlayerField = (id: string, field: keyof Player, value: any) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const getPositionIcon = (pos: string) => {
    switch(pos) {
        case 'Goalie': return <Shield className="w-4 h-4 text-yellow-600" />;
        case 'Defense': return <CircleDot className="w-4 h-4 text-blue-600" />;
        default: return <User className="w-4 h-4 text-green-600" />;
    }
  };

  const maskEmail = (email: string) => {
    if (isAdmin && showEmails) return email;
    if (!email.includes('@')) return '******';
    const [user, domain] = email.split('@');
    const visiblePart = user.length > 2 ? user.substring(0, 2) : user.substring(0, 1);
    return `${visiblePart}****@${domain}`;
  };

  const copyRegistrationLink = () => {
    const url = `${window.location.origin}/#/register`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Team Roster</h2>
            <p className="text-slate-500 text-sm">Manage regulars, spares, and league fees.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyRegistrationLink}
            className="text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
            title="Copy Public Registration Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
            {copiedLink ? 'Copied!' : 'Copy Signup Link'}
          </button>
          
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Player
            </button>
          )}
        </div>
      </div>

      {isAdding && isAdmin && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
          <h3 className="font-semibold mb-4">New Player Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Name" 
              className="border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newPlayer.name}
              onChange={e => setNewPlayer({...newPlayer, name: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newPlayer.email}
              onChange={e => setNewPlayer({...newPlayer, email: e.target.value})}
            />
             <select 
              className="border border-slate-300 rounded-md p-2"
              value={newPlayer.position}
              onChange={e => setNewPlayer({...newPlayer, position: e.target.value as any})}
            >
              <option value="Forward">Forward</option>
              <option value="Defense">Defense</option>
              <option value="Goalie">Goalie</option>
            </select>
            <select 
              className="border border-slate-300 rounded-md p-2"
              value={newPlayer.role}
              onChange={e => setNewPlayer({...newPlayer, role: e.target.value as any})}
            >
              <option value="Regular">Regular</option>
              <option value="Sub">Sub / Spare</option>
            </select>
            
            <div className="flex items-center gap-2 border border-slate-300 rounded-md p-2 bg-slate-50">
               <input 
                  type="checkbox" 
                  checked={newPlayer.feesPaid}
                  onChange={e => setNewPlayer({...newPlayer, feesPaid: e.target.checked})}
                  className="w-4 h-4 text-blue-600"
                  id="newPaid"
               />
               <label htmlFor="newPaid" className="text-sm text-slate-700">League Fees Paid</label>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 w-24">Skill: {newPlayer.skillLevel}</span>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  className="w-full"
                  value={newPlayer.skillLevel}
                  onChange={e => setNewPlayer({...newPlayer, skillLevel: parseInt(e.target.value)})}
                />
            </div>
            <textarea 
              placeholder="Admin Notes (Optional)" 
              className="border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-3"
              rows={2}
              value={newPlayer.notes || ''}
              onChange={e => setNewPlayer({...newPlayer, notes: e.target.value})}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-500 hover:text-slate-700 px-4 py-2"
            >
                Cancel
            </button>
            <button 
                onClick={handleAddPlayer}
                className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800"
            >
                Save Player
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Player</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                        Email
                        {isAdmin && (
                          <button onClick={() => setShowEmails(!showEmails)} className="text-slate-400 hover:text-blue-600" title={showEmails ? "Hide Emails" : "Show Emails to Edit"}>
                              {showEmails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                    </div>
                </th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Position</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill</th>
                {isAdmin && <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fees</th>}
                {isAdmin && <th className="text-right p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {players.map(player => (
                <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                      {isAdmin ? (
                        <input 
                          type="text" 
                          value={player.name}
                          onChange={(e) => updatePlayerField(player.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1 py-0.5 transition-colors"
                        />
                      ) : (
                        player.name
                      )}
                    </td>
                    <td className="p-4 text-slate-500 text-sm font-mono">
                      {isAdmin && showEmails ? (
                        <input 
                          type="email" 
                          value={player.email}
                          onChange={(e) => updatePlayerField(player.id, 'email', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1 py-0.5 transition-colors"
                        />
                      ) : (
                        maskEmail(player.email)
                      )}
                    </td>
                    <td className="p-4">
                        {isAdmin ? (
                            <select
                                value={player.role}
                                onChange={(e) => updatePlayerField(player.id, 'role', e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded p-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="Regular">Regular</option>
                                <option value="Sub">Sub</option>
                            </select>
                        ) : (
                            <span className={`text-xs px-2 py-1 rounded-full ${player.role === 'Regular' ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                                {player.role}
                            </span>
                        )}
                    </td>
                    <td className="p-4">
                      {isAdmin ? (
                        <select
                          value={player.position}
                          onChange={(e) => updatePlayerField(player.id, 'position', e.target.value)}
                          className="bg-white border border-slate-200 text-slate-700 text-sm rounded p-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="Forward">Forward</option>
                          <option value="Defense">Defense</option>
                          <option value="Goalie">Goalie</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          {getPositionIcon(player.position)}
                          {player.position}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                        {isAdmin ? (
                             <input
                                type="number"
                                min="1"
                                max="10"
                                value={player.skillLevel}
                                onChange={(e) => updatePlayerField(player.id, 'skillLevel', parseInt(e.target.value))}
                                className="w-14 border border-slate-200 rounded p-1.5 text-sm text-center outline-none focus:ring-2 focus:ring-blue-100"
                             />
                        ) : (
                          <div className="flex items-center gap-1">
                              <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                      <div 
                                          key={i} 
                                          className={`w-1.5 h-1.5 rounded-full ${i < (player.skillLevel / 2) ? 'bg-blue-500' : 'bg-slate-200'}`} 
                                      />
                                  ))}
                              </div>
                              <span className="text-xs text-slate-400 ml-2">{player.skillLevel}/10</span>
                          </div>
                        )}
                    </td>
                    {isAdmin && (
                        <td className="p-4">
                            <button
                                onClick={() => updatePlayerField(player.id, 'feesPaid', !player.feesPaid)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                                    player.feesPaid ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-50 text-red-500 hover:bg-red-100'
                                }`}
                                title="Toggle Payment Status"
                            >
                                <DollarSign className="w-3 h-3" />
                                {player.feesPaid ? 'PAID' : 'DUE'}
                            </button>
                        </td>
                    )}
                    {isAdmin && (
                      <td className="p-4 text-right">
                      <button 
                          onClick={() => handleDelete(player.id)}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove Player"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                      </td>
                    )}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;