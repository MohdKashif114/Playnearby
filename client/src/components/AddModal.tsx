import type { NewEntry, TabType } from '../types';
import { locations } from '../data/locations';

interface AddModalProps {
  activeTab: TabType;
  newEntry: NewEntry;
  setNewEntry: (entry: NewEntry) => void;
  onAdd: () => void;
  onClose: () => void;
}

export default function AddModal({
  activeTab,
  newEntry,
  setNewEntry,
  onAdd,
  onClose,
}: AddModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Add New{' '}
          {activeTab === 'players'
            ? 'Player'
            : activeTab === 'teams'
            ? 'Team'
            : 'Venue'}
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
          <input
            type="number"
            placeholder="maxPlayers"
            value={newEntry.maxPlayers}
            min={1}
            step={1}
            onChange={(e) =>
              setNewEntry({ ...newEntry, maxPlayers: Number(e.target.value) })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          />
          <input
            type="text"
            placeholder="Status"
            value={newEntry.status}
            onChange={(e) =>
              setNewEntry({ ...newEntry, status: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          />

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

          {/* Location */}
          <select
            value={newEntry.location}
            onChange={(e) =>
              setNewEntry({ ...newEntry, location: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          

          

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onAdd}
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
