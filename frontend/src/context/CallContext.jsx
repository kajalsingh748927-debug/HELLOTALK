import { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const CallContext = createContext(null);

const api = axios.create({
  // Deploy: set VITE_API_BASE_URL=https://hellotalk-t24v.onrender.com/api
  // Dev (with proxy): this falls back to '/api'
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export const CallProvider = ({ children }) => {
  const { token } = useAuth();

  const [callState, setCallState] = useState('idle'); // 'idle' | 'searching' | 'in-call'
  const [livekitToken, setLivekitToken] = useState(null);
  const [livekitUrl, setLivekitUrl] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [partner, setPartner] = useState(null);
  const [error, setError] = useState(null);

  const pollIntervalRef = useRef(null);

  const clearPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

  const startSearch = async (navigate) => {
    setError(null);
    try {
      const res = await api.post(
        '/match/start',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.matched) {
        const { roomId, token: lkToken, livekitUrl: url, partner: partnerInfo } = res.data;
        setRoomId(roomId);
        setLivekitToken(lkToken);
        setLivekitUrl(url);
        setPartner(partnerInfo);
        setCallState('in-call');
        navigate(`/video-call/${roomId}`);
      } else {
        // Not yet matched – enter searching state and start polling
        setCallState('searching');
        let attempts = 0;

        clearPolling();
        pollIntervalRef.current = setInterval(async () => {
          attempts += 1;
          try {
            const statusRes = await api.get('/match/status', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (statusRes.data.matched) {
              const {
                roomId: statusRoomId,
                token: lkTokenStatus,
                livekitUrl: urlStatus,
                partner: partnerInfoStatus,
              } = statusRes.data;

              setRoomId(statusRoomId);
              setLivekitToken(lkTokenStatus);
              setLivekitUrl(urlStatus);
              setPartner(partnerInfoStatus);
              setCallState('in-call');
              clearPolling();
              navigate(`/video-call/${statusRoomId}`);
            } else if (attempts >= 15) {
              // ~30 seconds (2s * 15 attempts)
              setCallState('idle');
              setError('No partner found. Please try again.');
              clearPolling();
            }
          } catch (pollErr) {
            console.error('Error while polling match status:', pollErr);
            setCallState('idle');
            setError('Something went wrong while searching for a partner.');
            clearPolling();
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Error starting search:', err);
      setError(err.response?.data?.message || 'Failed to start search.');
      setCallState('idle');
    }
  };

  const endCall = async () => {
    setError(null);
    clearPolling();
    try {
      await api.post(
        '/match/stop',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Error stopping call/search:', err);
      // Keep a soft error but don't block UI reset
    } finally {
      setCallState('idle');
      setLivekitToken(null);
      setLivekitUrl(null);
      setRoomId(null);
      setPartner(null);
    }
  };

  const value = {
    callState,
    livekitToken,
    livekitUrl,
    roomId,
    partner,
    error,
    startSearch,
    endCall,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return ctx;
};

