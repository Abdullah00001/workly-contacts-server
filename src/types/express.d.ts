import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import { ActivityType } from '@/modules/user/user.enums';
import { IUser } from '@/modules/user/user.interfaces';

export type TRequestUser = { user: IUser; activity?: ActivityType };

declare global {
  namespace Express {
    interface Request {
      user: TRequestUser | string;
      decoded: TokenPayload;
      availableAt: number;
    }
  }
}
