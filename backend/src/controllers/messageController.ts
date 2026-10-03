import { Response } from 'express';
import { db } from '../models/db';
import { Message, Conversation } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const convs = await db.conversations.find(c => c.participants.includes(req.user!.id));
    convs.sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

    res.json({ success: true, count: convs.length, conversations: convs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching conversations.' });
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const messages = await db.messages.find(m => m.conversationId === conversationId);
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching messages.' });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { recipientId, recipientName, recipientRole, text, conversationId } = req.body;

    if (!text || (!recipientId && !conversationId)) {
      res.status(400).json({ success: false, message: 'Recipient and text are required.' });
      return;
    }

    let activeConvId = conversationId;

    if (!activeConvId) {
      // Find existing or create new conversation
      const existing = await db.conversations.findOne(
        c => c.participants.includes(req.user!.id) && c.participants.includes(recipientId)
      );

      if (existing) {
        activeConvId = existing.id;
      } else {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          participants: [req.user.id, recipientId],
          participantDetails: [
            { id: req.user.id, name: req.user.name, role: req.user.role, avatar: req.user.avatar },
            { id: recipientId, name: recipientName || 'User', role: recipientRole || 'adopter' }
          ],
          lastMessage: text,
          lastMessageTimestamp: new Date().toISOString(),
          unreadCount: 1
        };
        await db.conversations.create(newConv);
        activeConvId = newConv.id;
      }
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      receiverId: recipientId || '',
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    await db.messages.create(newMsg);

    // Update conversation last message
    await db.conversations.update(activeConvId, {
      lastMessage: text,
      lastMessageTimestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: newMsg,
      conversationId: activeConvId
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error sending message.' });
  }
};
