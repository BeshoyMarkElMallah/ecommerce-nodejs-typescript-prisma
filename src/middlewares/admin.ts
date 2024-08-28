import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";


const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   const user = (req as any).user;
    if(user?.role == 'ADMIN'){
        next();
    }else{
        next(new UnauthorizedException("UnAuthorized", ErrorCodes.UNAUTHORIZED));
    }

}

export default adminMiddleware;