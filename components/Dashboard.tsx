import React from 'react';
import { Player, RsvpStatus } from '../types';
import { Users, CheckCircle, AlertCircle, TrendingUp, Shield, DollarSign, UserCheck } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  players: Player[];
}

const Dashboard: React.FC<DashboardProps> = ({ players }) => {
  const accepted = players.filter(p => p.status === RsvpStatus.ACCEPTED).length;
  const pending = players.filter(p => p.status === RsvpStatus.PENDING).length;
  const declined = players.filter(p => p.status === RsvpStatus.DECLINED || p.status === RsvpStatus.NO_REPLY).length;

  // Stats
  const regulars = players.filter(p => p.role === 'Regular');
  const subs = players.filter(p => p.role === 'Sub');
  const paidCount = players.filter(p => p.feesPaid).length;
  const totalDue = players.length; // Assuming everyone pays

  const data = [
    { name: 'In', value: accepted, color: '#16a34a' },
    { name: 'Pending', value: pending, color: '#eab308' },
    { name: 'Out', value: declined, color: '#dc2626' },
  ].filter(d => d.value > 0);

  // Goalies
  const goalies = players.filter(p => p.position === 'Goalie');
  const goaliesIn = goalies.filter(p => p.status === RsvpStatus.ACCEPTED).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Team Dashboard</h2>
        <p className="text-slate-500">Overview of your squad, financials, and upcoming game.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Roster</p>
            <p className="text-2xl font-bold text-slate-900">{players.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Confirmed Skaters</p>
            <p className="text-2xl font-bold text-slate-900">{accepted}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Fees Collected</p>
            <p className="text-2xl font-bold text-slate-900">
                {Math.round((paidCount / (totalDue || 1)) * 100)}%
                <span className="text-xs text-slate-400 font-normal ml-2">({paidCount}/{totalDue})</span>
            </p>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-full text-purple-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Regulars vs Subs</p>
            <p className="text-2xl font-bold text-slate-900">{regulars.length} <span className="text-sm text-slate-400 font-normal">: {subs.length}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RSVP Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Attendance Breakdown</h3>
            <div className="h-64 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        No data yet
                    </div>
                )}
            </div>
            <div className="flex justify-center gap-6 mt-[-20px]">
                {data.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-sm text-slate-600">{d.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Goalie Check */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Goalie Situation</h3>
            <div className="space-y-4">
                {goalies.map(g => (
                    <div key={g.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-200 p-2 rounded-full">
                                <Shield className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">{g.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Skill: {g.skillLevel}</span>
                                    {g.role === 'Sub' && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded">Sub</span>}
                                </div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            g.status === RsvpStatus.ACCEPTED ? 'bg-green-100 text-green-700' :
                            g.status === RsvpStatus.DECLINED ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {g.status}
                        </span>
                    </div>
                ))}
                {goalies.length === 0 && <p className="text-slate-400 text-sm">No goalies in roster.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;