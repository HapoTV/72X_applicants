import React from "react";
import { Users } from "lucide-react";
import type { PeerSupportGroup } from "../../../../interfaces/MentorshipData";
import PeerSupportGroupCard from "./PeerSupportGroupCard";

interface PeerSupportGroupsListProps {
  groups: PeerSupportGroup[];
  filteredGroups: PeerSupportGroup[];
  searchQuery: string;
  selectedCategory: string;
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onOpenGroupChat: (groupId: string, groupName: string) => void;
  onOpenCreateModal: () => void;
}

const PeerSupportGroupsList: React.FC<PeerSupportGroupsListProps> = ({
  filteredGroups,
  searchQuery,
  selectedCategory,
  onJoinGroup,
  onLeaveGroup,
  onOpenGroupChat,
  onOpenCreateModal,
}) => {
  if (filteredGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No groups found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          {searchQuery
            ? `No groups found matching "${searchQuery}". Try a different search term.`
            : selectedCategory !== "all"
              ? `No groups found in ${selectedCategory}. Try another category.`
              : "No groups available at the moment. Be the first to create one!"}
        </p>
        {!searchQuery && selectedCategory === "all" && (
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Create First Group
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredGroups.map((group) => (
        <PeerSupportGroupCard
          key={group.groupId}
          group={group}
          onJoinGroup={onJoinGroup}
          onLeaveGroup={onLeaveGroup}
          onOpenGroupChat={onOpenGroupChat}
        />
      ))}
    </div>
  );
};

export default PeerSupportGroupsList;
