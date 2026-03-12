import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { Bell, UserPlus, Shield, Check, X, Loader2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface FriendRequest {
  _id: string;
  sender: User;
}

interface Team {
  _id: string;
  name: string;
}

interface TeamInvitation {
  _id: string;
  team: Team;
  invitedBy: User;
}

// ── Avatar from initials ──────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const hue = (name?.charCodeAt(0) ?? 65) * 5 % 360;
  return (
    <div
      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white shadow-inner"
      style={{ background: `hsl(${hue}, 55%, 35%)` }}
    >
      {name?.slice(0, 2).toUpperCase() ?? "??"}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────
function Empty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
        <Bell className="w-6 h-6 text-gray-600" />
      </div>
      <p className="text-gray-400 font-medium">All caught up</p>
      <p className="text-gray-600 text-sm mt-1">No new notifications</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
const Notifications = () => {
  const { friendRequests, setFriendRequests, setTeamInvites, teamInvites,setCurrentTeam } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [frRes, tiRes] = await Promise.all([
          fetch("http://localhost:5000/incoming-request", { credentials: "include" }),
          fetch("http://localhost:5000/pending-teaminvites", { credentials: "include" }),
        ]);
        const [frData, tiData]: [FriendRequest[], TeamInvitation[]] = await Promise.all([
          frRes.json(),
          tiRes.json(),
        ]);
        setFriendRequests(frData);
        setTeamInvites(tiData);
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const acceptFriend = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch(`http://localhost:5000/accept/${id}`, { method: "POST", credentials: "include" });
      setFriendRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Can't accept friend request", err);
    } finally {
      setActionLoading(null);
    }
  };

  const rejectFriend = async (id: string) => {
    setActionLoading(id + "-reject");
    try {
      await fetch(`http://localhost:5000/reject/${id}`, { method: "POST", credentials: "include" });
      setFriendRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Can't reject friend request", err);
    } finally {
      setActionLoading(null);
    }
  };

  const acceptTeamInvite = async (id: string, teamId: string) => {
    setActionLoading(id);
    try {
      await fetch(`http://localhost:5000/team-invite/accept/${id}`, { credentials: "include" });
      socket.emit("join-team", teamId);
      setTeamInvites((prev) => prev.filter((i) => i._id !== id));
      setCurrentTeam(teamId);
      navigate("/mainpage/teams");
    } catch (err) {
      console.error("Can't accept invite", err);
    } finally {
      setActionLoading(null);
    }
  };

  const total = friendRequests.length + teamInvites.length;

  return (
    <div
      className="w-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 h-screen"
      style={{
        background: "linear-gradient(160deg, #0f1117 0%, #131720 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-400" />
          <h2 className="font-bold text-gray-100">Notifications</h2>
        </div>
        {total > 0 && (
          <span className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5 font-semibold">
            {total} new
          </span>
        )}
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : total === 0 ? (
          <Empty />
        ) : (
          <div className="p-3 space-y-1">
            {/* ── Friend Requests ── */}
            {friendRequests.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-2 py-2 flex items-center gap-1.5">
                  <UserPlus className="w-3 h-3 text-emerald-500/70" /> Friend Requests
                </p>
                <div className="space-y-1">
                  {friendRequests.map((req) => (
                    <div
                      key={req._id}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-700 transition-all group"
                    >
                      <Avatar name={req.sender.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 font-semibold truncate">{req.sender.name}</p>
                        <p className="text-xs text-gray-500">wants to be your friend</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => acceptFriend(req._id)}
                          disabled={!!actionLoading}
                          className="w-8 h-8 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/20 flex items-center justify-center transition-colors disabled:opacity-40"
                          title="Accept"
                        >
                          {actionLoading === req._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => rejectFriend(req._id)}
                          disabled={!!actionLoading}
                          className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 flex items-center justify-center transition-colors disabled:opacity-40"
                          title="Reject"
                        >
                          {actionLoading === req._id + "-reject" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Team Invitations ── */}
            {teamInvites.length > 0 && (
              <div className={friendRequests.length > 0 ? "mt-3" : ""}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-2 py-2 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-violet-500/70" /> Team Invitations
                </p>
                <div className="space-y-1">
                  {teamInvites.map((invite) => (
                    <div
                      key={invite._id}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-700 transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/20 flex-shrink-0 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 font-semibold truncate">{invite.team.name}</p>
                        <p className="text-xs text-gray-500 truncate">invited by {invite.invitedBy.name}</p>
                      </div>
                      <button
                        onClick={() => acceptTeamInvite(invite._id, invite.team._id)}
                        disabled={!!actionLoading}
                        className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/20 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                      >
                        {actionLoading === invite._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;