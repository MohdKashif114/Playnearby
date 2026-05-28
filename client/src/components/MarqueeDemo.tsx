import { cn } from "@/lib/utils"
import { Marquee } from "../components/ui/marquee"

const players = [
  {
    name: "Alex Rivera",
    username: "Football • Striker",
    body: "Looking to join a weekly 7v7 group. Available weekday evenings. Sigra Ground area.",
    img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
  },
  {
    name: "Sarah Jenkins",
    username: "Tennis • Intermediate",
    body: "Looking for singles players or doubles matches on Saturday mornings. Flexible venue.",
    img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
  },
  {
    name: "Marcus Chen",
    username: "Cricket • All-rounder",
    body: "Right-arm fast bowler, middle order batsman. Let's connect for weekend cricket fixtures!",
    img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
  },
  {
    name: "Priya Patel",
    username: "Badminton • Advanced",
    body: "Seeking doubles partners for competitive games at the Sports Hub. Available daily.",
    img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya",
  },
  {
    name: "Elena Rostova",
    username: "Basketball • Guard",
    body: "Always down for half-court pickup games. Shoot me an invite if you are short of players.",
    img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena",
  },
  {
    name: "David Kim",
    username: "Volleyball • Spiker",
    body: "Looking for competitive indoor or beach volleyball tournaments in the local area.",
    img: "https://api.dicebear.com/7.x/adventurer/svg?seed=David",
  },
]

const firstRow = players.slice(0, players.length / 2)
const secondRow = players.slice(players.length / 2)

const PlayerCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-72 cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-[#11161D]/45 p-5 hover:border-indigo-500/30 hover:bg-[#11161D]/75 hover:-translate-y-0.5 transition-all duration-300 group"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/60 overflow-hidden flex items-center justify-center p-0.5">
          <img className="rounded-full object-cover" width="36" height="36" alt={name} src={img} />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
            {name}
          </figcaption>
          <p className="text-[11px] text-indigo-400/80 font-semibold tracking-wide mt-0.5">{username}</p>
        </div>
      </div>
      <blockquote className="mt-3.5 text-xs text-gray-400 leading-relaxed font-normal">{body}</blockquote>
    </figure>
  )
}

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
      <Marquee pauseOnHover className="[--duration:25s]">
        {firstRow.map((player) => (
          <PlayerCard key={player.name} {...player} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:25s]">
        {secondRow.map((player) => (
          <PlayerCard key={player.name} {...player} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0B0F14] to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0B0F14] to-transparent"></div>
    </div>
  )
}
