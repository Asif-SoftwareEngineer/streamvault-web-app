export interface IVideo {
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

export interface IVideoView {
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
  yourReaction: IReacion;
}

export interface IReacion {
  reactionType: string;
  reactingUserId: string;
}
