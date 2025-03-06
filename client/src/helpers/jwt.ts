import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

const secret = process.env.JWT_SECRET as string

export type signTokenInterface = {
    _id:ObjectId,
}

export function signToken(payload:signTokenInterface) {
    return jwt.sign(payload,secret)
}


export function verifyToken(token:string) {
    return jwt.verify(token,secret)
}


