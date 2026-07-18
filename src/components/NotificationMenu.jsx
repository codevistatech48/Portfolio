import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_URL from "../Config/api";
import { toast } from "react-toastify";

const formatTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Just now" : date.toLocaleString();
};

export default function NotificationMenu({ endpoint = "/api/auth/notifications", readAllEndpoint = "/api/auth/notifications/read-all" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return undefined;

    const socket = io(API_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("notification:new", (notification) => {
      setNotifications((current) => {
        const notificationId = notification.id || notification._id;
        if (notificationId && current.some((item) => (item.id || item._id) === notificationId)) {
          return current;
        }

        return [notification, ...current];
      });

      const title = notification.title || "New notification";
      const message = notification.message || notification.body || "You have a new update.";
      toast.info(`${title}: ${message}`);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!response.ok || !isMounted) return;

        const data = await response.json();
        const items = data.notifications || data.data || data;
        if (Array.isArray(items)) setNotifications(items);
      } catch {
        // Notifications are optional until the backend endpoint is available.
      }
    };

    loadNotifications();
    const pollingTimer = window.setInterval(loadNotifications, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(pollingTimer);
    };
  }, [endpoint]);

  const hasUnread = notifications.some((notification) => !notification.read && !notification.isRead);

  const markAllRead = async () => {
    const token = localStorage.getItem("userToken");

    // Update immediately so a slow or unavailable backend cannot keep the menu open.
    setNotifications((current) => current.map((notification) => ({
      ...notification,
      read: true,
      isRead: true,
    })));

    if (!token) return;

    try {
      await fetch(`${API_URL}${readAllEndpoint}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
    } catch {
      // Keep the optimistic local state when the read endpoint is unavailable.
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button type="button" aria-label="Notifications" aria-expanded={isOpen} aria-haspopup="menu" onClick={() => setIsOpen((open) => !open)} className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:border-violet-400/30 hover:bg-white/10 hover:text-white">
        <Bell size={18} />
        {hasUnread && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border border-[#080b18] bg-red-500" />}
      </button>

      {isOpen && <div role="menu" className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#151B30] shadow-2xl"><div className="flex items-center justify-between border-b border-white/10 px-4 py-4"><div><h2 className="font-semibold">Notifications</h2><p className="mt-1 text-xs text-slate-400">{hasUnread ? "You have unread updates" : "You are all caught up"}</p></div>{hasUnread && <button type="button" onClick={markAllRead} className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition hover:text-white"><CheckCheck size={15} />Mark all read</button>}</div>{notifications.length ? <div className="max-h-96 overflow-y-auto">{notifications.map((notification, index) => <article key={notification.id || notification._id || `${notification.title}-${index}`} className={`border-b border-white/5 px-4 py-4 last:border-0 ${!notification.read && !notification.isRead ? "bg-violet-500/5" : ""}`}><div className="flex gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!notification.read && !notification.isRead ? "bg-red-500" : "bg-slate-600"}`} /><div><p className="text-sm font-semibold text-slate-100">{notification.title || "New update"}</p><p className="mt-1 text-sm leading-5 text-slate-400">{notification.message || notification.body || "You have a new notification."}</p><p className="mt-2 text-xs text-slate-500">{formatTime(notification.createdAt || notification.date)}</p></div></div></article>)}</div> : <div className="px-6 py-10 text-center"><Inbox className="mx-auto text-slate-500" size={28} /><p className="mt-3 text-sm font-medium text-slate-300">No notifications yet</p><p className="mt-1 text-xs leading-5 text-slate-500">Updates about your requests will appear here.</p></div>}</div>}
    </div>
  );
}
