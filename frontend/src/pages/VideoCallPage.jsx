import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
  ControlBar,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, RoomEvent } from 'livekit-client';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Globe, Radio } from 'lucide-react';
import { useCall } from '../context/CallContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// ── Custom Controls Bar ──────────────────────────────────────────────────────
const CustomControls = ({ onEndCall }) => {
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant();

  const toggleMic = async () => {
    if (!localParticipant) return;
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const toggleCam = async () => {
    if (!localParticipant) return;
    await localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 glass rounded-2xl px-6 py-4 shadow-glass">
        {/* Mic toggle */}
        <button
          onClick={toggleMic}
          title={isMicrophoneEnabled ? 'Mute mic' : 'Unmute mic'}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
            border font-display text-sm active:scale-90
            ${isMicrophoneEnabled
              ? 'bg-surface border-border text-subtle hover:border-cyan-500/40 hover:text-cyan-400'
              : 'bg-amber-500/15 border-amber-500/50 text-amber-400'
            }
          `}
        >
          {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Camera toggle */}
        <button
          onClick={toggleCam}
          title={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
            border font-display text-sm active:scale-90
            ${isCameraEnabled
              ? 'bg-surface border-border text-subtle hover:border-cyan-500/40 hover:text-cyan-400'
              : 'bg-amber-500/15 border-amber-500/50 text-amber-400'
            }
          `}
        >
          {isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Spacer */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* End call */}
        <button
          onClick={onEndCall}
          title="End call"
          className="w-14 h-12 rounded-full flex items-center justify-center transition-all duration-200
            bg-red-500 hover:bg-red-600 text-white border border-red-400 active:scale-90 shadow-lg"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ── Custom Video Grid ────────────────────────────────────────────────────────
const CustomVideoGrid = ({ partner, onEndCall }) => {
  const room = useRoomContext();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Auto-disconnect when the user is alone in the room
  useEffect(() => {
    if (!room) return;

    const handleParticipantDisconnected = () => {
      const remoteCount = room.participants.size;
      const hasLocal = !!room.localParticipant;

      // If total participants (local + remote) drop below 2, end the call
      if (remoteCount + (hasLocal ? 1 : 0) < 2) {
        if (onEndCall) {
          onEndCall();
        } else {
          room.disconnect();
        }
      }
    };

    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    return () => {
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    };
  }, [room, onEndCall]);

  return (
    <div className="relative w-full h-full">
      {/* Partner header badge */}
      {partner && (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2 glass px-3 py-2 rounded-xl text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-body text-subtle text-xs">
            Connected with <span className="text-white font-medium">{partner.username}</span>
          </span>
          {partner.learningLanguage && (
            <span className="text-muted text-xs font-mono">· learning {partner.learningLanguage}</span>
          )}
        </div>
      )}

      {/* LiveKit Grid */}
      <GridLayout tracks={tracks} className="w-full h-full">
        <ParticipantTile />
      </GridLayout>

      {/* Audio renderer */}
      <RoomAudioRenderer />

      {/* Custom controls */}
      <CustomControls onEndCall={onEndCall} />
    </div>
  );
};

// ── Main Video Call Page ──────────────────────────────────────────────────────
const VideoCallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { livekitToken, livekitUrl, partner, endCall, callState } = useCall();
  const { user } = useAuth();

  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    // If no token (e.g., user navigated directly), redirect to dashboard
    if (!livekitToken || !livekitUrl) {
      navigate('/dashboard', { replace: true });
    } else {
      setConnecting(false);
    }
  }, [livekitToken, livekitUrl, navigate]);

  const handleEndCall = async () => {
    await endCall();
    navigate('/dashboard', { replace: true });
  };

  if (connecting || !livekitToken) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="flex gap-1.5 justify-center mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dot-1" />
            <span className="w-2 h-2 rounded-full bg-cyan-500 dot-2" />
            <span className="w-2 h-2 rounded-full bg-cyan-500 dot-3" />
          </div>
          <p className="text-muted text-sm font-mono">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-void overflow-hidden relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-16 flex items-center justify-between
        px-4 bg-gradient-to-b from-void/90 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span className="font-display font-bold text-sm text-white">
            Open<span className="text-cyan-400">Talk</span>
          </span>
          <span className="text-muted text-xs font-mono ml-2">
            Room: {roomId?.slice(0, 12)}...
          </span>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">Live</span>
          </div>
        </div>
      </div>

      {/* LiveKit Room */}
      <LiveKitRoom
        video={true}
        audio={true}
        options={{
          audioCaptureDefaults: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        }}
        token={livekitToken}
        serverUrl={livekitUrl}
        data-lk-theme="default"
        className="h-full w-full"
        style={{ '--lk-bg': '#030508' }}
        onDisconnected={handleEndCall}
        onError={(err) => {
          console.error('LiveKit error:', err);
        }}
      >
        <CustomVideoGrid partner={partner} onEndCall={handleEndCall} />
      </LiveKitRoom>
    </div>
  );
};

export default VideoCallPage;
