import { useEffect, useRef, useState } from "react";
import { MarqueeDemo } from "./MarqueeDemo";
import {
  Users,
  MapPin,
  Shield,
  Trophy,
  Zap,
  Star,
} from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

// ─────────────────────────────────────────────────────────────
// Scroll Progress
// ─────────────────────────────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full bg-indigo-500 transition-all duration-75 shadow-[0_0_8px_2px_rgba(99,102,241,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Reveal Animation
// ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        className="relative rounded-2xl border border-gray-800 bg-[#11161D] p-5 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 group"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 border"
          style={{
            background: `${color}15`,
            borderColor: `${color}30`,
            color,
          }}
        >
          {icon}
        </div>

        <p className="text-2xl font-bold text-gray-100">{value}</p>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Heading
// ─────────────────────────────────────────────────────────────
function SectionHeading({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-100 tracking-tight">
          {children}
        </h2>
        {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
      </div>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────
export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-gray-100 font-sans">
      <ScrollProgress />

      {/* ── HERO ── */}
      <div
        className="relative border-b border-gray-800"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #1E293B 0%, #0B0F14 60%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-14">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-6">
              <Zap className="w-3 h-3" /> Dashboard
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-xl">
              Find players,
              <br />
              <span className="text-indigo-400">
                build your team.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-gray-500 mt-4 max-w-md text-sm leading-relaxed">
              Connect with athletes near you, join teams, and discover the best
              venues in your area.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Users size={16} />}
              label="Players"
              value="2.4k"
              color="#6366F1"
              delay={0}
            />
            <StatCard
              icon={<Shield size={16} />}
              label="Teams"
              value="180"
              color="#6366F1"
              delay={80}
            />
            <StatCard
              icon={<MapPin size={16} />}
              label="Venues"
              value="64"
              color="#6366F1"
              delay={160}
            />
            <StatCard
              icon={<Trophy size={16} />}
              label="Matches"
              value="1.1k"
              color="#F59E0B"
              delay={240}
            />
          </div>
        </section>

        {/* Marquee */}
        <section>
          <SectionHeading sub="Recently active players in your area">
            Active Near You
          </SectionHeading>
          <Reveal delay={60}>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-[#11161D]">
              <MarqueeDemo />
            </div>
          </Reveal>
        </section>

        {/* Bento */}
        <section>
          <SectionHeading sub="Everything you need to get started">
            Explore
          </SectionHeading>

          <Reveal delay={60}>
            <BentoGrid>
              <BentoCard
                name="Players"
                className="col-span-3 md:col-span-2"
                description="Browse and connect with players near you"
                href="/mainpage/players"
                cta="Find Players"
                background={<div className="absolute inset-0 bg-indigo-900/20 rounded-xl" />}
                Icon={Users}
              />
              <BentoCard
                name="Teams"
                className="col-span-3 md:col-span-1"
                description="Join or create a team"
                href="/mainpage/teams"
                cta="Browse Teams"
                background={<div className="absolute inset-0 bg-indigo-900/20 rounded-xl" />}
                Icon={Shield}
              />
              <BentoCard
                name="Venues"
                className="col-span-3 md:col-span-1"
                description="Discover sports venues near you"
                href="/mainpage/venues"
                cta="Find Venues"
                background={<div className="absolute inset-0 bg-indigo-900/20 rounded-xl" />}
                Icon={MapPin}
              />
              <BentoCard
                name="Leaderboard"
                className="col-span-3 md:col-span-2"
                description="See who's topping the charts this week"
                href="/mainpage/leaderboard"
                cta="View Rankings"
                background={<div className="absolute inset-0 bg-amber-900/20 rounded-xl" />}
                Icon={Trophy}
              />
            </BentoGrid>
          </Reveal>
        </section>

        {/* Live Activity */}
        <section>
          <SectionHeading sub="What's happening right now">
            Live Activity
          </SectionHeading>

          <div className="space-y-3">
            {[
              { icon: <Users size={14} />, text: "3 new players joined in your area", time: "2m ago" },
              { icon: <Shield size={14} />, text: "Team 'FC Zeros' is looking for players", time: "11m ago" },
              { icon: <MapPin size={14} />, text: "New venue added: Green Park Ground", time: "34m ago" },
              { icon: <Star size={14} />, text: "You received a team invitation", time: "1h ago" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 bg-[#11161D] hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center border bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
                    {item.icon}
                  </div>
                  <p className="flex-1 text-sm text-gray-400">
                    {item.text}
                  </p>
                  <span className="text-xs text-gray-600">
                    {item.time}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}