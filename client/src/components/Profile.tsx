import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Auth/AuthProvider";
import {
  User, MapPin, Dumbbell, Shield, Phone, FileText,
  Pencil, Check, Camera, Loader2
} from "lucide-react";

const FIELDS = [
  { name: "name",    label: "Name",     icon: <User size={14} />,     type: "input",    placeholder: "Your name" },
  { name: "area",    label: "Location", icon: <MapPin size={14} />,   type: "input",    placeholder: "Your area" },
  { name: "sport",   label: "Sport",    icon: <Dumbbell size={14} />, type: "input",    placeholder: "Favourite sport" },
  { name: "role",    label: "Role",     icon: <Shield size={14} />,   type: "input",    placeholder: "Your role" },
  { name: "contact", label: "Contact",  icon: <Phone size={14} />,    type: "input",    placeholder: "Phone / handle" },
  { name: "bio",     label: "Bio",      icon: <FileText size={14} />, type: "textarea", placeholder: "Tell others about yourself…" },
] as const;

type FieldName = typeof FIELDS[number]["name"];

export default function Profile() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState<Record<FieldName, string>>({
    name: "", area: "", sport: "", role: "", bio: "", contact: "",
  });
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        area: user.area || "",
        sport: user.sport || "",
        role: user.role || "",
        bio: user.bio || "",
        contact: user.contact || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    setSaving(true);
    const form = new FormData();
    (Object.keys(formData) as FieldName[]).forEach((k) => form.append(k, formData[k]));
    if (image) form.append("profileImage", image);
    try {
      const res = await fetch("http://localhost:5000/update-profile", {
        method: "PUT",
        credentials: "include",
        body: form,
      });
      if (!res.ok) throw new Error("Can't update");
      const data = await res.json();
      setUser(data.updatedUser);
      setEditing(false);
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Can't update user", err);
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc =
    preview ||
    user?.profileImage ||
    null;

  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "??";
  const hue = (user?.name?.charCodeAt(0) ?? 65) * 5 % 360;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-950 flex items-start justify-center py-10 px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md space-y-4">

        {/* ── Header card ── */}
        <div
          className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
          style={{ background: "linear-gradient(160deg,#0f1117 0%,#131720 100%)" }}
        >
          {/* accent strip */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500" />
          {/* glow blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-6 flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-violet-500/30 shadow-lg flex items-center justify-center"
                style={!avatarSrc ? { background: `hsl(${hue},55%,32%)` } : {}}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-white">{initials}</span>
                )}
              </div>
              {editing && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-500 flex items-center justify-center shadow-lg transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-white truncate">{user.name || "Your Name"}</h2>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {user.sport && (
                  <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5">
                    {user.sport}
                  </span>
                )}
                {user.role && (
                  <span className="text-xs bg-gray-700/60 text-gray-400 border border-gray-700 rounded-full px-2 py-0.5">
                    {user.role}
                  </span>
                )}
                {user.area && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {user.area}
                  </span>
                )}
              </div>
            </div>

            {/* Edit toggle */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex-shrink-0 p-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Fields card ── */}
        <div
          className="rounded-2xl border border-gray-800 shadow-xl overflow-hidden"
          style={{ background: "linear-gradient(160deg,#0f1117 0%,#131720 100%)" }}
        >
          <div className="divide-y divide-gray-800/60">
            {FIELDS.map((field) => (
              <div key={field.name} className="px-5 py-3.5 group">
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1.5">
                  <span className="text-violet-500/70">{field.icon}</span>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder={field.placeholder}
                    rows={3}
                    className={`w-full bg-transparent text-sm resize-none focus:outline-none transition-colors placeholder-gray-700 ${
                      editing
                        ? "text-gray-200 border-b border-violet-500/40 pb-1"
                        : "text-gray-400 border-b border-transparent"
                    }`}
                  />
                ) : (
                  <input
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder={field.placeholder}
                    className={`w-full bg-transparent text-sm focus:outline-none transition-colors placeholder-gray-700 ${
                      editing
                        ? "text-gray-200 border-b border-violet-500/40 pb-1"
                        : "text-gray-400 border-b border-transparent"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Action bar ── */}
          {editing && (
            <div className="px-5 py-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => { setEditing(false); setPreview(null); setImage(null); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                ) : (
                  <><Check className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}