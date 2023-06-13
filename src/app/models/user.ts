import { MembershipType, Role } from './enums';

import { IChannel } from './channel';
import { IMemberPlan } from './membership-plans';
import { ISetting } from './setting';

export interface IUser {
  piUserId?: string;
  piUserName?: string;
  userId?: string;

  userName: string;
  name: IName;
  email: string;
  mobile: string;
  language: string;
  age18Above: boolean;
  agreeToTerms: boolean;
  country?: string;
  city?: string;
  role: Role;
  registrationDate: Date;
  membership: IMemberPlan;
  membershipRenewalDate?: Date;
  picture?: string;
  isProfileDisabled: boolean;
  isMembershipExpired: boolean;
  watchList?: string[];
  settings?: ISetting;
  channels?: IChannel[];
}

export interface IName {
  first: string;
  last: string;
}
