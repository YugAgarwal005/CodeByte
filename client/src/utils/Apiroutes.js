export const host=window.location.origin;

// user routes

export const registerRoute=`${host}/api/auth/register`;
export const loginRoute=`${host}/api/auth/login`;
export const googleRoute=`${host}/api/auth/googlelogin`;
export const refreshTokenRoute=`${host}/api/auth/refreshtoken`;
export const setAvatarRoute=`${host}/api/auth/setavatar`;
export const allUsersRoute=`${host}/api/auth/getallusers`;
export const matchingUsersRoute=`${host}/api/auth/getmatchingusers`;
export const followRoute=`${host}/api/auth/follow`;
export const followUnfollowRoute=`${host}/api/auth/followunfollow`;
export const getuserRoute=`${host}/api/auth/getuser`;
export const getleaderboardRoute=`${host}/api/auth/leaderboard`;
export const updateUsernameRoute=`${host}/api/auth/updateusername`;
export const claimQuestRoute=`${host}/api/auth/claimquest`;

// quiz routes

export const createunitRoute=`${host}/api/quiz/createunit`;
export const createquestionRoute=`${host}/api/quiz/createquestion`;
export const getquestionsRoute=`${host}/api/quiz/questions`;
export const getcourseRoute=`${host}/api/quiz/course`;
export const quizsubmitRoute=`${host}/api/quiz/submit`;

// ── Judge / online-judge routes ───────────────────────────────────────────────
export const problemsRoute     = `${host}/api/problems`;         // GET list
export const problemRoute      = `${host}/api/problems`;         // GET /:slug
export const submissionsRoute  = `${host}/api/submissions`;      // POST (create)
export const mySubmissionsRoute= `${host}/api/submissions/me`;   // GET history
export const problemSubmissionsRoute = (slug) => `${host}/api/submissions/problem/${slug}`;
export const checkSolvedRoute  = (slug) => `${host}/api/submissions/check/${slug}`;  // GET has AC?
export const setExerciseRoute  = `${host}/api/quiz/setexercise`;                     // POST (admin)

