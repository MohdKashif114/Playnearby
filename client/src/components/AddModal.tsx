import type { NewEntry, TabType } from '../types';
import { locations } from '../data/locations';
import { Link, useLocation } from 'react-router-dom';
import SetLocation from './SetLocation';
import SetTeamLocation from './SetTeamLocation';

interface AddModalProps {
  newEntry: NewEntry;
  setNewEntry: (entry: NewEntry) => void;
  onAdd: () => void;
  onClose: () => void;
  onVenueAdd:()=>void;
}

export default function AddModal({
  newEntry,
  setNewEntry,
  onAdd,
  onClose,
  onVenueAdd
}: AddModalProps) {

  const location = useLocation();

  const activeTab: TabType =
    location.pathname.includes("teams")
      ? "teams"
      : location.pathname.includes("venues")
      ? "venues"
      : "players";

    

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Add New{' '}
          {activeTab === 'players'
            ? 'players'
            : activeTab === 'teams'
            ? 'teams'
            : 'venues'}
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={newEntry.name}
            onChange={(e) =>
              setNewEntry({ ...newEntry, name: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          />
          {activeTab==="teams" && <input
            type="number"
            placeholder="maxPlayers"
            value={newEntry.maxPlayers}
            min={1}
            step={1}
            onChange={(e) =>
              setNewEntry({ ...newEntry, maxPlayers: Number(e.target.value) })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          />}
          {activeTab==='teams' && <input
            type="text"
            placeholder="Status"
            value={newEntry.status}
            onChange={(e) =>
              setNewEntry({ ...newEntry, status: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          />}
          {activeTab==="venues" && <select
            value={newEntry.type}
            onChange={(e) =>
              setNewEntry({
                ...newEntry,
                type: e.target.value as 'Open ground' | 'Park' | 'Street' | 'Indoor' | 'Court',
              })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          >
            <option value="Open ground">Open ground</option>
            <option value="Park">Park</option>
            <option value="Street">Street</option>
            <option value="Indoor">Indoor</option>
            <option value="Court">Court</option>
            
          </select>}
          {/* Sport */}
          <select
            value={newEntry.sport}
            onChange={(e) =>
              setNewEntry({
                ...newEntry,
                sport: e.target.value as 'cricket' | 'football' | 'both',
              })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          >
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
            {activeTab === 'venues' && <option value="both">Both</option>}
          </select>

          
            

            <SetTeamLocation onchange={(lat,lng)=>{
              console.log("Setting team location to ",lat,"and",lng);
              setNewEntry(
                {
                 ...newEntry,
                 location:{
                  lat:lat,
                  lng:lng,
                 } 
                }
              )
            }}/>
          
          

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={activeTab==="teams"?onAdd:onVenueAdd}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Add
            </button>

            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
