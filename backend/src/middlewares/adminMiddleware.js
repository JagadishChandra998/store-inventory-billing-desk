
const adminMiddleware = (req, res, next) =>{
    try{
        if (!req.user){
            return res.status(401).json({
                success:false,
                message:"Unauthorized",
            });
        }

        if (req.user.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"Access denied. Admin Only",
            });
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error",
        });
    }
};

export default adminMiddleware;