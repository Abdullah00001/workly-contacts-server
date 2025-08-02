import { IImage } from '@/modules/contacts/contacts.interfaces';
import { AuthType } from '@/modules/user/user.enums';
import { Document, Types } from 'mongoose';

export interface IPassword {
  secret: string;
  change_at: string;
}

export type TPassword = {
  secret: string | null;
  change_at: string | null;
};
interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: IPassword;
  isVerified: boolean;
  avatar: IImage;
  provider: AuthType;
  googleId: string;
}

export interface IUserPayload {
  name?: string;
  email?: string;
  password?: TPassword;
  isVerified?: boolean;
  avatar?: IImage;
  userId?: Types.ObjectId;
  phone?: string;
  otp?: string;
  accessToken?: string;
  refreshToken?: string;
  provider?: AuthType;
  googleId?: string;
}

export interface IProcessFindUserReturn {
  r_stp1?: string;
  r_stp2?: string;
  r_stp3?: string;
}

export interface IProcessRecoverAccountPayload {
  userId: Types.ObjectId;
  email: string;
  isVerified?: boolean;
  name: string;
  avatar?: IImage;
  r_stp1?: string;
  r_stp2?: string;
  r_stp3?: string;
  rs_id?: string;
  password?: IPassword;
}

export interface IResetPasswordRepositoryPayload {
  password: IPassword;
  userId: Types.ObjectId;
}

export interface IResetPasswordServicePayload {
  userId: Types.ObjectId;
  email: string;
  password: IPassword;
  r_stp3: string;
  location: string;
  device: string;
  ipAddress: string;
  name: string;
  isVerified: boolean;
}

export interface IResetPasswordServiceReturnPayload {
  accessToken: string;
  refreshToken: string;
}

export interface IResetPasswordSendEmailPayload {
  email: string;
  location: string;
  device: string;
  ipAddress: string;
  name: string;
}

export interface IPasswordResetNotificationTemplateData {
  supportEmail: string;
  dashboardUrl: string;
  profileUrl: string;
  location: string;
  device: string;
  ipAddress: string;
  resetDateTime: string;
  name: string;
}

export default IUser;
