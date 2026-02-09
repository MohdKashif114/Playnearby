import { Socket,Server } from "socket.io";
import Team from "../models/Team";
import User from "../models/User";
import Message from "../models/Message";



const onlineUsers = new Map<string,string>();


async function getAllTeams() {
  const teams= await Team.find().populate("members", "name").lean();
  const formattedteams = teams.map(team => ({
    ...team,
    location: team.location?.coordinates
        ? {
            lat: team.location.coordinates[1], 
            lng: team.location.coordinates[0], 
        }
        : null,
    }));

    return formattedteams;
}



export function setupPresence(io:Server) {
  io.on("connection", async(socket : Socket) => {
    console.log("Socket connected:", socket.id);

    const handshakeuser=socket.handshake.auth.user;
    if(!handshakeuser) return;
    console.log("handshake user is : ",handshakeuser);
    const userId=handshakeuser.id;

    console.log("user connected with id",userId);
    // const useronce=await User.findById(userId);
    // const name=useronce?.name;
    
    
    socket.on("user-online", (userId : string) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online-users", [...onlineUsers.keys()]);
    });
    
    socket.on("ping-test",(data)=>{
      console.log("pingdata is ",data);
    })
    
    socket.on("create-team",async ({name,sport,location,maxPlayers,area})=>{

      console.log("the user tryng to create team is ",userId,"locaiton is ",location);
      const {lat,lng}=location
      const user=await User.findById(userId);
      if(!user) return;
      if(user.currentTeam){
        socket.emit("team-error",{message:"User already in a team"})
        return;
      }
      
      if (
        typeof maxPlayers !== "number" ||
        maxPlayers <= 0
      ) {
        socket.emit("team-error", {
          message: "Invalid maxPlayers",
        });
        return;
      }
      const team=await Team.create({
        name:name,
        sport:sport,
        location: {
          type: "Point",
          coordinates: [lng, lat], 
        },
        area:area,
        maxPlayers:maxPlayers,
        members:[userId],
        status:"OPEN"
      })

      user.currentTeam=team._id;
      const teamid=team._id.toString();
      console.log("creating team",teamid);
      
      socket.join(teamid);
      socket.emit("get-team-id",team._id);
      await user.save();
      io.emit("teams-updated",await getAllTeams())
    })
    
    
    
    socket.on("join-team", async (teamId) => {
      const user=await User.findById(userId);
      if(!user) return;
      
      if(user.currentTeam){
        if(user.currentTeam===teamId){
          return;
        }
        socket.emit("team-error",{message:"User already in a team:("});
        return;
      }

      console.log("join team on the server side",teamId);
      const team = await Team.findById(teamId);
      console.log("team is",team);
      if (!team) {
        socket.emit("team-error", { message: "Team not found" });
      return;
    }
    
    if (team.members.length >= team.maxPlayers) {
      socket.emit("team-error", { message: "Team is full" });
      return;
    }
    

    if(team.members.includes(userId)){
      console.log("user is already in the team");
      return;
    }
    if(!team.members.includes(userId)) {
      console.log("user trying to join is ",userId);
      team.members.push(userId);
    }
    
    if (team.members.length === team.maxPlayers) {
      team.status = "FULL";
    }
    
    await team.save();
    user.currentTeam=teamId
    await user.save();
    console.log("joining room",teamId.toString());
    socket.join(teamId.toString());
    io.to(teamId.toString()).emit("user-joined-room",userId);
    io.emit("teams-updated", await getAllTeams());
  });

  socket.on("exit-team",async(teamid)=>{
    const user=await User.findById(userId);
    const team=await Team.findById(teamid);
    if(!user || !team){
      socket.emit("team-error",{message:"user not present"});
      return;
    }
    team.members=team.members.filter((id)=>{
      if(!id) return false;
      return !id.equals(userId);
    })
    if(team.members.length===0){
        await Team.findByIdAndDelete(teamid);
    }
    else{
      await team.save();
    }
    user.currentTeam=null;
    await user.save();
    socket.leave(teamid.toString());
    io.emit("teams-updated",await getAllTeams());
  })

  socket.on("rejoin-team", (teamId) => {
    socket.join(teamId.toString());
  });


  socket.on("send-message",async(teamid,message)=>{
    if (!socket.rooms.has(teamid.toString())) return;
    try{

      io.to(teamid).emit("receive-message", {
        userId: userId,
        message,
        time: Date.now(),
        name:handshakeuser.name
      });
      
        
        const msg = await Message.create({
          teamId:teamid,
          sender: userId,
          text:message,
          name: handshakeuser.name,
        });
    }catch(err){
      console.log("Cant save message",err);
    }



  })


  
  
  const teams=await getAllTeams();
  socket.emit("teams-updated",teams);
  
  socket.on("disconnect", async() => {
    console.log("disconnected:(");
    for (let [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      
      
      
      setTimeout(async()=>{
        console.log("after waiting for 10 sec");
        if(!onlineUsers.has(userId)){
                  const user=await User.findById(userId);
                  console.log("removing user after waiting for 10 sec");
                  if(user?.currentTeam){
                    const teamid=user.currentTeam;
                    const team=await Team.findById(user.currentTeam);

                    if(!user || !team){
                      socket.emit("team-error",{message:"user not present"});
                      return;
                    }
                    team.members=team.members.filter((id)=>{
                      if(!id) return false;
                      return !id.equals(userId);
                    })
                    if(team.members.length===0){
                        await Team.findByIdAndDelete(teamid);
                    }
                    else{
                      await team.save();
                    }
                    user.currentTeam=null;
                    await user.save();
                    socket.leave(teamid.toString());
                    io.emit("teams-updated",await getAllTeams());
          }
        }
      },10000);

      
      
      io.emit("online-users", [...onlineUsers.keys()]);
    });
  });
}
