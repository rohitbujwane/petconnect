import { Response } from 'express';
import { db } from '../models/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const notifs = await db.notifications.find(n => n.userId === req.user?.id);
    notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = notifs.filter(n => !n.read).length;

    res.json({ success: true, count: notifs.length, unreadCount, notifications: notifs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching notifications.' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db.notifications.update(id, { read: true });
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating notification.' });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const notifs = await db.notifications.find(n => n.userId === req.user?.id);
    for (const notif of notifs) {
      if (!notif.read) {
        await db.notifications.update(notif.id, { read: true });
      }
    }

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error marking notifications.' });
  }
};
