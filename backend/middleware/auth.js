const jwt = require("jsonwebtoken");
const { Creator } = require("../models/Creator");



const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get creator from token (exclude password)
      req.creator = await Creator.findById(decoded.id).select("-password");

      if (!req.creator) {
        return res.status(401).json({ message: "Creator not found" });
      }

      next(); // Continue to the route
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
