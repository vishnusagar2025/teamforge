import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import { useNotifications } from "../hooks/useNotifications";
import { teamService } from "../services/teamService";
import { Bell, Check, CheckCheck, UserPlus, X, Users } from "lucide-react";
import toast from "react-hot-toast";

const TYPE_STYLES = {
  team_invite:  { border: "border-l-4 border-purple-500", icon: "👥", label: "Team Invite" },
  join_request: { border: "border-l-4 border-cyan-500",   icon: "🙋", label: "Join Request" },
  match:        { border: "border-l-4 border-green-500",  icon: "✨", label: "Match"        },
  info:         { border: "border-l-4 border-slate-600",  icon: "ℹ️", label: "Info"          },
};

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead, refresh } = useNotifications();
  const [acting, setActing] = useState({}); // track loading per notification

  // Parse member_id from notification message or reference fields
  const getMemberId = (n) => n.sender_id || n.reference_user_id || null;

  const handleAccept = async (n) => {
    const teamId = n.reference_id;
    const memberId = getMemberId(n);
    if (!teamId || !memberId) {
      toast.error("Could not find team or member info");
      return;
    }
    setActing(a => ({ ...a, [n.id]: "accepting" }));
    try {
      await teamService.acceptMember(teamId, memberId);
      await markRead(n.id);
      toast.success("Member accepted! 🎉");
      if (refresh) refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to accept");
    } finally {
      setActing(a => ({ ...a, [n.id]: null }));
    }
  };

  const handleReject = async (n) => {
    setActing(a => ({ ...a, [n.id]: "rejecting" }));
    try {
      await markRead(n.id);
      toast.success("Request declined");
    } finally {
      setActing(a => ({ ...a, [n.id]: null }));
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={20} />
            Notifications
            {unreadCount > 0 && (
              <span style={{
                minWidth: 22, height: 22, borderRadius: 99, background: "var(--accent)",
                color: "#fff", fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px"
              }}>{unreadCount}</span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn btn-secondary" style={{ height: 34, fontSize: 12, gap: 6 }}>
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Empty state */}
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Bell size={40} style={{ color: "var(--text3)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--text3)" }}>No notifications yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map(n => {
              const style = TYPE_STYLES[n.type] || TYPE_STYLES.info;
              const isJoinRequest = n.type === "join_request";
              const isActing = acting[n.id];

              return (
                <div key={n.id} className="card" style={{
                  padding: "14px 16px",
                  borderLeft: `4px solid ${
                    n.type === "team_invite"  ? "#a855f7" :
                    n.type === "join_request" ? "#06b6d4" :
                    n.type === "match"        ? "#22c55e" : "#475569"
                  }`,
                  background: !n.is_read ? "rgba(91,91,214,0.06)" : "var(--surface)",
                  transition: "all 0.2s"
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 14 }}>{style.icon}</span>
                        {n.title && (
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</span>
                        )}
                        {!n.is_read && (
                          <span style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: "var(--accent)", flexShrink: 0
                          }} />
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6, lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text3)" }}>
                        {new Date(n.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>

                      {/* ── Accept / Reject buttons for join requests ── */}
                      {isJoinRequest && !n.is_read && (
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button
                            onClick={() => handleAccept(n)}
                            disabled={!!isActing}
                            className="btn btn-primary"
                            style={{ height: 32, fontSize: 12, gap: 6, flex: 1 }}
                          >
                            <UserPlus size={13} />
                            {isActing === "accepting" ? "Accepting..." : "Accept"}
                          </button>
                          <button
                            onClick={() => handleReject(n)}
                            disabled={!!isActing}
                            className="btn btn-secondary"
                            style={{ height: 32, fontSize: 12, gap: 6, flex: 1 }}
                          >
                            <X size={13} />
                            {isActing === "rejecting" ? "Declining..." : "Decline"}
                          </button>
                        </div>
                      )}

                      {/* Show "View Team" link for team_invite */}
                      {n.type === "team_invite" && n.reference_id && (
                        <a
                          href={`/teams/${n.reference_id}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            marginTop: 10, fontSize: 12, color: "var(--accent)",
                            textDecoration: "none", fontWeight: 500
                          }}
                        >
                          <Users size={12} /> View Team →
                        </a>
                      )}
                    </div>

                    {/* Mark read button */}
                    {!n.is_read && !isJoinRequest && (
                      <button
                        onClick={() => markRead(n.id)}
                        style={{
                          flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
                          background: "rgba(91,91,214,0.15)", border: "none",
                          color: "var(--accent)", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >
                        <Check size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
