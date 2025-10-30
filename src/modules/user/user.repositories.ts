import Profile from '@/modules/profile/profile.models';
import { AccountStatus, ActivityType } from '@/modules/user/user.enums';
import {
  ICreateUserPayload,
  IResetPasswordRepositoryPayload,
  IUserPayload,
  SecurityOverviewData,
  TChangePasswordAndAccountActivation,
  TUpdateUserAccountStatus,
} from '@/modules/user/user.interfaces';
import User, { Activity } from '@/modules/user/user.models';
import mongoose, { startSession } from 'mongoose';

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
  createNewUser: async (payload: ICreateUserPayload) => {
    const session = await startSession();
    session.startTransaction();
    try {
      const newUser = new User({
        ...payload,
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
  retrieveSecurityOverviewData: async (
    userId: string
  ): Promise<SecurityOverviewData> => {
    try {
      const [user, lastLogin] = await Promise.all([
        User.findById(userId, { createdAt: 1, 'password.change_at': 1 }).lean(),
        Activity.findOne(
          {
            user: userId,
            activityType: ActivityType.LOGIN_SUCCESS,
          },
          {
            browser: 1,
            location: 1,
            os: 1,
            createdAt: 1,
          }
        )
          .sort({ createdAt: -1 })
          .lean(),
      ]);
      if (!user) throw new Error('Security Overview Database Operation Failed');
      if (!lastLogin) {
        const lastSignup = await Activity.findOne(
          {
            user: userId,
            activityType: ActivityType.SIGNUP_SUCCESS,
          },
          {
            browser: 1,
            location: 1,
            os: 1,
            createdAt: 1,
          }
        )
          .sort({ createdAt: -1 })
          .lean();
        return {
          accountCreatedAt: user?.createdAt,
          lastPasswordChange: user.password.change_at,
          lastLoginBrowser: lastSignup?.browser,
          lastLoginOs: lastSignup?.os,
          lastLoginLocation: lastSignup?.location,
          lastLoginTime: String(lastSignup?.createdAt),
        };
      }
      return {
        accountCreatedAt: user?.createdAt,
        lastPasswordChange: user.password.change_at,
        lastLoginBrowser: lastLogin.browser,
        lastLoginOs: lastLogin.os,
        lastLoginLocation: lastLogin.location,
        lastLoginTime: String(lastLogin.createdAt),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Security Overview Operation'
        );
      }
    }
  },
  recentActivityDataRetrieve: async (user: string) => {
    try {
      const data = await Activity.find(
        { user },
        { activityType: 1, createdAt: 1, location: 1 }
      )
        .sort({ createdAt: -1 })
        .limit(3);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Recent Activity Data Operation'
        );
      }
    }
  },
  retrieveActivity: async (userId: string) => {
    try {
      const user = new mongoose.Types.ObjectId(userId);
      const data = await Activity.find(
        { user },
        { title: 1, createdAt: 1, location: 1, device: 1 }
      ).sort({ createdAt: -1 });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Retrieve Activity Data Operation'
        );
      }
    }
  },
  retrieveActivityDetails: async (activityId: string) => {
    try {
      const data = await Activity.findById(activityId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Retrieve Activity Details Operation'
        );
      }
    }
  },
};

export default UserRepositories;
