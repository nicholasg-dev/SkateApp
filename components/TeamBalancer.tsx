import React, { useState } from 'react';
import { Player, RsvpStatus, GeneratedTeam } from '../types';
import { balanceTeams } from '../services/geminiService';
import { Shuffle, User, Shield, Lock } from 'lucide-react';

interface TeamBalancerProps {
  players: Player[];
  isAdmin: boolean;
}

const TeamBalancer: React.FC<TeamBalancerProps> = ({ players, isAdmin }) => {
  const [teams, setTeams] = useState<{white: string[], dark: string[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const acceptedPlayers = players.filter(p => p.status === RsvpStatus.ACCEPTED);

  // Security Check
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 animate-fade-in">
        <div className="p-4 bg-slate-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-600">Access Denied</h2>
        <p>You need administrator privileges to access Team Balancer.</p>
      </div>
    );
  }

  const handleBalance = async () => {
    if (acceptedPlayers.length < 2) {
        alert("Need at least 2 accepted players to balance teams!");
        return;
    }
    setIsLoading(true);
    const result = await balanceTeams(acceptedPlayers);
    setTeams(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Team Balancer</h2>
        <p className="text-slate-600">
            Currently <span className="font-bold text-green-600">{acceptedPlayers.length}</span> players confirmed.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <button
            onClick={handleBalance}
            disabled={isLoading || acceptedPlayers.length < 2}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
            <Shuffle className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'AI is Balancing...' : 'Generate Balanced Teams'}
        </button>
      </div>

      {teams && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
            {/* Team White */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-slate-200">
                <div className="bg-slate-50 p-4 text-center border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-700">Team White</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{teams.white.length} Players</p>
                </div>
                <div className="p-4">
                    <ul className="space-y-2">
                        {teams.white.map((name, i) => (
                            <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">{i+1}</span>
                                <span className="font-medium text-slate-800">{name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Team Dark */}
            <div className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden border-t-4 border-slate-700">
                <div className="bg-slate-800 p-4 text-center border-b border-slate-700">
                    <h3 className="text-xl font-bold text-white">Team Dark</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{teams.dark.length} Players</p>
                </div>
                <div className="p-4">
                    <ul className="space-y-2">
                        {teams.dark.map((name, i) => (
                            <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800">
                                <span className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">{i+1}</span>
                                <span className="font-medium text-white">{name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      )}
      
      {!teams && acceptedPlayers.length > 0 && (
          <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">Press the button above to let AI create fair teams based on skill levels.</p>
          </div>
      )}
    </div>
  );
};

export default TeamBalancer;