import jwt from 'jsonwebtoken'


export const verifyToken = (req,res , next)=>
{
const token = req.cookies.token;


    if(!token) return res.status(401).json({message: "not authenticated"})

        jwt.verify(token , process.env.JWT_SECRET , async(err , payload)=>{
            

             if(err){
                 res.status(403).json({message : "token is invalid"})
             }

             req.userId = payload.userId;
           

             next();

        })
    }

    // now we can use this middleware in route file