import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Room from '../models/Room.js';
import { generateLiveKitToken } from '../config/livekitService.js';

// ── POST /api/match/start ─────────────────────────────────────────────────────
// User clicks "Start Talking" — set isSearching=true and look for a partner
export const startSearching = async (req, res) => {
  try {
    const userId = req.user._id;

    // If already in a call, reject
    if (req.user.isInCall) {
      return res.status(400).json({
        success: false,
        message: 'You are already in a call.',
      });
    }

    // Find another user who is searching (not the current user)
    const partner = await User.findOne({
      isSearching: true,
      _id: { $ne: userId },
      isInCall: false,
    });

    if (partner) {
      // ── MATCH FOUND ──────────────────────────────────────────────────────
      const roomId = `room_${uuidv4()}`;

      // Generate LiveKit tokens for both users (video + audio enabled)
      const [tokenA, tokenB] = await Promise.all([
        generateLiveKitToken(roomId, req.user.username),
        generateLiveKitToken(roomId, partner.username),
      ]);

      // Create Room document
      const room = await Room.create({
        roomId,
        participants: [
          { userId: userId, username: req.user.username },
          { userId: partner._id, username: partner.username },
        ],
        status: 'active',
        startedAt: new Date(),
      });

      // Update both users: stop searching, mark in-call
      await Promise.all([
        User.findByIdAndUpdate(userId, {
          isSearching: false,
          isInCall: true,
          currentRoomId: roomId,
          $inc: { totalCalls: 1 },
        }),
        User.findByIdAndUpdate(partner._id, {
          isSearching: false,
          isInCall: true,
          currentRoomId: roomId,
          $inc: { totalCalls: 1 },
        }),
      ]);

      return res.status(200).json({
        success: true,
        matched: true,
        roomId,
        livekitUrl: process.env.LIVEKIT_HOST,
        token: tokenA,
        partner: {
          username: partner.username,
          nativeLanguage: partner.nativeLanguage,
          learningLanguage: partner.learningLanguage,
        },
      });
    } else {
      // ── NO MATCH YET — start waiting ─────────────────────────────────────
      await User.findByIdAndUpdate(userId, { isSearching: true });

      return res.status(200).json({
        success: true,
        matched: false,
        message: 'Searching for a partner... Please poll again.',
      });
    }
  } catch (error) {
    console.error('Start Search Error:', error);
    res.status(500).json({ success: false, message: 'Server error during matchmaking.' });
  }
};

// ── GET /api/match/status ─────────────────────────────────────────────────────
// Frontend polls this every 2s while waiting — checks if a match was found
export const checkMatchStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isInCall && user.currentRoomId) {
      // A match was found (likely initiated by the OTHER user)
      const token = await generateLiveKitToken(user.currentRoomId, user.username);

      // Get room details
      const room = await Room.findOne({ roomId: user.currentRoomId });
      const partnerData = room?.participants.find(
        (p) => p.userId.toString() !== req.user._id.toString()
      );

      let partner = null;
      if (partnerData) {
        partner = await User.findById(partnerData.userId).select(
          'username nativeLanguage learningLanguage'
        );
      }

      return res.status(200).json({
        success: true,
        matched: true,
        roomId: user.currentRoomId,
        livekitUrl: process.env.LIVEKIT_HOST,
        token,
        partner: partner
          ? {
              username: partner.username,
              nativeLanguage: partner.nativeLanguage,
              learningLanguage: partner.learningLanguage,
            }
          : null,
      });
    }

    // Still searching
    return res.status(200).json({
      success: true,
      matched: false,
      isSearching: user.isSearching,
      message: user.isSearching ? 'Still searching...' : 'Not searching.',
    });
  } catch (error) {
    console.error('Check Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── POST /api/match/stop ──────────────────────────────────────────────────────
// User cancels search or ends the call
export const stopSearchingOrEndCall = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // If in a call, end the room
    if (user.currentRoomId) {
      const room = await Room.findOne({ roomId: user.currentRoomId });
      if (room && room.status === 'active') {
        room.endRoom();
        await room.save();

        // Update the partner as well
        const partnerParticipant = room.participants.find(
          (p) => p.userId.toString() !== user._id.toString()
        );
        if (partnerParticipant) {
          await User.findByIdAndUpdate(partnerParticipant.userId, {
            isInCall: false,
            isSearching: false,
            currentRoomId: null,
          });
        }
      }
    }

    // Reset current user
    await User.findByIdAndUpdate(user._id, {
      isSearching: false,
      isInCall: false,
      currentRoomId: null,
    });

    res.status(200).json({
      success: true,
      message: 'Disconnected successfully.',
    });
  } catch (error) {
    console.error('Stop Search Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
