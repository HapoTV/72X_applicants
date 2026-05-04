export type StoredCommunityLike = {
  userId: string;
  userName: string;
  createdAt: string;
};

export type StoredCommunityComment = {
  id: string;
  content: string;
  author: string;
  userId: string;
  createdAt: string;
};

const likesKey = (postId: string) => `community_likes_${postId}`;
const commentsKey = (postId: string) => `community_comments_${postId}`;

const readStoredArray = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const getCommunityLikes = (postId: string): StoredCommunityLike[] =>
  readStoredArray<StoredCommunityLike>(likesKey(postId)).filter(
    (like) => typeof like?.userId === 'string' && like.userId.length > 0
  );

export const setCommunityLikes = (postId: string, likes: StoredCommunityLike[]) => {
  localStorage.setItem(likesKey(postId), JSON.stringify(likes));
};

export const getCommunityComments = (postId: string): StoredCommunityComment[] =>
  readStoredArray<StoredCommunityComment | string>(commentsKey(postId))
    .map((comment) => {
      if (typeof comment === 'string') {
        return null;
      }

      return comment;
    })
    .filter(
      (comment): comment is StoredCommunityComment =>
        Boolean(comment?.id && comment.content && comment.userId)
    );

export const setCommunityComments = (
  postId: string,
  comments: StoredCommunityComment[]
) => {
  localStorage.setItem(commentsKey(postId), JSON.stringify(comments));
};

export const getCommunityEngagementCounts = (postId: string) => ({
  likes: getCommunityLikes(postId).length,
  replies: getCommunityComments(postId).length,
});
