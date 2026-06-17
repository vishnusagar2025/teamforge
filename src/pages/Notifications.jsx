import React from "react";
import Navbar from "../components/common/Navbar";
import { useNotifications } from "../hooks/useNotifications";
import { Bell, Check, CheckCheck } from "lucide-react";

const TYPE_STYLES = {
  team_invite: "border-l-4 border-purple-500",
  join_request: "border-l-4 border-cyan-500",
  match: "border-l-4 border-green-500",
  info: "border-l-4 border-slate-600",
};

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell size={22}/> Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">{unreadCount}</span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-secondary flex items-center gap-2 text-sm">
              <CheckCheck size={16}/> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={40} className="text-slate-600 mx-auto mb-3"/>
            <p className="text-slate-400">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`card ${TYPE_STYLES[n.type] || TYPE_STYLES.info} ${!n.is_read ? "bg-[#1E1E35]" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {n.title && <p className="font-semibold text-sm">{n.title}</p>}
                    <p className="text-slate-400 text-sm mt-0.5">{n.message}</p>
                    <p className="text-slate-600 text-xs mt-2">
                      {new Date(n.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
                    </p>
                  </div>
                  {!n.is_read && (
                    <button onClick={() => markRead(n.id)}
                      className="shrink-0 w-8 h-8 rounded-full bg-purple-900/30 text-purple-400 hover:bg-purple-900/50 flex items-center justify-center transition-colors">
                      <Check size={14}/>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
