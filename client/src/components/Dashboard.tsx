import { useEffect, useRef, useState } from "react";
import { MarqueeDemo } from "./MarqueeDemo";
import { Users, MapPin, Shield, Trophy, Zap, Star } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { RetroGrid } from "@/components/ui/retro-grid";

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
      <div className="relative rounded-2xl border border-gray-800/80 bg-[#11161D]/40 backdrop-blur-md p-6 hover:-translate-y-1 hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.2)] hover:border-indigo-500/40 transition-all duration-300 group overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border relative z-10 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${color}15`,
            borderColor: `${color}30`,
            color,
          }}
        >
          {icon}
        </div>
        <p className="text-3xl font-extrabold text-white tracking-tight relative z-10">{value}</p>
        <p className="text-xs text-gray-400 font-semibold mt-1.5 uppercase tracking-wider relative z-10">
          {label}
        </p>
      </div>
    </Reveal>
  );
}

function SectionHeading({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal>
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
          {children}
        </h2>
        {sub && <p className="text-sm text-indigo-400/80 font-medium mt-2">{sub}</p>}
      </div>
    </Reveal>
  );
}

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-gray-100 font-sans relative overflow-hidden">
      <ScrollProgress />

      {/* ── HERO ── */}
      <div className="relative border-b border-gray-800/80 bg-[#0F141B]/40 py-24 md:py-32 overflow-hidden">
        {/* Radial glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_55%)] pointer-events-none" />

        {/* Interactive Retro Grid */}
        <RetroGrid opacity={0.25} darkLineColor="#312E81" lightLineColor="#312E81" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3.5 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 animate-pulse" /> Playnearby Hub
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight max-w-2xl text-white">
              Find players,
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                build your team.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-gray-400 mt-6 max-w-lg text-sm md:text-base leading-relaxed">
              Connect with athletes near you in real-time, organize matches, and find the perfect venues to play.
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
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-[#11161D]/20 backdrop-blur-md">
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
                background={<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.15),transparent_50%)]" />}
                Icon={Users}
              />
              <BentoCard
                name="Teams"
                className="col-span-3 md:col-span-1"
                description="Join or create a team"
                href="/mainpage/teams"
                cta="Browse Teams"
                background={<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.15),transparent_50%)]" />}
                Icon={Shield}
              />
              <BentoCard
                name="Venues"
                className="col-span-3 md:col-span-1"
                description="Discover sports venues near you"
                href="/mainpage/venues"
                cta="Find Venues"
                background={<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.15),transparent_50%)]" />}
                Icon={MapPin}
              />
              <BentoCard
                name="Leaderboard"
                className="col-span-3 md:col-span-2"
                description="See who's topping the charts this week"
                href="/mainpage/leaderboard"
                cta="View Rankings"
                background={<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(245,158,11,0.15),transparent_50%)]" />}
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
                <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-800 bg-[#11161D]/40 backdrop-blur-md hover:bg-indigo-500/[0.03] hover:border-indigo-500/30 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <p className="flex-1 text-sm text-gray-200 group-hover:text-white transition-colors">
                    {item.text}
                  </p>
                  <span className="text-xs text-gray-500 font-medium">
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