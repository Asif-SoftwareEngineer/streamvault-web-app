import { Video } from './video';

export interface Channel {
  userId: string;
  channelId: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  name: string;
  description: string;
  category: string;
  handle: string;
  videos?: Video[];
  followers?: string[];
}
