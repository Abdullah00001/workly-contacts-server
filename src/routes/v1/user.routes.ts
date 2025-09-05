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
  // isUserExist,
  // isUserVerified,
  checkAccessToken,
  checkRefreshToken,
  // checkRecoverOtp,
  // checkR_stp1Token,
  // checkR_stp2Token,
  // checkR_stp3Token,
  otpRateLimiter,
  resendOtpEmailCoolDown,
  checkActivationToken,
  checkIpBlackList,
  checkLoginAttempts,
  checkActiveToken,
  checkChangePasswordPageToken,
  checkSession,
} = UserMiddlewares;
const {
  handleSignUp,
  handleVerifyUser,
  handleLogin,
  handleAccountActivation,
  handleCheck,
  handleRefreshTokens,
  handleLogout,
  handleResend,
  // handleFindUser,
  // handleSentRecoverOtp,
  // handleVerifyRecoverOtp,
  // handleResendRecoverOtp,
  // handleResetPassword,
  // handleCheckR_Stp1,
  // handleCheckR_Stp2,
  // handleCheckR_Stp3,
  handleProcessOAuthCallback,
  handleCheckChangePasswordPageToken,
  handleChangePasswordAndAccountActivation,
} = UserControllers;

const router = Router();

router
  .route('/auth/signup')
  .post(checkIpBlackList, isSignupUserExist, handleSignUp);
router
  .route('/auth/verify')
  .post(
    checkIpBlackList,
    checkActivationToken,
    otpRateLimiter,
    checkOtp,
    handleVerifyUser
  );
router
  .route('/auth/resend')
  .post(
    checkIpBlackList,
    checkActivationToken,
    resendOtpEmailCoolDown,
    handleResend
  );
router
  .route('/auth/login')
  .post(
    checkIpBlackList,
    checkLoginAttempts,
    isUserExistAndVerified,
    checkPassword,
    handleLogin
  );
router
  .route('/auth/active/:uuid')
  .get(checkActiveToken, handleAccountActivation);
router
  .route('/auth/active/check')
  .get(checkChangePasswordPageToken, handleCheckChangePasswordPageToken);
router
  .route('/auth/active/change/:uuid')
  .post(checkChangePasswordPageToken, handleChangePasswordAndAccountActivation);
router.route('/auth/check').post(checkAccessToken, checkSession, handleCheck);
router
  .route('/auth/refresh')
  .post(checkRefreshToken, checkSession, handleRefreshTokens);
router
  .route('/auth/logout')
  .post(checkAccessToken, checkRefreshToken, checkSession, handleLogout);
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

router
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/google/callback').get(
  passport.authenticate('google', {
    failureRedirect: `${CLIENT_BASE_URL}/login?error=user_not_found`,
    session: false,
  }),
  handleProcessOAuthCallback
);

export default router;
