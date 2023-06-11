/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: string
 *       enum: [none, clerk, cashier, manager]
 */
export enum Role {
  None = 'none',
  Member = 'member',
  User = 'user',
  Visitor = 'visitor',
  Admin = 'admin',
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneType:
 *       type: string
 *       enum: [none, mobile, home, work]
 */
export enum PhoneType {
  None = 'none',
  Mobile = 'mobile',
  Home = 'home',
  Work = 'work',
}

export enum LanguageType {
  English = 'english',
  Arabic = 'arabic',
  Spanish = 'spanish',
  French = 'french',
  Russian = 'russian',
  Urdu = 'urdu',
  Hindi = 'hindi',
  German = 'german',
}

export enum PaymentMode {
  CryptoCurrency = 'crypto',
  Paypal = 'paypal',
  DebitCard = 'debit-card',
  CreditCard = 'credit-card',
  OnlineBank = 'bank-online',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum MembershipType {
  Free = 'free',
  Monthly = 'monthly',
  Annually = 'yearly',
}
