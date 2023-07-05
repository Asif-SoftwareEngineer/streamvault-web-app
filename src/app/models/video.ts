export interface Video {
  videoId: string;
  userId: string;
  channelId: string;
  title: string;
  description: string;
  category: string;
  likes?: string[];
  dislikes?: string[];
  comments?: string[];
  duration?: number;
  videoPathUrl?: string;
  thumbnailImageUrl?: string;
  audience: string;
  visibilty: string;
  commentsPreference: string;
  language: string;
  location: string;
}

export interface VideoView {
  videoId: string;
  userId: string;
  channelId: string;
  userName: string;
  channelName: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  likes: number;
  dislikes: number;
  comments: string;
  yourReaction: Reacion;
}

export interface Reacion {
  reactionType: string;
  reactingUserId: string;
}
