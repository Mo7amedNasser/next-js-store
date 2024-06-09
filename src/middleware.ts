import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const jwtToken = request.cookies.get("jwtToken");
  const token = jwtToken?.value as string;

  if (!token) {
    return NextResponse.json(
      { message: 'No token provided, access denied, called from middleware' },
      { status: 401 } // (401) Unauthorized
    );
  }
};

export const config = {
  matcher: ["/api/users/profile/:path*"]
};

/*
  Middleware is positioned between client side and server side :
    > It smoothes traffic to the server that calls the database
    > It can protect your routs safely
      -> Because it called before all routes
*/
