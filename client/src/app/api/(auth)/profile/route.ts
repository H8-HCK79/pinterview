import UserModel from "@/db/models/users";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function GET(req:NextRequest) {
    try {
        const id = req.headers.get("x-user-id") as string;
        const user= await UserModel.UserById(id)

        return user
    } catch (error:unknown) {
        if(error instanceof ZodError) {
            return Response.json({message:'Unauthorized'}, {status:401})
        } else {
            return Response.json({message:'Internal server error'}, {status:500})
        }
    }
}