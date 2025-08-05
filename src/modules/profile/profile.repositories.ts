import { IImage } from '@/modules/contacts/contacts.interfaces';
import Contacts from '@/modules/contacts/contacts.models';
import IProfile, {
  IGetProfileData,
  IGetProfilePayload,
  IProfilePayload,
  IProfileProjection,
} from '@/modules/profile/profile.interfaces';
import Profile from '@/modules/profile/profile.models';
import IUser from '@/modules/user/user.interfaces';
import User from '@/modules/user/user.models';
import mongoose, { startSession } from 'mongoose';

const ProfileRepositories = {
  updateProfile: async ({
    bio,
    dateOfBirth,
    location,
    user,
    name,
    phone,
    avatar,
    gender,
  }: IProfilePayload) => {
    try {
      if (bio || dateOfBirth || location || gender) {
        const updatePayload: Partial<IProfile> = {};
        if (bio !== undefined) updatePayload.bio = bio;
        if (dateOfBirth !== undefined) updatePayload.dateOfBirth = dateOfBirth;
        if (location !== undefined) updatePayload.location = location;
        if (gender !== undefined) updatePayload.gender = gender;
        const projection: Record<string, 0 | 1> = { _id: 0 };
        for (const key of Object.keys(updatePayload)) {
          projection[key] = 1;
        }
        const result = await Profile.findOneAndUpdate(
          { user },
          {
            $set: updatePayload,
          },
          { new: true, projection }
        );
        const data = result?.toObject?.();
        delete data?._id;
        return data;
      } else {
        const updatePayload: Partial<IUser> = {};
        if (name !== undefined) updatePayload.name = name;
        if (phone !== undefined) updatePayload.phone = phone;
        if (avatar !== undefined) updatePayload.avatar = avatar as IImage;
        const projection: Record<string, 0 | 1> = { _id: 0 };
        for (const key of Object.keys(updatePayload)) {
          projection[key] = 1;
        }
        const result = await User.findOneAndUpdate(
          { _id: user },
          {
            $set: updatePayload,
          },
          { new: true, projection }
        );
        const data = result?.toObject?.();
        delete data?._id;
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Update Profile Query');
      }
    }
  },
  getProfile: async ({ user, query }: IGetProfilePayload) => {
    const objectUserId = new mongoose.Types.ObjectId(user);
    try {
      if (query && Object.keys(query).length > 0) {
        const profileData = await User.aggregate([
          { $match: { _id: objectUserId } },
          {
            $lookup: {
              from: 'profiles',
              localField: '_id',
              foreignField: 'user',
              as: 'profile',
            },
          },
          {
            $unwind: {
              path: '$profile',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: query,
          },
        ]);

        const { avatar, email, name, phone, dateOfBirth, gender, location } = {
          ...profileData[0],
        } as IGetProfileData;
        return { avatar, email, name, phone, dateOfBirth, gender, location };
      } else {
        const profileData = await User.aggregate([
          { $match: { _id: objectUserId } },
          {
            $lookup: {
              from: 'profiles',
              localField: '_id',
              foreignField: 'user',
              as: 'profile',
            },
          },
          {
            $unwind: {
              path: '$profile',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 0,
              name: 1,
              avatar: 1,
              phone: 1,
              email: 1,
              location: '$profile.location',
              dateOfBirth: '$profile.dateOfBirth',
              gender: '$profile.gender',
            },
          },
        ]);

        const { avatar, email, name, phone, location, dateOfBirth, gender } = {
          ...profileData[0],
        } as IGetProfileData;
        return { avatar, email, name, phone, location, dateOfBirth, gender };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Profile Query');
      }
    }
  },
  changePassword: async ({ user, password }: IProfilePayload) => {
    try {
      await User.findOneAndUpdate({ _id: user }, { $set: { password } });
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Change Password Query');
      }
    }
  },
  deleteAccount: async ({ user }: IProfilePayload) => {
    const session = await startSession();
    session.startTransaction();
    try {
      await User.findByIdAndDelete(user, { session });
      await Profile.findOneAndDelete({ user }, { session });
      await Contacts.deleteMany({ userId: user }, { session });
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Delete Account Query');
      }
    }
  },
};

export default ProfileRepositories;
