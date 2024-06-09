import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

// Generate a JWT token to encrypt the user data
export function generateJWT(jwtPayload: JWTPayload): string {
  // Get the JWT private key from .env file
  const privateKey = process.env.JWT_SECRET as string;

  // generate the token and set the time out for 30 days
  const token = jwt.sign(jwtPayload, privateKey, {
    expiresIn: "30d"
  });

  return token;
};

// Set a cookie to store the JWT token
export function setCookie(jwtPayload: JWTPayload) : string {
  // Generate the token from the generateJWT() function
  const token = generateJWT(jwtPayload);

  // Create the cookie
  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // development=http | production=https
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return cookie;
};
