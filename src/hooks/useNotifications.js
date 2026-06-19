import { useState, useEffect } from "react";
import { notificationService } from "../services/teamService";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch {}
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
    const t = setInterval(fetchData, 30000);
    return () => clearInterval(t);
  }, [user]);

  const markRead = async (id) => {
    await notificationService.markRead(id);
    setNotifications(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(p => Math.max(0, p - 1));
  };

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications(p => p.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markRead, markAllRead };
}
