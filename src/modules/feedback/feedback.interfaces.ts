import { Types } from 'mongoose';

interface IFeedBack {
  userEmail: string;
  message: string;
}

export type TProcessCreateFeedBack = {
  message: string;
  userId: string;
};

export default IFeedBack;
