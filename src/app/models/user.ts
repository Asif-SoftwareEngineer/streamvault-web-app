import { MembershipType, Role } from './enums';

import { IChannel } from './channel';
import { IMemberPlan } from './membership-plans';
import { ISetting } from './setting';

export interface IUser {
  accessCode?: string;
  pichain_uid?: string;
  pichain_username?: string;
  userId?: string;
  name: IName;
  email?: string;
  mobile: string;
  language: string;
  age18Above: boolean;
  role: Role;
  registration_date?: Date;
  membership?: IMemberPlan;
  membership_renewal_date?: Date;
  picture?: string;
  isProfileDisabled: boolean;
  watchList?: string[];
  settings?: ISetting;
  channels?: IChannel[];
  agreeToTerms: boolean;
}

export interface IName {
  first: string;
  last: string;
}
