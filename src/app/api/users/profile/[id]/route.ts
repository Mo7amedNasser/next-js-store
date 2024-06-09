import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import jwt from "jsonwebtoken";
import { JWTPayload } from "@/utils/types";
import { verifyToken } from "@/utils/verifyToken";

/*
  # The Delete Profile Process Is A Form Of Authorization Processes #
    > Because only the user who has a auth-token can delete his profile (account)
*/

interface Props {
  params: { id: string }
};

/**
 * @method DELETE
 * @route  ~/api/users/profile/:id
 * @dec    Delete Profile
 * @access private (only users that have a profile can delete their profile by its [JWT token])
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({ where: {id: parseInt(params.id)} });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
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
        { message: 'Your profile (account) has been deleted' },
        { status: 200 }
      );
    }

    // This return to notice the user that he can't delete the other account's profile
    return NextResponse.json(
      { message: 'Forbidden, Only the user who has logged in can delete his account' },
      { status: 403 } // (403) Forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};
