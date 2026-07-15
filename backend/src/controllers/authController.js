const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const allowedRoles = require("../config/constants");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

// ---- Constants ----
const REFRESH_TOKEN_LIFETIME = 15 * 24 * 60 * 60 * 1000; // 15 days
const MAX_SESSIONS = 5;

// ---- Errors ----
class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ---- Cookie config ----
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_LIFETIME,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

// ---- Helpers ----

const buildAuthResponse = (user, accessToken) => ({
  id: user._id,
  email: user.email,
  role: user.role,
  accessToken,
});

/**
 * Creates a new session (access + refresh token pair) for a user.
 *
 * By default, pushes a new hashed refresh token onto the user's
 * refreshTokens array (evicting the oldest if MAX_SESSIONS is reached).
 *
 * If `replaceIndex` is provided (used during token rotation on /refresh),
 * the hash at that index is replaced in place instead of appending +
 * evicting — this keeps the "rotate this specific session" logic in one place.
 */
const createSession = async (user, res, { replaceIndex } = {}) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  if (typeof replaceIndex === "number" && replaceIndex !== -1) {
    // Rotation: swap out the old hash for the new one at the same slot.
    user.refreshTokens.splice(replaceIndex, 1, hashedRefreshToken);
  } else {
    // New session (register/login): append, evicting oldest if at capacity.
    if (user.refreshTokens.length >= MAX_SESSIONS) {
      user.refreshTokens.shift();
    }
    user.refreshTokens.push(hashedRefreshToken);
  }

  await user.save();

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return accessToken;
};

/**
 * Verifies an incoming refresh token, finds the owning user, and locates
 * which stored hash it matches. Throws AuthError on any failure.
 */
const findRefreshSession = async (incomingRefreshToken) => {
  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  // No .select("-password") here — this function returns a document meant
  // to be mutated and saved (createSession pushes/splices refreshTokens).
  // Keeping it a full document avoids "partial document" surprises for
  // future code that touches this user. Password never leaves this file:
  // buildAuthResponse() only ever returns id/email/role/accessToken.
  const user = await User.findById(decoded.id);
  if (!user) throw new AuthError("User no longer exists");

  const matches = await Promise.all(
    user.refreshTokens.map((hash) =>
      bcrypt.compare(incomingRefreshToken, hash),
    ),
  );
  const matchIndex = matches.findIndex(Boolean);
  if (matchIndex === -1) throw new AuthError("Invalid refresh token");

  return { user, matchIndex };
};

// ---- Controllers ----

