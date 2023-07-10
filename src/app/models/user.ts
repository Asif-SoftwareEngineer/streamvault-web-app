import { Channel } from './channel';
import { MemberPlan } from './membership-plans';
import { Role } from './enums';
import { Setting } from './setting';

export interface User {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  language: string;
  age18Above: boolean;
  agreeToTerms: boolean;
  role: Role;
  registrationDate: Date;
  membership: MemberPlan;
  membershipRenewalDate?: Date;
  isVerified: boolean;
  piUserId?: string;
  piUserName?: string;
  userId?: string;
  country?: string;
  city?: string;
  picture?: string;
  isProfileDisabled: boolean;
  isMembershipExpired: boolean;
  watchList?: string[];
  settings?: Setting;
  channels?: Channel[];
}
