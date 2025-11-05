import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import { ActivityType, AuthType } from '@/modules/user/user.enums';
import { IUser } from '@/modules/user/user.interfaces';

export type TRequestUser = {
  user: IUser;
  activity?: ActivityType;
  provider: AuthType;
};

declare global {
  namespace Express {
    interface Request {
      user: TRequestUser | string;
      decoded: TokenPayload;
      availableAt: number;
    }
  }
}
