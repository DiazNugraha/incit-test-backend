export const OauthConfig = () => ({
  facebook: {
    app_id: process.env.FACEBOOK_APP_ID,
    app_secret: process.env.FACEBOOK_APP_SECRET,
    redirect_uri: process.env.FACEBOOK_APP_REDIRECT_URI,
  },
  google: {
    app_id: process.env.GOOGLE_APP_ID,
    app_secret: process.env.GOOGLE_APP_SECRET,
    redirect_uri: process.env.GOOGLE_APP_REDIRECT_URI,
  },
});
