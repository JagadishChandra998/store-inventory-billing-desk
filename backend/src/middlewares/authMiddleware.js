import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) =>{
    try{  // the authorization req alwayse bring a bearer. it is noting but the schema of the authorization
        const token = req.header("Authorization");
        // console.log("Authorization Header:", token);

        if(!token){
            return res.status (401).json({
                success:false,
                message:"Access denied . No token provided",
            });
        }
        const jwtToken = token.startsWith("Bearer ") ? token.slice(7) : token;

        const decode = jwt.verify(jwtToken, process.env.jwt_secret);

        req.user = decode;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Invalid or Expired token"
        });
    }
};

export default authMiddleware;