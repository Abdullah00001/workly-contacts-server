import { env } from '@/env';
import { IImage, TImage } from '@/modules/contacts/contacts.interfaces';
import { ActivityType, AuthType } from '@/modules/user/user.enums';
import { IUserPayload } from '@/modules/user/user.interfaces';
import UserRepositories from '@/modules/user/user.repositories';
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';

const { CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env;
const { findUserByEmail, createNewUser } = UserRepositories;

/**
 * @strategy GoogleStrategy
 * @description Handles Google login using passport-google-oauth20.
 * - Receives Google profile info after user consents.
 * - Finds existing user by email in DB.
 * - If not found → creates new user with Google profile data.
 * - Calls `done(null, user)` which attaches the user to req.user.
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      passReqToCallback: true,
    },
    async (
      _request: unknown,
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const email = profile.emails?.[0]?.value;
      const user = await findUserByEmail(email as string);
      const avatar: TImage = {
        url: profile.photos?.[0]?.value as string,
        publicId: null,
      };
      const name: string = profile.displayName;
      const googleId: string = profile.id;
      if (!user) {
        const newUser: IUserPayload = {
          avatar: avatar as IImage,
          email,
          password: { secret: null, change_at: null },
          name,
          isVerified: true,
          provider: AuthType.GOOGLE,
          googleId,
        };
        const createdUser = await createNewUser(newUser);
        return done(null, {
          user: createdUser,
          activity: ActivityType.SIGNUP_SUCCESS,
          provider: AuthType.GOOGLE,
        }); // attaches to req.user
      }
      return done(null, {
        user,
        activity: ActivityType.LOGIN_SUCCESS,
        provider: AuthType.GOOGLE,
      }); // attaches to req.user
    }
  )
);
