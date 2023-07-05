import { Channel } from './channel';
import { MemberPlan } from './membership-plans';
import { Role } from './enums';
import { Setting } from './setting';

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
  role: Role;
  registrationDate: Date;
  membership: MemberPlan;
  membershipRenewalDate?: Date;
  isProfileDisabled: boolean;
  isMembershipExpired: boolean;
  picture?: string;
  country?: string;
  city?: string;
  watchList?: string[];
  settings?: Setting;
  channels?: Channel[];
}

export interface IName {
  first: string;
  last: string;
}
