import React, { useState, useEffect } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import { CheckCircle, XCircle, Activity, Loader2, AlertTriangle, Calendar, MapPin, Users } from 'lucide-react';

interface PlayerInfo {
    id: string;
    name: string;
    email: string;
    position: string;
    status: string;
}

type RsvpState = 'loading' | 'ready' | 'submitting' | 'success' | 'error' | 'not-found' | 'already-responded';

const RsvpPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const sessionDate = searchParams.get('date') || '';
    const sessionTime = searchParams.get('time') || '';
    const location = searchParams.get('location') || '';

    const [player, setPlayer] = useState<PlayerInfo | null>(null);
    const [state, setState] = useState<RsvpState>('loading');
    const [chosenStatus, setChosenStatus] = useState<'ACCEPTED' | 'DECLINED' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Format date nicely
    const formattedDate = (() => {
        try {
            if (!sessionDate) return '';
            const d = new Date(sessionDate + 'T00:00:00');
            return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return sessionDate;
        }
    })();

    // Format time nicely
    const formattedTime = (() => {
        try {
            if (!sessionTime) return '';
            const [h, m] = sessionTime.split(':');
            const hour = parseInt(h, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            return `${display}:${m} ${ampm}`;
        } catch {
            return sessionTime;
        }
    })();

    // Load player info on mount
    useEffect(() => {
        if (!email) {
            setState('error');
            setErrorMessage('No email address found in the link. Please check your invite email.');
            return;
        }

        const fetchPlayer = async () => {
            try {
                const res = await fetch(`/.netlify/functions/rsvp-response?email=${encodeURIComponent(email)}`);
                if (res.ok) {
                    const data = await res.json();
                    setPlayer(data);
                    // If they already responded, show that state
                    if (data.status === 'ACCEPTED' || data.status === 'DECLINED') {
                        setChosenStatus(data.status);
                        setState('already-responded');
                    } else {
                        setState('ready');
                    }
                } else if (res.status === 404) {
                    setState('not-found');
                } else {
                    setState('error');
                    setErrorMessage('Something went wrong. Please try again later.');
                }
            } catch (err) {
                console.error('Failed to fetch player info:', err);
                setState('error');
                setErrorMessage('Could not connect to the server. Please check your connection.');
            }
        };

        fetchPlayer();
    }, [email]);

    const handleRsvp = async (status: 'ACCEPTED' | 'DECLINED') => {
        setState('submitting');
        setChosenStatus(status);

        try {
            const res = await fetch('/.netlify/functions/rsvp-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, status }),
            });

            if (res.ok) {
                setState('success');
            } else {
                const data = await res.json();
                setState('error');
                setErrorMessage(data.error || 'Failed to submit response.');
            }
        } catch (err) {
            console.error('RSVP submit failed:', err);
            setState('error');
            setErrorMessage('Network error. Please try again.');
        }
    };

    const handleChangeResponse = () => {
        setState('ready');
        setChosenStatus(null);
    };

    // ──────────────── Render States ────────────────

    // Loading
    if (state === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Loading your invite...</p>
                </div>
            </div>
        );
    }

    // Not found
    if (state === 'not-found') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Player Not Found</h2>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        We couldn't find <span className="text-slate-200 font-medium">{email}</span> on the roster.
                        If you think this is a mistake, contact the organizer.
                    </p>
                    <NavLink
                        to="/register"
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
                    >
                        Join the Roster
                    </NavLink>
                </div>
            </div>
        );
    }

    // Error
    if (state === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Oops!</h2>
                    <p className="text-slate-400 mb-6">{errorMessage}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Success / Already Responded
    if (state === 'success' || state === 'already-responded') {
        const isAccepted = chosenStatus === 'ACCEPTED';
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Activity className="text-blue-400 w-7 h-7" />
                            <span className="text-xl font-bold text-white tracking-wider">SkateApp</span>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Status Banner */}
                        <div className={`p-8 text-center ${isAccepted
                            ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30'
                            : 'bg-gradient-to-r from-red-600/30 to-orange-600/30'
                            }`}>
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isAccepted ? 'bg-emerald-500/30' : 'bg-red-500/30'
                                }`}
                                style={{
                                    animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                }}
                            >
                                {isAccepted
                                    ? <CheckCircle className="w-10 h-10 text-emerald-400" />
                                    : <XCircle className="w-10 h-10 text-red-400" />
                                }
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {state === 'already-responded' ? 'Already Responded' : 'Response Recorded!'}
                            </h2>
                            <p className="text-slate-300 text-lg">
                                {player?.name ? (
                                    <>
                                        <span className="font-semibold">{player.name}</span>
                                        {isAccepted ? ' — You\'re in! 🎉' : ' — Maybe next time! 👋'}
                                    </>
                                ) : (
                                    isAccepted ? 'You\'re in! See you on the ice! 🎉' : 'Maybe next time! 👋'
                                )}
                            </p>
                        </div>

                        {/* Session Info */}
                        {(formattedDate || formattedTime || location) && (
                            <div className="px-8 py-6 border-t border-white/5">
                                <div className="space-y-3">
                                    {formattedDate && (
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                            <span className="text-sm">{formattedDate}</span>
                                        </div>
                                    )}
                                    {formattedTime && (
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <span className="text-blue-400 text-sm flex-shrink-0">🕐</span>
                                            <span className="text-sm">{formattedTime}</span>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                            <span className="text-sm">{location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Change Response */}
                        <div className="px-8 py-6 border-t border-white/5 text-center">
                            <button
                                onClick={handleChangeResponse}
                                className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                            >
                                Change my response
                            </button>
                        </div>
                    </div>
                </div>

                <style>{`
          @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
            </div>
        );
    }

    // ──────────────── Ready / Submitting — Main RSVP UI ────────────────

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="text-blue-400 w-7 h-7" />
                        <span className="text-xl font-bold text-white tracking-wider">SkateApp</span>
                    </div>
                    <p className="text-slate-500 text-sm">Drop-in Hockey Manager</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    {/* Title Section */}
                    <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 p-8 text-center border-b border-white/5">
                        <h1 className="text-3xl font-bold text-white mb-2">🏒 You're Invited!</h1>
                        <p className="text-slate-300 text-sm">
                            Hey <span className="font-semibold text-white">{player?.name || 'there'}</span>, are you skating this week?
                        </p>
                    </div>

                    {/* Session Details */}
                    {(formattedDate || formattedTime || location) && (
                        <div className="px-8 py-6 border-b border-white/5">
                            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Session Details</h3>
                            <div className="space-y-4">
                                {formattedDate && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{formattedDate}</div>
                                            <div className="text-slate-500 text-xs">Date</div>
                                        </div>
                                    </div>
                                )}
                                {formattedTime && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">🕐</span>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{formattedTime}</div>
                                            <div className="text-slate-500 text-xs">Puck Drop</div>
                                        </div>
                                    </div>
                                )}
                                {location && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{location}</div>
                                            <div className="text-slate-500 text-xs">Location</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* RSVP Buttons */}
                    <div className="p-8">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-6 text-center">Your Response</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleRsvp('ACCEPTED')}
                                disabled={state === 'submitting'}
                                className="group relative bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-emerald-800 disabled:to-emerald-900 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {state === 'submitting' && chosenStatus === 'ACCEPTED' ? (
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <CheckCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                        <span className="text-lg">I'm In!</span>
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={() => handleRsvp('DECLINED')}
                                disabled={state === 'submitting'}
                                className="group relative bg-gradient-to-br from-slate-600 to-slate-700 hover:from-red-600 hover:to-red-700 disabled:from-slate-800 disabled:to-slate-900 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {state === 'submitting' && chosenStatus === 'DECLINED' ? (
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <XCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                        <span className="text-lg">Can't Make It</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    Responding as <span className="text-slate-400">{email}</span>
                </p>
            </div>
        </div>
    );
};

export default RsvpPage;
