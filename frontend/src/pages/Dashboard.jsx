import { useNavigate } from 'react-router-dom';
import { Radio, Globe, Zap, Phone, X, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCall } from '../context/CallContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const { callState, error, startSearch, endCall } = useCall();
  const navigate = useNavigate();

  const isSearching = callState === 'searching';

  const handleMatchClick = async () => {
    if (isSearching) {
      await endCall();
    } else {
      await startSearch(navigate);
    }
  };

  return (
    <div className="min-h-screen bg-void text-white font-body pt-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full
          bg-cyan-500/4 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full
          bg-cyan-500/3 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-muted text-sm font-mono mb-1">— Dashboard</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl">
            Hey, <span className="text-cyan-400">{user?.username}</span> 👋
          </h1>
          <p className="text-muted mt-2">
            Ready to talk? Hit the button and we'll match you with a random learner.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Total Calls', value: user?.totalCalls || 0, icon: <Phone className="w-4 h-4" /> },
            { label: 'Speaking', value: user?.nativeLanguage || '—', icon: <Globe className="w-4 h-4" /> },
            { label: 'Learning', value: user?.learningLanguage || '—', icon: <TrendingUp className="w-4 h-4" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="glass rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 text-muted text-xs font-mono mb-2">
                <span className="text-cyan-500/60">{icon}</span>
                {label}
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Main Match Area */}
        <div className="flex flex-col items-center justify-center py-12">
          {/* The Big Match Button */}
          <div className="relative flex items-center justify-center mb-10">
            {/* Pulse rings — only visible while searching */}
            {isSearching && (
              <>
                <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20 animate-pulse-ring" />
                <div className="absolute w-64 h-64 rounded-full border border-cyan-500/15 animate-pulse-ring-2" />
                <div className="absolute w-64 h-64 rounded-full border border-cyan-500/10 animate-pulse-ring-3" />
              </>
            )}

            {/* Button */}
            <button
              onClick={handleMatchClick}
              className={`
                relative w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2
                font-display font-bold text-xl transition-all duration-300 active:scale-95
                border-2 focus:outline-none
                ${isSearching
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/15 hover:border-red-500/60'
                  : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/60 match-btn-pulse'
                }
              `}
            >
              {isSearching ? (
                <>
                  <X className="w-10 h-10 mb-1" />
                  <span className="text-base">Cancel</span>
                </>
              ) : (
                <>
                  <Zap className="w-10 h-10 mb-1" />
                  <span>Match</span>
                </>
              )}
            </button>
          </div>

          {/* Status text */}
          <div className="text-center min-h-[60px] flex flex-col items-center justify-center">
            {isSearching ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 dot-1" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 dot-2" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 dot-3" />
                  </div>
                  <span className="text-cyan-400 font-mono text-sm">Searching for a partner...</span>
                </div>
                <p className="text-muted text-xs">This usually takes less than 5 seconds</p>
              </>
            ) : (
              <>
                <p className="text-subtle text-sm mb-1">Press Match to find a random partner</p>
                <p className="text-muted text-xs font-mono">Camera + mic will start automatically</p>
              </>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Info cards at bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 border-t border-border/30 pt-10">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-sm text-white mb-2">How matching works</h3>
            <p className="text-muted text-xs leading-relaxed">
              When you press Match, our server looks for another active learner. 
              If one is found, you're both connected to a private LiveKit room instantly.
              If not, we wait up to 30 seconds before timing out.
            </p>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-sm text-white mb-2">Before you start</h3>
            <p className="text-muted text-xs leading-relaxed">
              Make sure your browser has permission to access your camera and microphone.
              Your video will be enabled automatically once a match is found.
              You can toggle them during the call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
