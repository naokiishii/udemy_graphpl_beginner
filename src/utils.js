const jwt = require("jsonwebtoken");
APP_SECRET = "Graphql";

// decrypt token
function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

// get user id
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer", "");
      if (!token) {
        throw new Error("Token not found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    } else if (authToken) {
      const { userId } = getTokenPayload(authToken);
      return userId;
    }
    throw new Error("Permission Denied");
  }
}

module.exports = {
  APP_SECRET,
  getUserId,
};
