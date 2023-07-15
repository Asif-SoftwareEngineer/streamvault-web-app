import { VideoPublishStage, VideoUploadStatus } from './enums';

export interface Video {
  videoId: string;
  userId: string;
  channelId: string;
  title: string;
  description: string;
  category: string;
  reactions: Reaction[];
  comments?: string[];
  duration?: number;
  videoPathUrl?: string;
  thumbnailImageUrl?: string;
  audience: string;
  visibility: string;
  commentsPreference: string;
  language: string;
  location: string;
  publishStage: VideoPublishStage;
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
  channelProfileImage: string;
  comments: string;
  reactions: Reaction[];
}

export interface Reaction {
  reactionType: string;
  reactingUserId: string;
}
