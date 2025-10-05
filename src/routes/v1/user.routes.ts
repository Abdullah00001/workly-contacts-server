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
  checkIpBlackList,
  checkLoginAttempts,
  checkActiveToken,
  checkChangePasswordPageToken,
  checkSession,
  checkSessionsLimit,
  checkClearDevicePageToken,
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
  handleCheckResendStatus,
  handleCheckClearDevicePageToken,
  handleFindUser,
  handleSentRecoverOtp,
  handleVerifyRecoverOtp,
  handleResendRecoverOtp,
  handleResetPassword,
  handleCheckR_Stp1,
  handleCheckR_Stp2,
  handleCheckR_Stp3,
  handleProcessOAuthCallback,
  handleCheckChangePasswordPageToken,
  handleChangePasswordAndAccountActivation,
  handleCheckActivationTokenValidity,
  handleRetrieveSessionsForClearDevice,
  handleClearDeviceAndLogin,
  handleRecoverUserInfo,
} = UserControllers;

const router = Router();

// Signup Route
router
  .route('/auth/signup')
  .post(checkIpBlackList, isSignupUserExist, handleSignUp);
// Verify Email Page Protection Endpoint
router
  .route('/auth/verify/check')
  .get(checkActivationToken, handleCheckActivationTokenValidity);
// Verify User Signup User Email With Otp Route
router
  .route('/auth/verify')
  .post(checkActivationToken, otpRateLimiter, checkOtp, handleVerifyUser);
// Resend Otp For Signup User Email Route
router
  .route('/auth/resend')
  .post(checkActivationToken, resendOtpEmailCoolDown, handleResend);
// check resend otp timer for sync with client
router
  .route('/auth/resend/status')
  .get(checkActivationToken, handleCheckResendStatus);
// Login Route
router
  .route('/auth/login')
  .post(
    checkIpBlackList,
    checkLoginAttempts,
    isUserExistAndVerified,
    checkPassword,
    checkSessionsLimit,
    handleLogin
  );
// clear device page token check
router
  .route('/auth/check-clear-device')
  .get(checkClearDevicePageToken, handleCheckClearDevicePageToken);
// Retrieve Sessions For Clear Device
router
  .route('/auth/clear-device/sessions')
  .get(checkClearDevicePageToken, handleRetrieveSessionsForClearDevice);
// clear device and login
router
  .route('/auth/clear-device')
  .post(checkClearDevicePageToken, handleClearDeviceAndLogin);
// Check Is User Authenticate Or Not Using AccessToken Route
router.route('/auth/check').get(checkAccessToken, checkSession, handleCheck);
// Refresh User AccessToken Based On RefreshToken And Session
router
  .route('/auth/refresh')
  .post(checkRefreshToken, checkSession, handleRefreshTokens);
// Logout Route
router.route('/auth/logout').post(checkAccessToken, checkSession, handleLogout);
router
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/google/callback').get(
  passport.authenticate('google', {
    failureRedirect: `${CLIENT_BASE_URL}/login?error=user_not_found`,
    session: false,
  }),
  checkSessionsLimit,
  handleProcessOAuthCallback
);

// These Routes Are For Account Unlock
router
  .route('/auth/active/:uuid')
  .get(checkActiveToken, handleAccountActivation);
router
  .route('/auth/active/check')
  .get(checkChangePasswordPageToken, handleCheckChangePasswordPageToken);
router
  .route('/auth/active/change/:uuid')
  .post(checkChangePasswordPageToken, handleChangePasswordAndAccountActivation);

router
  .route('/auth/recover/check/stp1')
  .get(checkR_stp1Token, handleCheckR_Stp1);

router
  .route('/auth/recover/check/stp2')
  .get(checkR_stp2Token, handleCheckR_Stp2);
router
  .route('/auth/recover/check/stp3')
  .get(checkR_stp3Token, handleCheckR_Stp3);
router
  .route('/auth/recover/find')
  .post(isUserExist, isUserVerified, handleFindUser);
router.route('/auth/recover/user').get(checkR_stp1Token, handleRecoverUserInfo);
router
  .route('/auth/recover/sent-otp')
  .post(checkR_stp1Token, handleSentRecoverOtp);
router
  .route('/auth/recover/verify')
  .post(
    checkR_stp2Token,
    otpRateLimiter,
    checkRecoverOtp,
    handleVerifyRecoverOtp
  );

router
  .route('/auth/recover/resend')
  .post(checkR_stp2Token, resendOtpEmailCoolDown, handleResendRecoverOtp);

router
  .route('/auth/recover/resend/status')
  .get(checkR_stp2Token, handleCheckResendStatus);

router
  .route('/auth/recover/reset')
  .patch(checkR_stp3Token, handleResetPassword);

export default router;
