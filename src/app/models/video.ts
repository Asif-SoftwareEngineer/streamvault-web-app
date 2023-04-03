export interface IVideo {
  videoId: string;
  userId: string;
  channelId: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  likes?: string[];
  dislikes?: string[];
  comments?: string[];
  filePath: string;
  duration?: number;
  url?: string;
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
