import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";

export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    // Get the token from the cookies
    const jwtToken = request.cookies.get("jwtToken");
    const token = jwtToken?.value as string;

    if (!token) return null;

    // Decrypt the token and get the user data from it
    const privateKey = process.env.JWT_SECRET as string;
    const userPayload = jwt.verify(token, privateKey) as JWTPayload;

    return userPayload;
  } catch (error) {
    return null;
  }
};