import jwt from "jsonwebtoken";
import staffModel from "../Models/staffModel.js";
import vendorModel from "../Models/vendorModel.js";
import ownerModel from "../Models/ownerModel.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const role = req.headers["x-user-role"]; // ✅ role from frontend

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    if (!role) {
      return res.status(401).json({
        success: false,
        message: "Role not provided",
      });
    }

    const token = authHeader.split(" ")[1];

    let secret;
    let model;

    // ✅ Select secret & model based on role
    switch (role) {
      case "owner":
        secret = process.env.OWNER_JWT_SECRET;
        model = ownerModel;
        break;

      case "staff":
        secret = process.env.STAFF_JWT_SECRET;
        model = staffModel;
        break;

      case "vendor":
        secret = process.env.VENDOR_JWT_SECRET;
        model = vendorModel;
        break;

      default:
        return res.status(401).json({
          success: false,
          message: "Invalid role",
        });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, secret);

    const user = await model.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Attach to request
    req.user = user;
    req.role = role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default auth;
