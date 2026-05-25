// src/pages/mentorship/PeerSupportGroups.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import { mentorshipService } from "../../services/MentorshipService";
import type {
  PeerSupportGroup,
  PeerSupportGroupFormData,
} from "../../interfaces/MentorshipData";
import PeerSupportGroupFilters from "./components/PeerSupportGroups/PeerSupportGroupFilters";
import PeerSupportGroupsErrorBanner from "./components/PeerSupportGroups/PeerSupportGroupsErrorBanner";
import PeerSupportGroupsList from "./components/PeerSupportGroups/PeerSupportGroupsList";
import CreatePeerSupportGroupModal from "./components/PeerSupportGroups/CreatePeerSupportGroupModal";

const categories = [
  "all",
  "General Business",
  "Women Entrepreneurs",
  "Young Entrepreneurs",
  "Tech Startups",
  "Agriculture",
  "Retail",
  "Manufacturing",
  "Services",
];

interface PeerSupportGroupsProps {
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onOpenGroupChat: (groupId: string, groupName: string) => void;
}

const PeerSupportGroups: React.FC<PeerSupportGroupsProps> = ({
  onJoinGroup,
  onLeaveGroup,
  onOpenGroupChat,
}) => {
  const [groups, setGroups] = useState<PeerSupportGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<PeerSupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState<PeerSupportGroupFormData>({
    name: "",
    description: "",
    category: "General Business",
    location: "",
    maxMembers: 100,
    isPublic: true,
    imageUrl: "",
  });
  const [userId, setUserId] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState(false);

  const extractUserId = (): string | null => {
    try {
      const userDataString = localStorage.getItem("user");
      if (!userDataString) {
        console.log("No user data found in localStorage");
        return null;
      }

      const userData = JSON.parse(userDataString);
      console.log("User data from localStorage:", userData);
      const userId =
        userData.userId || userData.id || userData._id || userData.user_id;

      if (userId) {
        console.log("Extracted user ID:", userId);
        return userId;
      }

      console.warn(
        "No user ID found in user data. Available keys:",
        Object.keys(userData),
      );
      return null;
    } catch (ex) {
      console.error("Error extracting user ID:", ex);
      return null;
    }
  };

  const fetchGroups = useCallback(async () => {
    if (!userId) {
      console.log("No user ID available");
      setLoading(false);
      return;
    }

    console.log("Starting to fetch groups for user:", userId);
    setLoading(true);
    setError(null);

    try {
      const groupsData = await mentorshipService.getPeerSupportGroups(userId);
      console.log("Fetched groups data:", groupsData);

      if (groupsData && Array.isArray(groupsData)) {
        setGroups(groupsData);
      } else {
        console.warn("Received invalid groups data:", groupsData);
        setGroups([]);
      }
    } catch (err: any) {
      console.error("Error fetching groups:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load groups. Please try again later.";
      setError(errorMessage);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const filterGroups = useCallback(() => {
    let filtered = groups;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((group) =>
        group.category?.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (group) =>
          group.name?.toLowerCase().includes(query) ||
          group.description?.toLowerCase().includes(query) ||
          group.category?.toLowerCase().includes(query) ||
          group.location?.toLowerCase().includes(query),
      );
    }

    setFilteredGroups(filtered);
    console.log(
      `Filtered ${filtered.length} groups from ${groups.length} total`,
    );
  }, [groups, searchQuery, selectedCategory]);

  useEffect(() => {
    const extractedUserId = extractUserId();
    if (extractedUserId) {
      setUserId(extractedUserId);
    } else {
      setLoading(false);
      setError("Please login to view groups");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      console.log("User ID available, fetching groups:", userId);
      fetchGroups();
    }
  }, [userId, fetchGroups]);

  useEffect(() => {
    filterGroups();
  }, [filterGroups]);

  const handleOpenGroupChat = (groupId: string, groupName: string) => {
    if (
      !window.confirm(
        "Open group chat? You need to be a member to participate.",
      )
    ) {
      return;
    }

    const group = groups.find((g) => g.groupId === groupId);
    if (group && !group.isMember) {
      alert("You need to join the group first to participate in the chat.");
      return;
    }

    onOpenGroupChat(groupId, groupName);
  };

  const handleSearchGroups = async () => {
    if (!searchQuery.trim()) {
      fetchGroups();
      return;
    }

    if (!userId) {
      alert("Please login to search groups");
      return;
    }

    setSearchLoading(true);
    setError(null);

    try {
      const searchResults = await mentorshipService.searchGroups(
        searchQuery,
        userId,
      );
      setGroups(searchResults);
    } catch (err) {
      console.error("Error searching groups:", err);
      setError("Failed to search groups. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!userId) {
      alert("Please login to create a group");
      return;
    }

    try {
      const createdGroup = await mentorshipService.createPeerGroup(
        newGroup,
        userId,
      );
      setGroups((prev) => [createdGroup, ...prev]);
      setShowCreateModal(false);
      setNewGroup({
        name: "",
        description: "",
        category: "General Business",
        location: "",
        maxMembers: 100,
        isPublic: true,
        imageUrl: "",
      });
      alert(`Group "${newGroup.name}" created successfully!`);
    } catch (err: any) {
      console.error("Error creating group:", err);
      alert(`Failed to create group: ${err.message}`);
    }
  };

  const handleJoinGroupRequest = async (groupId: string) => {
    if (!userId) {
      alert("Please login to join a group");
      return;
    }

    try {
      await mentorshipService.joinPeerGroup(groupId, userId);
      setGroups((prev) =>
        prev.map((group) =>
          group.groupId === groupId
            ? {
                ...group,
                isMember: true,
                memberCount: group.memberCount + 1,
                joinedAt: new Date().toISOString(),
              }
            : group,
        ),
      );
      onJoinGroup(groupId);
      alert("Successfully joined the group!");
    } catch (err: any) {
      console.error("Error joining group:", err);
      alert(`Failed to join group: ${err.message}`);
    }
  };

  const handleLeaveGroupRequest = async (groupId: string) => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    if (!userId) {
      alert("Please login to leave a group");
      return;
    }

    try {
      await mentorshipService.leavePeerGroup(groupId, userId);
      setGroups((prev) =>
        prev.map((group) =>
          group.groupId === groupId
            ? {
                ...group,
                isMember: false,
                memberCount: Math.max(0, group.memberCount - 1),
                joinedAt: undefined,
              }
            : group,
        ),
      );
      onLeaveGroup(groupId);
      alert("Successfully left the group.");
    } catch (err: any) {
      console.error("Error leaving group:", err);
      alert(`Failed to leave group: ${err.message}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchGroups();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Please Login
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            You need to login to view and join peer support groups.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PeerSupportGroupFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categories={categories}
        searchLoading={searchLoading}
        onSearchQueryChange={setSearchQuery}
        onSearchGroups={handleSearchGroups}
        onClearSearch={clearSearch}
        onSelectCategory={setSelectedCategory}
        onOpenCreateModal={() => setShowCreateModal(true)}
      />

      {error && (
        <PeerSupportGroupsErrorBanner error={error} onRetry={fetchGroups} />
      )}

      {!loading && !error && (
        <div className="text-sm text-gray-600">
          Showing {filteredGroups.length} of {groups.length} groups
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </div>
      )}

      <PeerSupportGroupsList
        groups={groups}
        filteredGroups={filteredGroups}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onJoinGroup={handleJoinGroupRequest}
        onLeaveGroup={handleLeaveGroupRequest}
        onOpenGroupChat={handleOpenGroupChat}
        onOpenCreateModal={() => setShowCreateModal(true)}
      />

      <CreatePeerSupportGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newGroup={newGroup}
        categories={categories}
        onUpdateGroup={setNewGroup}
        onCreateGroup={handleCreateGroup}
        disabled={!userId}
      />
    </div>
  );
};

export default PeerSupportGroups;
