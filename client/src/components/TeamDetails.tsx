import { useParams, Link } from "react-router-dom";
import type { Player, Team, Venue } from "../types";
import { MapPin, Users, MessageCircle, Shield, ChevronRight, Trophy, Swords } from "lucide-react";

interface TeamDetailsProps {
  teams: Team[];
}

export default function TeamDetails({ teams }: TeamDetailsProps) {
  const { teamId } = useParams();
  const team = teams.find((t) => t._id === teamId);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Team not found</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
            ← Back to teams
          </Link>
        </div>
      </div>
    );
  }

  const fillPercent = Math.round((team.members.length / team.maxPlayers) * 100);
  const spotsLeft = team.maxPlayers - team.members.length;

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 mt-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Top accent strip ── */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500" />

      {/* ── Hero banner ── */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 border-b border-gray-800">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-start gap-5">
            {/* icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-900/40 flex-shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <div>
              <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-1">
                Team
              </p>
              <h1 className="text-3xl font-black text-white leading-tight">{team.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-violet-400" />
                  {team.sport}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  {team.area}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  {team.members.length} / {team.maxPlayers} players
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6 items-start">
        {/* ── LEFT: main info ─────────────────────────────────────── */}
        <div className="flex-1 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Sport", value: team.sport, icon: <Swords className="w-4 h-4" /> },
              { label: "Max Players", value: team.maxPlayers, icon: <Users className="w-4 h-4" /> },
              { label: "Spots Left", value: spotsLeft, icon: <Trophy className="w-4 h-4" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center hover:border-violet-800/60 transition-colors"
              >
                <div className="flex justify-center text-violet-400 mb-2">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Roster fill bar */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-300">Roster capacity</span>
              <span className="text-sm text-gray-500">
                {team.members.length}/{team.maxPlayers}
                <span className="ml-2 text-xs text-violet-400 font-medium">{fillPercent}%</span>
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-700"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {spotsLeft > 0
                ? `${spotsLeft} spot${spotsLeft > 1 ? "s" : ""} available`
                : "Team is full"}
            </p>
          </div>

          {/* Chat CTA */}
          <Link
            to="chat"
            className="flex items-center justify-between w-full bg-gradient-to-r from-violet-700 to-fuchsia-700 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold px-6 py-4 rounded-2xl shadow-lg shadow-violet-900/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5" />
              <span>Open Team Chat</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── RIGHT: members sidebar ────────────────────────────────── */}
        <aside className="w-72 flex-shrink-0 sticky top-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            {/* header */}
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                <h2 className="font-bold text-gray-100 text-sm">Members</h2>
              </div>
              <span className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5">
                {team.members.length}
              </span>
            </div>

            {/* list */}
            <div className="divide-y divide-gray-800/60">
              {team.members.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No members yet</p>
                  <p className="text-gray-600 text-xs mt-1">Be the first to join!</p>
                </div>
              ) : (
                team.members.map((m, i) => (
                  
                  <div
                    key={m._id ?? i}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors group"
                  >
                    {/* avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          m.profileImage ??
                          "https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg"
                        }
                        alt={m.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-700 group-hover:ring-violet-600/50 transition-all"
                      />
                      {/* captain badge for first member */}
                      {i === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* name + role */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-white transition-colors">
                        {m.name}
                      </p>
                      
                    </div>

                    {/* position number */}
                    <span className="text-xs text-gray-700 font-mono group-hover:text-gray-500 transition-colors">
                      #{i + 1}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* footer */}
            {spotsLeft > 0 && (
              <div className="px-5 py-3 border-t border-gray-800 bg-gray-900/50">
                <p className="text-xs text-center text-gray-600">
                  {spotsLeft} open slot{spotsLeft > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}