import { MapPin, ChevronLeft, ChevronRight, Users, Shield, Star } from "lucide-react";
import type { Player, Team, Venue } from "../types";
import { useAuth } from "../Auth/AuthProvider";
import { Link } from "react-router-dom";
import { socket } from "../socket/socket";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CiCirclePlus } from "react-icons/ci";
// import { Button } from "./ui/button";
import { Button } from "@/components/ui/button"
import { Spinner } from "./ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"




type CardItem = Player | Team | Venue;

interface CardProps {
  item: CardItem;
  online: boolean;
  jointeamhandler: (teamid: string) => void;
  usersteam: boolean;
  exitteamhandler: (teamid: string) => void;
  updateVenueImages:(venueId:string,newImages:string[])=>void;
}





function VenueSlideshow({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setIdx((p) => (p + dir + images.length) % images.length);
        setTransitioning(false);
      }, 250);
    },
    [images.length, transitioning]
  );

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => go(1), 4000);
    return () => clearInterval(t);
  }, [go]);

  const fallback =
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80";
  const src = images?.[idx] ?? fallback;

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-2xl group">
      <img
        src={src}
        alt={`${name} ${idx + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* arrows */}
      {images?.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {/* dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`rounded-full transition-all ${
                  i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Star rating ───────────────────────────────────────────────────────────
function StarRating({
  avg,
  count,
  onRate,
}: {
  avg: number;
  count: number;
  onRate: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onRate(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                (hovered || avg) >= star
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-500"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-400">
        {avg?.toFixed(1)} <span className="opacity-50">({count})</span>
      </span>
    </div>
  );
}

// ─── Main Card ─────────────────────────────────────────────────────────────
export default function Card({
  item,
  online,
  jointeamhandler,
  usersteam,
  exitteamhandler,
  updateVenueImages
}: CardProps) {
  const { currentTeam, user, friends } = useAuth();
  const [open, setOpen] = useState(false);
  const [loadingpic,setLoadingpic]=useState(false);
  const isPlayer = (i: CardItem): i is Player => "role" in i && "available" in i;
  const isTeam = (i: CardItem): i is Team => "members" in i && "maxPlayers" in i;
  const isVenue = (i: CardItem): i is Venue => "type" in i;

  const [venueRating, setVenueRating] = useState(
    isVenue(item) ? { averageRating: item.averageRating, ratingCount: item.ratingCount } : null
  );
  const [image, setImage] = useState<File | null>(null);
  const friendIds = new Set(Array.isArray(friends) ? friends.map((f) => f._id) : []);
  const isFriend = friendIds.has(item._id);

  const addimagehandler = async (e: React.FormEvent) => {
  e.preventDefault();
    console.log("event is",e);
    setLoadingpic(true);
  if (!isVenue(item)) return;
  if (!image) {
    toast.error("Please select an image");
    return;
  }

  const form = new FormData();
  form.append("venueImage", image);
  form.append("venueId", item._id);

  try {
    const res = await fetch("http://localhost:5000/venue/addimage", {
      method: "PUT",
      credentials: "include",
      body: form,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    console.log("images:",data.images);
    updateVenueImages?.(item._id, data.images);
    setLoadingpic(false);
    toast.success("Image uploaded successfully!");
    setImage(null);
    setOpen(false);
  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  }
};


  
  const sendrequesthandler = () => socket.emit("send-request", item._id);

  const handleVenueRating = async (rating: number) => {
    if (!isVenue(item)) return;
    try {
      const res = await fetch("http://localhost:5000/venue/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ venueId: item._id, rating }),
      });
      const data = await res.json();
      setVenueRating({ averageRating: data.averageRating, ratingCount: data.ratingCount });
    } catch (error) {
      console.error("Rating failed", error);
    }
  };

  const invitetoteamhandler = async (userId: string) => {
    try {
      const res = await fetch("http://localhost:5000/team-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teamId: user.currentTeam, userId }),
      });
      if (!res.ok) throw new Error("cant send invite:(");
      toast("Invitation sent!");
    } catch (error) {
      console.error("Error sending invite", error);
    }
  };

  // ── PLAYER CARD ──────────────────────────────────────────────────────────
  if (isPlayer(item)) {
    return (
      <div
        className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        <div className="p-5 flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-emerald-500/40 shadow-lg">
              <img
                src={item.profileImage ?? "https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online dot */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                online ? "bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" : "bg-gray-500"
              }`}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-gray-100 font-bold text-lg leading-tight truncate">
                {item.name}
              </h3>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 whitespace-nowrap">
                {item.role}
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{item.area}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {item._id !== user.id && (
                <button
                  onClick={sendrequesthandler}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    isFriend
                      ? "bg-gray-700 hover:bg-red-900/40 text-gray-300 hover:text-red-400 border border-gray-600"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  {isFriend ? "Remove Friend" : "+ Add Friend"}
                </button>
              )}
              {!item.currentTeam && (
                <button
                  onClick={() => invitetoteamhandler(item._id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 transition-colors"
                >
                  Invite to Team
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── TEAM CARD ────────────────────────────────────────────────────────────
  if (isTeam(item)) {
    const fill = Math.round((item.members.length / item.maxPlayers) * 100);
    return (
      <div
        className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className={`h-1 w-full bg-gradient-to-r ${usersteam ? "from-violet-500 to-fuchsia-500" : "from-blue-500 to-indigo-500"}`} />

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${usersteam ? "text-violet-400" : "text-blue-400"}`} />
                <h3 className={`font-bold text-lg ${usersteam ? "text-violet-300" : "text-gray-100"}`}>
                  {item.name}
                </h3>
                <span className={`w-2.5 h-2.5 rounded-full ${online ? "bg-emerald-400" : "bg-gray-500"}`} />
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                <span>{item.area}</span>
              </div>
            </div>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5">
              {item.sport}
            </span>
          </div>

          {/* Player count + progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3 h-3" /> {item.members.length} / {item.maxPlayers} players
              </span>
              <span className="text-xs text-gray-500">{fill}%</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all"
                style={{ width: `${fill}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {currentTeam === null ? (
              <button
                onClick={() => jointeamhandler(item._id)}
                className="flex-1 text-sm font-semibold py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Join Team
              </button>
            ) : (
              usersteam && (
                <>
                  <button
                    onClick={() => exitteamhandler(item._id)}
                    className="flex-1 text-sm font-medium py-2 rounded-xl bg-gray-700 hover:bg-red-900/40 hover:text-red-400 text-gray-300 transition-colors border border-gray-600"
                  >
                    Exit
                  </button>
                  <Link
                    to={item._id}
                    className="flex-1 text-sm font-semibold py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-center transition-colors"
                  >
                    View Team
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── VENUE CARD ───────────────────────────────────────────────────────────
  if (isVenue(item)) {
    // Support single or multiple images
    const images: string[] = item.images?.length
      ? item.images
      : item.profileImage
      ? [item.profileImage]
      : [];
      console.log("images are :",item.images)

    return (
      <div
        className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/60 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Slideshow or placeholder */}
        {images.length > 0 ? (
          <VenueSlideshow images={images} name={item.name} />
        ) : (
          <div className="w-full h-48 bg-gray-800 flex items-center justify-center rounded-t-2xl">
            <MapPin className="w-8 h-8 text-gray-600" />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-gray-100 font-bold text-lg leading-tight">{item.name}</h3>
            <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full px-2 py-0.5 ml-2 whitespace-nowrap">
              {item.type}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
            <MapPin className="w-3 h-3" />
            <span>{item.area}</span>
            <span className="mx-1 opacity-30">·</span>
            <span className="text-gray-500">{item.distanceKm} km away</span>
          </div>

          {item.sport && (
            <span className="inline-block text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded-full px-2 py-0.5 mb-3">
              {item.sport}
            </span>
          )}

          {/* Rating */}
          {venueRating && (
            <div className="mb-4">
              <StarRating
                avg={venueRating.averageRating}
                count={venueRating.ratingCount}
                onRate={handleVenueRating}
              />
            </div>
          )}

          {/* Map button */}
          <div className="flex gap-3 justify-between">

          <button
            onClick={() => {
              if (!item.location) return;
              window.open(`https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`, "_blank");
            }}
            className="w-3/4 text-sm font-semibold py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-blue-900/40"
            >
            <MapPin className="w-4 h-4" />
            Open in Google Maps
          </button>
          <Dialog open={open} onOpenChange={setOpen}>

  <DialogTrigger asChild>
    <Button variant="outline" onClick={() => setOpen(true)}>Add Pic</Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-sm">
    <form onSubmit={addimagehandler}>
      <DialogHeader>
        <DialogTitle>Add Picture</DialogTitle>
      </DialogHeader>

      <FieldGroup>
        <Field>
          <Label>Upload Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>

        <Button type="submit">Upload
          {
          loadingpic &&   <Spinner data-icon="inline-start" />
          
        }
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>


            </div>
        </div>
      </div>
    );
  }

  return null;
}
