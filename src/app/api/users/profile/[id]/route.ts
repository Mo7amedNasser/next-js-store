import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateUserDTO } from "@/utils/DTOs";
import bcrypt from "bcryptjs";

/*
  # The Delete, Get Profile Process Is A Form Of Authorization Processes #
    > Because only the user who has a auth-token can delete his profile (account)
*/

interface Props {
  params: { id: string };
}

/**
 * @method DELETE
 * @route  ~/api/users/profile/:id
 * @dec    Delete Profile
 * @access private (only users that have a profile can delete their profile by its [JWT token -> Id])
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });

    // Check if the user isn't existed in the database
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    /*
      # The Wrong Way #
      await prisma.user.delete({ where: { id: parseInt(params.id) } });
        > This code gave the permission to any logged in user to delete any profile related to another account in database
    */

    // get the user data from token by verifyToken() function
    const userFromToken = verifyToken(request);

    if (userFromToken !== null && userFromToken.id === user.id) {
      await prisma.user.delete({ where: { id: parseInt(params.id) } });

      return NextResponse.json(
        { message: "Your profile (account) has been deleted" },
        { status: 200 }
      );
    }

    // This return to notice the user that he can't delete the other account's profile
    return NextResponse.json(
      {
        message:
          "Forbidden, Only the user who has logged in can delete his account's profile",
      },
      { status: 403 } // (403) Forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route  ~/api/users/profile/:id
 * @dec    Get Profile By Id
 * @access private (only users that have a profile can get their profile by its [JWT token -> Id])
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true,
      },
    });

    // Check if the user isn't existed in the database
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // get the user data from token by verifyToken() function
    const userFromToken = verifyToken(request);

    if (userFromToken === null || userFromToken.id !== user.id) {
      // This return to notice the user that he can't get a profile that related to another user
      return NextResponse.json(
        {
          message:
            "Forbidden, Only the user who has logged in can get (access) his account's profile",
        },
        { status: 403 } // (403) Forbidden
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route  ~/api/users/profile/:id
 * @dec    Update Profile By Id
 * @access private (only users that have a profile can update their profile by its [JWT token -> Id])
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });

    // Check if the user isn't existed in the database
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // get the user data from token by verifyToken() function
    const userFromToken = verifyToken(request);

    if (userFromToken === null || userFromToken.id !== user.id) {
      // This return to notice the user that he can't update a profile that related to another user
      return NextResponse.json(
        {
          message:
            "Forbidden, Only the user who has logged in can update his account's profile",
        },
        { status: 403 } // (403) Forbidden
      );
    }

    // Fetch the updated data from the API
    const body = (await request.json()) as UpdateUserDTO;

    // If password is updated, I hashed it before storing it in the database by (bcryptjs)
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

    // Appending the updated data that given by the user to the database
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
