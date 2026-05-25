import React from "react";
import { Users, MessageSquare, Calendar, MapPin, Globe } from "lucide-react";
import { mentorshipService } from "../../../../services/MentorshipService";
import type { PeerSupportGroup } from "../../../../interfaces/MentorshipData";

interface PeerSupportGroupCardProps {
  group: PeerSupportGroup;
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onOpenGroupChat: (groupId: string, groupName: string) => void;
}

const getAvailabilityStatus = (group: PeerSupportGroup) => {
  if (group.memberCount >= group.maxMembers) {
    return { text: "Full", color: "bg-red-100 text-red-800" };
  }
  const percentage = (group.memberCount / group.maxMembers) * 100;
  if (percentage >= 90)
    return { text: "Almost Full", color: "bg-red-100 text-red-800" };
  if (percentage >= 75)
    return { text: "Limited Spots", color: "bg-yellow-100 text-yellow-800" };
  return { text: "Open", color: "bg-green-100 text-green-800" };
};

const PeerSupportGroupCard: React.FC<PeerSupportGroupCardProps> = ({
  group,
  onJoinGroup,
  onLeaveGroup,
  onOpenGroupChat,
}) => {
  const availability = getAvailabilityStatus(group);
  const isFull = group.memberCount >= group.maxMembers;
  const groupImage =
    group.imageUrl || mentorshipService.getDefaultImage(group.name);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={groupImage}
          alt={group.name}
          className="w-12 h-12 object-cover rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = mentorshipService.getDefaultImage(group.name);
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{group.name}</h3>
          <p className="text-gray-600 text-xs">{group.category}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${availability.color}`}
        >
          {availability.text}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {group.description}
      </p>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">
              {group.memberCount} / {group.maxMembers} members
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">
              {group.createdAt
                ? mentorshipService.formatDateRelative(group.createdAt)
                : "New"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">{group.location || "Online"}</span>
          </div>
          {group.isPublic && (
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span className="text-xs">Public</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            By {group.createdBy || "Unknown"}
          </span>
          {group.isMember && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {group.isOwner ? "Owner" : "Member"}
            </span>
          )}
        </div>

        {group.recentActivity && (
          <p className="text-xs text-green-600">{group.recentActivity}</p>
        )}
      </div>

      <div className="flex space-x-2">
        {group.isMember ? (
          <>
            <button
              type="button"
              onClick={() => onLeaveGroup(group.groupId)}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
            >
              Leave Group
            </button>
            <button
              type="button"
              onClick={() => onOpenGroupChat(group.groupId, group.name)}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs flex items-center justify-center space-x-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onJoinGroup(group.groupId)}
            disabled={isFull}
            className={`w-full py-2 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2 ${
              isFull
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isFull ? "Group Full" : "Join Group"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PeerSupportGroupCard;
