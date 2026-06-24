// export const host="http://localhost:5000";
export const host="https://server-codebyte.vercel.app";

// user routes

export const registerRoute=`${host}/api/auth/register`;
export const loginRoute=`${host}/api/auth/login`;
export const googleRoute=`${host}/api/auth/googlelogin`;
export const fbRoute=`${host}/api/auth/fblogin`;
export const setAvatarRoute=`${host}/api/auth/setavatar`;
export const allUsersRoute=`${host}/api/auth/getallusers`;
export const matchingUsersRoute=`${host}/api/auth/getmatchingusers`;
export const followRoute=`${host}/api/auth/follow`;
export const followUnfollowRoute=`${host}/api/auth/followunfollow`;
export const getuserRoute=`${host}/api/auth/getuser`;
export const shopRoute=`${host}/api/auth/shop`;
export const getleaderboardRoute=`${host}/api/auth/leaderboard`

// quiz routes

export const createunitRoute=`${host}/api/quiz/createunit`;
export const createquestionRoute=`${host}/api/quiz/createquestion`;
export const getquestionsRoute=`${host}/api/quiz/questions`;
export const getcourseRoute=`${host}/api/quiz/course`;
export const quizsubmitRoute=`${host}/api/quiz/submit`;









