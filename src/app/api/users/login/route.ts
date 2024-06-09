import { NextRequest, NextResponse } from "next/server";
import { LoginUserDTO } from "@/utils/DTOs";
import { loginSchema } from "@/utils/validationSchemas";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { setCookie } from "@/utils/generateToken";

// # The Login Process Is A Form Of Authentication Processes #

/**
 * @method POST
 * @route  ~/api/users/login
 * @dec    Login User
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    // Fetch the data from the user (API request)
    const body = (await request.json()) as LoginUserDTO;

    // Validating on the given data by (zod)
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if the user exists in the database by its (email)
    const user = await prisma.user.findUnique(
      { where: { email: body.email } }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password'},
        { status: 400 }
      );
    }

    // Decrypting the stored password and compare it with the given password
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);

    // If the comparison failed
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // call the setCookie() function to create the cookie
    const cookie = setCookie({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });

    return NextResponse.json(
      { message: 'Authenticated' },
      {
        status: 200,
        headers: { "Set-Cookie": cookie }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
