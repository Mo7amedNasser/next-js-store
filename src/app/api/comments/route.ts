import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { createCommentDTO } from "@/utils/dtos";
import { createCommentSchema } from "@/utils/validationSchemas";

/**
 * @method POST
 * @route  ~/api/comments
 * @dec    Create New Comment
 * @access private (Only logged in user can create a comment)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if the user had an account by checking his JWT token & if he had a account, get his payload (data)
    const user = verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { message: "Only logged in user can create comments, access denied" },
        { status: 401 } // (401) Unauthorized -> No token existed
      );
    }

    // Getting the comment from the API request
    const body = (await request.json()) as createCommentDTO;

    // Validating on the given data (comment) by [zod]
    const validation = createCommentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 } // (400) Bad request
      );
    }

    // Create the comment by storing it in the database
    const newComment = await prisma.comment.create({
      data: {
        text: body.text,
        productId: body.productId,
        userId: user.id, // Get the user id from the registered user token
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route  ~/api/comments
 * @dec    Get All Comment
 * @access private (Only admin can get all comments)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if the user had an account by checking his JWT token & check his permission -> if he is an admin
    const user = verifyToken(request);

    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Only admin can get all comments, access denied" },
        { status: 403 } // (403) Forbidden -> Isn't an admin
      );
    }

    // Get all comments from database, If he is an admin
    const comments = await prisma.comment.findMany();

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
