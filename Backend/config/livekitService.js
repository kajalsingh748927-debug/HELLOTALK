import { AccessToken } from 'livekit-server-sdk';

/**
 * Generates a LiveKit access token for a participant joining a room.
 * Grants BOTH audio and video permissions for the video call feature.
 *
 * @param {string} roomName  - The unique room/match ID
 * @param {string} identity  - The participant's unique identifier (userId or username)
 * @returns {Promise<string>} - Signed JWT token string
 */
export const generateLiveKitToken = async (roomName, identity) => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit API Key or Secret is missing from environment variables.');
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: identity,
    // Token valid for 2 hours
    ttl: '2h',
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,        // Can send audio/video
    canSubscribe: true,      // Can receive audio/video
    canPublishData: true,    // Can send data messages
    // Explicit audio + video permissions
    audio: true,
    video: true,
  });

  const token = await at.toJwt();
  return token;
};
