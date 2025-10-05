import Profile from '@/modules/profile/profile.models';
import { AccountStatus } from '@/modules/user/user.enums';
import {
  IResetPasswordRepositoryPayload,
  IUserPayload,
  TChangePasswordAndAccountActivation,
  TUpdateUserAccountStatus,
} from '@/modules/user/user.interfaces';
import User from '@/modules/user/user.models';
import { startSession } from 'mongoose';

const UserRepositories = {
  findUserById: async (payload: string) => {
    try {
      const foundedUser = await User.findById(payload);
      if (!foundedUser) {
        throw new Error('Something Went Wrong In Find User By Id Query');
      }
      return foundedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Operation');
      }
    }
  },
  findUserByEmail: async (payload: string) => {
    try {
      const foundedUser = await User.findOne({ email: payload });
      return foundedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Operation');
      }
    }
  },
  createNewUser: async (payload: IUserPayload) => {
    const session = await startSession();
    session.startTransaction();
    try {
      const newUser = new User({
        ...payload,
        avatar: { publicId: null, url: null },
      });
      const newProfile = new Profile({
        user: newUser._id,
        location: { home: null, work: null },
      });
      await newProfile.save({ session });
      await newUser.save({ session });
      await session.commitTransaction();
      session.endSession();
      return newUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Creation Operation');
      }
    }
  },
  verifyUser: async ({ userId }: IUserPayload) => {
    try {
      const verifiedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { isVerified: true } },
        { new: true }
      );
      return verifiedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Verify Operation');
      }
    }
  },
  updateUserAccountStatus: async ({
    userId,
    accountStatus,
    lockedAt,
  }: TUpdateUserAccountStatus) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { accountStatus: { accountStatus, lockedAt } } },
        { new: true }
      );
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Update User Account Status Operation'
        );
      }
    }
  },
  changePasswordAndAccountActivation: async ({
    password,
    userId,
  }: TChangePasswordAndAccountActivation) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            password: { secret: password, change_at: new Date().toISOString() },
            accountStatus: {
              accountStatus: AccountStatus.ACTIVE,
              lockedAt: null,
            },
          },
        },
        { new: true }
      );
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Change Password And Account Activation Operation'
        );
      }
    }
  },
  resetPassword: async ({
    password,
    userId,
  }: IResetPasswordRepositoryPayload) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { password } },
        { new: true }
      );
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Password Reset Operation');
      }
    }
  },
};

export default UserRepositories;
