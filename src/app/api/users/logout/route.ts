import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @method GET
 * @route  ~/api/users/logout
 * @dec    Logout User
 * @access public
 */
export function GET(request: NextRequest) {
  try {
    // Delete the cookie that storing the user token
    cookies().delete("jwtToken");

    return NextResponse.json(
      { message: "User Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
