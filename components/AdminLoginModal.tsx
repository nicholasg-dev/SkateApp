import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
        setPassword('');
        setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'puck') {
      onLogin();
      onClose();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Admin Access</h2>
          <p className="text-center text-slate-500 mb-6 text-sm">Enter your password to manage the roster.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                }}
                placeholder="Password"
                className={`w-full border ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'} rounded-lg p-3 outline-none focus:ring-4 transition-all`}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Incorrect password</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100 text-xs text-slate-400">
            Authorized personnel only.
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;