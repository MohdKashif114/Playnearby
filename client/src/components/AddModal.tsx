import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { NewEntry, TabType } from "../types";
import { useLocation } from "react-router-dom";
import SetTeamLocation from "./SetTeamLocation";

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  newEntry: NewEntry;
  setNewEntry: (entry: NewEntry) => void;
  onAdd: () => void;
  onVenueAdd: () => void;
}

export default function AddModal({
  open,
  onClose,
  newEntry,
  setNewEntry,
  onAdd,
  onVenueAdd,
}: AddModalProps) {
  const location = useLocation();

  const activeTab: TabType =
    location.pathname.includes("teams")
      ? "teams"
      : location.pathname.includes("venues")
      ? "venues"
      : "players";

  const handleSubmit = () => {
    if (activeTab === "teams") {
      onAdd();
    } else {
      onVenueAdd();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add New{" "}
            {activeTab === "players"
              ? "Player"
              : activeTab === "teams"
              ? "Team"
              : "Venue"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-0.5">

          {/* Name */}
          <div className="gap-3 flex-col">
            <Label className="mb-1">Name</Label>
            <Input
              value={newEntry.name}
              onChange={(e) =>
                setNewEntry({ ...newEntry, name: e.target.value })
              }
            />
          </div>

          {/* Teams Extra Fields */}
          {activeTab === "teams" && (
            <>
              <div className="flex-col">
                <Label className="mb-1">Max Players</Label>
                <Input
                  type="number"
                  min={1}
                  value={newEntry.maxPlayers}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      maxPlayers: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex-col">
                <Label className="mb-1">Status</Label>
                <Input
                  value={newEntry.status}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, status: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {/* Venue Type */}
          {activeTab === "venues" && (
            <div className="flex-col">
              <Label className="mb-1">Type</Label>
              <select
                value={newEntry.type}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    type: e.target.value as
                      | "Open ground"
                      | "Park"
                      | "Street"
                      | "Indoor"
                      | "Court",
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Open ground">Open ground</option>
                <option value="Park">Park</option>
                <option value="Street">Street</option>
                <option value="Indoor">Indoor</option>
                <option value="Court">Court</option>
              </select>
            </div>
          )}

          {/* Sport */}
          <div className="flex-col">
            <Label className="mb-1">Sport</Label>
            <select
              value={newEntry.sport}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  sport: e.target.value as
                    | "cricket"
                    | "football"
                    | "both",
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              {activeTab === "venues" && (
                <option value="both">Both</option>
              )}
            </select>
          </div>

          {/* Location */}
          <SetTeamLocation
            onchange={(lat, lng) =>
              setNewEntry({
                ...newEntry,
                location: { lat, lng },
              })
            }
          />

        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