const getUser = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role)
      return res
        .status(400)
        .json({ success: false, message: "Fill in all inputs" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });

    if (!allowedRoles.ROLES.includes(role))
      return res
        .status(400)
        .json({ success: false, message: "Select one of the available roles" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, message: "Email already signed up" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      refreshTokens: [],
    });

    const accessToken = await createSession(newUser, res);

    res.status(201).json({
      success: true,
      data: buildAuthResponse(newUser, accessToken),
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Fill in all inputs" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });

    if (!(await bcrypt.compare(password, user.password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });

    const accessToken = await createSession(user, res);

    res.status(200).json({
      success: true,
      data: buildAuthResponse(user, accessToken),
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken)
    return res.status(401).json({ success: false, message: "Not authorized" });

  try {
    const { user, matchIndex } = await findRefreshSession(incomingRefreshToken);

    // Rotate in place: same helper, same slot, no manual splice out here.
    const accessToken = await createSession(user, res, {
      replaceIndex: matchIndex,
    });

    res.status(200).json({
      success: true,
      data: buildAuthResponse(user, accessToken),
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken", clearCookieOptions);
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken)
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });

  try {
    const { user, matchIndex } = await findRefreshSession(incomingRefreshToken);

    user.refreshTokens.splice(matchIndex, 1); // remove this session's hash
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    const isExpectedAuthError =
      error instanceof AuthError ||
      ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(
        error.name,
      );

    if (isExpectedAuthError) {
      // Token was bad/expired/already rotated — user is logged out either
      // way, so this isn't worth a log line. If we ever want to catch abuse
      // patterns (e.g. repeated invalid logout attempts from one IP), that
      // belongs in dedicated rate-limiting/metrics middleware, not here.
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }

    // Genuine system failure (DB down, etc.) — this one is worth surfacing.
    console.error("Critical Logout Failure:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during logout",
    });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};

// const User = require("../models/User");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const allowedRoles = require("../config/constants");
// const jwt = require("jsonwebtoken");
// const generateAccessToken = require("../utils/generateAccessToken");
// const generateRefreshToken = require("../utils/generateRefreshToken");
// const REFRESH_TOKEN_LIFETIME = 15 * 24 * 60 * 60 * 1000;

// class AuthError extends Error {
//   constructor(message, statusCode = 401) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }

// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "lax",
//   maxAge: REFRESH_TOKEN_LIFETIME,
// };

// const clearCookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "lax",
// };

// const buildAuthResponse = (user, accessToken) => ({
//   id: user._id,
//   email: user.email,
//   role: user.role,
//   accessToken,
// });

// const createSession = async (user, res) => {
//   const accessToken = generateAccessToken(user._id, user.role);
//   const refreshToken = generateRefreshToken(user._id);
//   const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

//   user.refreshTokens.push(hashedRefreshToken);
//   await user.save();

//   res.cookie("refreshToken", refreshToken, cookieOptions);

//   return accessToken;
// };

// const findRefreshSession = async (incomingRefreshToken) => {
//   const decoded = jwt.verify(
//     incomingRefreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//   );
//   const user = await User.findById(decoded.id).select("-password");
//   if (!user) throw new AuthError("User no longer exists");

//   const matches = await Promise.all(
//     user.refreshTokens.map((hash) =>
//       bcrypt.compare(incomingRefreshToken, hash),
//     ),
//   );
//   const matchIndex = matches.findIndex(Boolean);
//   if (matchIndex === -1) throw new AuthError("Invalid refresh token");

//   return { user, matchIndex };
// };

// const getUser = async (req, res) => {
//   res.status(200).json({ success: true, data: req.user });
// };

// const registerUser = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     if (!email || !password || !role)
//       return res
//         .status(400)
//         .json({ success: false, message: "Fill in all inputs" });

//     if (!validator.isEmail(email))
//       return res
//         .status(400)
//         .json({ success: false, message: "Enter a valid email" });

//     if (!allowedRoles.ROLES.includes(role))
//       return res
//         .status(400)
//         .json({ success: false, message: "Select one of the available roles" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res
//         .status(409)
//         .json({ success: false, message: "Email already signed up" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       role,
//       refreshTokens: [],
//     });

//     const accessToken = await createSession(newUser, res);

//     res.status(201).json({
//       success: true,
//       data: buildAuthResponse(newUser, accessToken),
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password)
//       return res
//         .status(400)
//         .json({ success: false, message: "Fill in all inputs" });
//     if (!validator.isEmail(email))
//       return res
//         .status(400)
//         .json({ success: false, message: "Enter a valid email" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid Credentials" });

//     if (!(await bcrypt.compare(password, user.password)))
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid Credentials" });

//     const accessToken = await createSession(user, res);

//     res.status(200).json({
//       success: true,
//       data: buildAuthResponse(user, accessToken),
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const refreshToken = async (req, res) => {
//   const incomingRefreshToken = req.cookies.refreshToken;
//   if (!incomingRefreshToken)
//     return res.status(401).json({ success: false, message: "Not authorized" });

//   try {
//     const { user, matchIndex } = await findRefreshSession(incomingRefreshToken);
//     user.refreshTokens.splice(matchIndex, 1); // remove old hash

//     const accessToken = await createSession(user, res);

//     res.status(200).json({
//       success: true,
//       data: buildAuthResponse(user, accessToken),
//     });
//   } catch (error) {
//     return res.status(error.statusCode || 401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const logoutUser = async (req, res) => {
//   res.clearCookie("refreshToken", clearCookieOptions);
//   const incomingRefreshToken = req.cookies.refreshToken;
//   if (!incomingRefreshToken)
//     return res
//       .status(200)
//       .json({ success: true, message: "Logged out successfully" });

//   try {
//     const { user, matchIndex } = await findRefreshSession(incomingRefreshToken);

//     user.refreshTokens.splice(matchIndex, 1); // remove old hash
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     const isExpectedAuthError =
//       error instanceof AuthError ||
//       error.name === "JsonWebTokenError" ||
//       error.name === "TokenExpiredError";

//     if (isExpectedAuthError) {
//       // Log it internally for debugging/telemetry, but return success to the user
//       console.warn(
//         "Logout DB cleanup bypassed (expected auth error):",
//         error.message,
//       );

//       return res.status(200).json({
//         success: true,
//         message: "Logged out successfully",
//       });
//     }

//     // 6. Otherwise, it is a genuine system failure (e.g., DB crash, network timeout) -> Return 500
//     console.error("Critical Logout Failure:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An internal server error occurred during logout",
//     });
//   }
// };
