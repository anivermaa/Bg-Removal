
import jwt from 'jsonwebtoken';

// Middleware to authenticate requests using JWT
const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    const token_decode = jwt.decode(token);
    if (!token_decode?.clerkId) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    req.user = { clerkId: token_decode.clerkId }; // ✅ safer place than req.body
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;

