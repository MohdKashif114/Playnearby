import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    area: "",
    sport: "",
    role: "",
    bio: "",
    contact:"",
  });

  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState<File | null>(null);


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        area: user.area || "",
        sport: user.sport || "",
        role: user.role || "",
        bio: user.bio || "",
        contact:user.contact || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleUpdate = async () => {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("area", formData.area);
      form.append("sport", formData.sport);
      form.append("role", formData.role);
      form.append("bio", formData.bio);

      if (image) {
        form.append("profileImage", image);
      }
      console.log("form data is : ",form)
      try{
          const res = await fetch("http://localhost:5000/update-profile", {
            method: "PUT",
            credentials: "include",
            body: form,
          });
          if(!res.ok) throw new Error("cant update")
    
          const data = await res.json();
          setUser(data.updatedUser);

      }catch(err){
        console.log("cant update user",err);
      }
    };


  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg">

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <img
            src={user.profileImage || "https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            />

        </div>

        {/* Name */}
        <span>Name</span><input
          name="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />

        {/* Area */}
        <input
          name="area"
          placeholder="area"
          value={formData.area}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />

        {/* Sport */}
        <input
          name="sport"
          placeholder="sport"
          value={formData.sport}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />

        {/* Role */}
        <input
          name="role"
          placeholder="role"
          value={formData.role}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />
        <input
          name="contact"
          placeholder="contact"
          value={formData.contact}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-green-600 p-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="w-full bg-blue-600 p-2 rounded"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
