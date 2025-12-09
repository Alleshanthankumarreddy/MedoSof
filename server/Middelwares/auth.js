import jwt from "jsonwebtoken";
import staffModel from "../Models/staffModel.js";
import ownerModel from "../Models/ownerModel.js";
import vendorModel from "../Models/vendorModel.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Try Staff
    try {
      const decoded = jwt.verify(token, "staffJWTsecret");
      const staff = await staffModel.findById(decoded.id);
      if (!staff)
        return res.status(401).json({ success: false, message: "Staff not found" });
      req.user = staff;
      req.role = "staff";
      return next();
    } catch (err) {
      // Not staff, continue to check owner
    }

    try {
      const decoded = jwt.verify(token, "vendorJWTsecret");
      const vendor= await vendorModel.findById(decoded.id);
      if (!vendor)
        return res.status(401).json({ success: false, message: "vendor not found" });
      req.user = vendor;
      req.role = "vendor";
      return next();
    } catch (err) {
      
    }
    // Try Owner
    try {
      const decoded = jwt.verify(token, "ownerJWTsecret");
      const owner = await ownerModel.findById(decoded.id);
      if (!owner)
        return res.status(401).json({ success: false, message: "Owner not found" });
      req.user = owner;
      req.role = "owner";
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication middleware failed",
      error: error.message,
    });
  }
};

export default auth;
