import { env } from '@/env';
import { IImage, TImage } from '@/modules/contacts/contacts.interfaces';
import { AuthType } from '@/modules/user/user.enums';
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
        return done(null, createdUser);
      }
      return done(null, user);
    }
  )
);
