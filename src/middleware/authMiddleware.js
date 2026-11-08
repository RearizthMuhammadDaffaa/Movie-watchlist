import jwt from "jsonwebtoken"
import { prisma } from "../config/db.js";


// read the token from the request
// check if token is valid
export const authMiddleware = (allowedRoles = ['USER']) => async (req,res,next) => {
  console.log("auth middleware reached");
 let token;

 if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
  token = req.headers.authorization.split(" ")[1]
 } else if (req.cookies?.jwt){
  token = req.cookies.jwt
 }

  if (!token) {
    return res.status(401).json({error : "Not Authorizated token provided"})
  }

   try {
    // verify token and extract the user id

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where:{id : decoded.id}
    });
    
    if (!user){
      return res.status(401).json({error : "User Not Longer exist"})
    }

     // Cek apakah user memiliki role yang diperlukan
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden - insufficient permissions' });
    }

    req.user = user
    console.log("User Role: ",user.role);
    next()
  } catch (error) {
    return res.status(401).json({error : "Not Authorized token filed"})
  }



}