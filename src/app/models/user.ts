import { MembershipType, Role } from './enums';

import { IChannel } from './channel';
import { ISetting } from './setting';

export interface IUser {
  accessCode?: string;
  pichain_uid?: string;
  pichain_username?: string;
  userId?: string;
  streamweb3_username: string;
  email: string;
  country: string;
  city?: string;
  role: Role;
  registration_date?: Date;
  membership_date?: Date;
  membership_Type?: string;
  membership_renewal_date?: Date;
  picture?: string;
  isProfileDisabled: boolean;
  watchList?: string[];
  settings?: ISetting;
  channels?: IChannel[];
}
