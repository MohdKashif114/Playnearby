import { useParams } from "react-router-dom";
import type {
  Player,
  Team,
  Venue,
  TabType,
  SportFilter,
  NewEntry,
} from '../types';
import {Link} from "react-router-dom";

type CardItem = Player | Team | Venue;

interface TeamDetailsProps{
    teams:Team[] ;
}





export default function TeamDetails({ teams }:TeamDetailsProps) {
  const { teamId } = useParams();

  const team = teams.find((t) => t._id === teamId);

  if (!team) {
    return <div className="text-white">Team not found</div>;
  }

  return (
    <div className="text-white space-y-4">
      <h1 className="text-2xl font-bold">{team.name}</h1>
      <p>Sport: {team.sport}</p>
      <p>Location: {team.area}</p>
      <p>Max Players: {team.maxPlayers}</p>

      <div>
        <h2 className="font-semibold">Members</h2>
        {team.members.length === 0 ? (
          <p>No members yet</p>
        ) : (
          <ul className="list-disc ml-5">
            {team.members.map((m, i) => (
              <li key={i}>{m.name}</li>
            ))}
          </ul>
        )}
      </div>
        <Link
        to="chat"
        className="text-blue-400 underline"
        >
        Open Team Chat
        </Link>
    </div>
  );
}