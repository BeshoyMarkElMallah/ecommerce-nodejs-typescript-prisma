import { User } from "@prisma/client";
import express from "express";


// declare module 'express' {
//     export interface Request {
//         user : User
//     }
// }

declare global {
    namespace Express {
      export interface Request {
            user?: User
        }
    }
}