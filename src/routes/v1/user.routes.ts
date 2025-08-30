import { Router } from 'express';
import UserControllers from '@/modules/user/user.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import passport from 'passport';
import { env } from '@/env';

const { CLIENT_BASE_URL } = env;
const {
  isSignupUserExist,
  checkOtp,
  isUserExistAndVerified,
  checkPassword,
  isUserExist,
  isUserVerified,
  checkAccessToken,
  checkRefreshToken,
  checkRecoverOtp,
  checkR_stp1Token,
  checkR_stp2Token,
  checkR_stp3Token,
  otpRateLimiter,
  resendOtpEmailCoolDown,
  checkActivationToken,
} = UserMiddlewares;
const {
  handleSignUp,
  handleVerifyUser,
  // handleLogin,
  // handleCheck,
  // handleRefreshTokens,
  // handleLogout,
  handleResend,
  // handleFindUser,
  // handleSentRecoverOtp,
  // handleVerifyRecoverOtp,
  // handleResendRecoverOtp,
  // handleResetPassword,
  // handleCheckR_Stp1,
  // handleCheckR_Stp2,
  // handleCheckR_Stp3,
  // handleProcessOAuthCallback,
} = UserControllers;

const router = Router();

router.route('/auth/signup').post(isSignupUserExist, handleSignUp);
router
  .route('/auth/verify')
  .post(checkActivationToken, otpRateLimiter, checkOtp, handleVerifyUser);
router
  .route('/auth/resend')
  .post(
    checkActivationToken,
    resendOtpEmailCoolDown,
    handleResend
  );
// router
//   .route('/auth/login')
//   .post(isUserExistAndVerified, checkPassword, handleLogin);
// router.route('/auth/check').post(checkAccessToken, handleCheck);
// // router.route('/auth/refresh').post(checkRefreshToken, handleRefreshTokens);
// router.route('/auth/logout').post(checkRefreshToken, handleLogout);
// router
//   .route('/auth/recover/check/stp1')
//   .post(checkR_stp1Token, handleCheckR_Stp1);
// router
//   .route('/auth/recover/check/stp2')
//   .post(checkR_stp2Token, handleCheckR_Stp2);
// router
//   .route('/auth/recover/check/stp3')
//   .post(checkR_stp3Token, handleCheckR_Stp3);
// router
//   .route('/auth/recover/find')
//   .post(isUserExist, isUserVerified, handleFindUser);
// router
//   .route('/auth/recover/sent-otp')
//   .post(checkR_stp1Token, handleSentRecoverOtp);
// router
//   .route('/auth/recover/verify')
//   .post(checkR_stp2Token, checkRecoverOtp, handleVerifyRecoverOtp);

// router
//   .route('/auth/recover/resent')
//   .post(checkR_stp2Token, handleResendRecoverOtp);

// router
//   .route('/auth/recover/reset')
//   .patch(checkR_stp3Token, handleResetPassword);

// router
//   .route('/auth/google')
//   .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.route('/google/callback').get(
//   passport.authenticate('google', {
//     failureRedirect: `${CLIENT_BASE_URL}/login?error=user_not_found`,
//     session: false,
//   }),
//   handleProcessOAuthCallback
// );

export default router;
