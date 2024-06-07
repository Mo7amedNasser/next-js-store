import { NextRequest, NextResponse } from "next/server";
import { RegisterUserDTO } from "@/app/utils/DTOs";
import { registerSchema } from "@/app/utils/validationSchemas";
import prisma from "@/app/utils/db";
import bcrypt from "bcryptjs";
import { generateJWT } from "@/app/utils/generateToken";
import { JWTPayload } from "@/app/utils/types";

// # The Register Process Is A Form Of Authentication Processes #

/**
 * @method POST
 * @route  ~/api/users/register
 * @dec    Create New User
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUserDTO;

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (user) {
      return NextResponse.json(
        { message: "This user is already registered." },
        { status: 400 }
      );
    }

    // Password encryption before storing it at the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
    });

    // Generate JWT Token
    const jwtPayload: JWTPayload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    };

    const token = generateJWT(jwtPayload);

    return NextResponse.json({ ...newUser, token }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
