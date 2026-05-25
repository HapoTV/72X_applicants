import React from "react";
import { X, Plus } from "lucide-react";
import type { PeerSupportGroupFormData } from "../../../../interfaces/MentorshipData";

interface CreatePeerSupportGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  newGroup: PeerSupportGroupFormData;
  categories: string[];
  onUpdateGroup: (updatedGroup: PeerSupportGroupFormData) => void;
  onCreateGroup: () => void;
  disabled: boolean;
}

const CreatePeerSupportGroupModal: React.FC<
  CreatePeerSupportGroupModalProps
> = ({
  isOpen,
  onClose,
  newGroup,
  categories,
  onUpdateGroup,
  onCreateGroup,
  disabled,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Support Group</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Group Name *
              </label>
              <input
                value={newGroup.name}
                onChange={(e) =>
                  onUpdateGroup({ ...newGroup, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Soweto Entrepreneurs Circle"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={newGroup.category}
                onChange={(e) =>
                  onUpdateGroup({ ...newGroup, category: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories
                  .filter((category) => category !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Location
              </label>
              <input
                value={newGroup.location}
                onChange={(e) =>
                  onUpdateGroup({ ...newGroup, location: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Soweto, Johannesburg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Max Members
              </label>
              <input
                type="number"
                min={2}
                max={500}
                value={newGroup.maxMembers}
                onChange={(e) =>
                  onUpdateGroup({
                    ...newGroup,
                    maxMembers: parseInt(e.target.value, 10) || 100,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={newGroup.description}
              onChange={(e) =>
                onUpdateGroup({ ...newGroup, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Describe your group's purpose, goals, and who should join..."
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={newGroup.isPublic}
              onChange={(e) =>
                onUpdateGroup({ ...newGroup, isPublic: e.target.checked })
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make this group public (visible to everyone)
            </label>
          </div>

          <div className="flex gap-2 pt-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onCreateGroup}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              disabled={disabled}
            >
              <Plus className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePeerSupportGroupModal;
