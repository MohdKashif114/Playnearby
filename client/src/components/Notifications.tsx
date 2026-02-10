import { useEffect, useState } from "react";



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




 const Notifications = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [teamInvites, setTeamInvites] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {

      try {
        console.log("fetching reqs");
        const frRes = await fetch("http://localhost:5000/incoming-request", {
          credentials: "include"
        });
        const frData: FriendRequest[] = await frRes.json();
        console.log(frData);

        // const tiRes = await fetch("/api/team-invitations", {
        //   credentials: "include"
        // });
        // const tiData: TeamInvitation[] = await tiRes.json();

        setFriendRequests(frData);
        // setTeamInvites(tiData);
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const acceptFriend = async (id: string) => {
    try{
        console.log("in accept friend")
        await fetch(`http://localhost:5000/accept/${id}`, {
          method: "POST",
          credentials: "include"
        });
    
        setFriendRequests(prev =>
          prev.filter(request => request._id !== id)
        );
    }catch(err){
        console.log("cant accept friend reques",err);
    }
  };

  const rejectFriend=async (id:string)=>{
        try{
        console.log("in reject friend")
        await fetch(`http://localhost:5000/reject/${id}`, {
          method: "POST",
          credentials: "include"
        });
    
        setFriendRequests(prev =>
          prev.filter(request => request._id !== id)
        );
        }catch(err){
            console.log("cant reject friend reques",err);
        }
  }

  const acceptTeamInvite = async (id: string) => {
    await fetch(`/api/team/accept/${id}`, {
      method: "POST",
      credentials: "include"
    });

    setTeamInvites(prev =>
      prev.filter(invite => invite._id !== id)
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-96 m-auto">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <>
          <h3 className="font-medium mb-2">Friend Requests</h3>
          {friendRequests.map(req => (
            <div
              key={req._id}
              className="border p-3 rounded-lg mb-2 flex justify-between items-center gap-2"
            >
              <p>{req.sender.name} sent you a friend request</p>
              <button
                onClick={() => acceptFriend(req._id)}
                className="bg-green-500 text-white px-3 py-1 rounded "
              >
                Accept
              </button>
              <button
                onClick={() => rejectFriend(req._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          ))}
        </>
      )}

      {/* Team Invitations */}
      {teamInvites.length > 0 && (
        <>
          <h3 className="font-medium mt-4 mb-2">Team Invitations</h3>
          {teamInvites.map(invite => (
            <div
              key={invite._id}
              className="border p-3 rounded-lg mb-2 flex justify-between items-center"
            >
              <p>
                {invite.invitedBy.name} invited you to join{" "}
                <strong>{invite.team.name}</strong>
              </p>
              <button
                onClick={() => acceptTeamInvite(invite._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
            </div>
          ))}
        </>
      )}

      {friendRequests.length === 0 && teamInvites.length === 0 && (
        <p className="text-gray-500">No new notifications</p>
      )}
    </div>
  );
};


export default Notifications;