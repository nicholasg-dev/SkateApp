import React, { useState } from 'react';
import { Player, RsvpStatus } from '../types';
import { UserPlus, CheckCircle, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface PublicRegistrationProps {
  addPlayer: (player: Player) => void;
}

const PublicRegistration: React.FC<PublicRegistrationProps> = ({ addPlayer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: 'Forward',
    skillLevel: 5,
    role: 'Sub'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      position: formData.position as 'Forward' | 'Defense' | 'Goalie',
      skillLevel: formData.skillLevel,
      role: formData.role as 'Regular' | 'Sub',
      feesPaid: false, // Default to unpaid for new self-registrations
      status: RsvpStatus.PENDING
    };

    addPlayer(newPlayer);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SkateApp!</h2>
          <p className="text-slate-600 mb-8">You've been added to the roster. You'll receive availability requests for upcoming games.</p>
          <NavLink to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Home
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center space-x-3">
        <Activity className="text-blue-600 w-10 h-10" />
        <h1 className="text-3xl font-bold text-slate-900 tracking-wider">SkateApp</h1>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 text-center">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" />
            Join the Roster
          </h2>
          <p className="text-slate-400 text-sm mt-2">Sign up for the league or sub list</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Wayne Gretzky"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="wayne@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                <select
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
                >
                <option value="Forward">Forward</option>
                <option value="Defense">Defense</option>
                <option value="Goalie">Goalie</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Player Type</label>
                <select
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                >
                <option value="Sub">Substitute</option>
                <option value="Regular">Regular</option>
                </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700">Self-Assessed Skill Level</label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{formData.skillLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              value={formData.skillLevel}
              onChange={e => setFormData({...formData, skillLevel: parseInt(e.target.value)})}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Beginner</span>
              <span>Beer League Hero</span>
              <span>Pro</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicRegistration;