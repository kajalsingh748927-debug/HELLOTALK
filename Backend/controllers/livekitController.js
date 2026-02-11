import { generateLiveKitToken } from '../config/livekitService.js';

// ── POST /api/livekit/token ───────────────────────────────────────────────────
// Get a fresh LiveKit token for a specific room (used when rejoining)
export const getToken = async (req, res) => {
  try {
    const { roomId } = req.body;
    const username = req.user.username;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'roomId is required.',
      });
    }

    // Verify user belongs to this room
    if (req.user.currentRoomId !== roomId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to join this room.',
      });
    }

    const token = await generateLiveKitToken(roomId, username);

    res.status(200).json({
      success: true,
      token,
      livekitUrl: process.env.LIVEKIT_HOST,
      roomId,
    });
  } catch (error) {
    console.error('GetToken Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate LiveKit token.' });
  }
};
