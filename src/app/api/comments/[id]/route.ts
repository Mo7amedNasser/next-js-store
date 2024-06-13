import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { updateCommentDTO } from "@/utils/dtos";
import { updateCommentSchema } from "@/utils/validationSchemas";

interface Props {
  params: { id: string }
};

/**
 * @method PUT
 * @route  ~/api/comments/:id
 * @dec    Update A Comment
 * @access private (Only owner of the comment can update his comment)
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    // Fetch the tragetted comment from the database
    const comment = await prisma.comment.findUnique(
      { where: { id: parseInt(params.id) } }
    );

    // Check if this comment is existed
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if the comment is related to the logged in user (AUTHORIZATION by JWT token)
    const user = verifyToken(request);
    if (user === null || user.id !== comment.userId) {
      return NextResponse.json(
        { message: 'You are not allowed to edit a comment that related to another user, access denied' },
        { status: 403 }
      );
    }

    // Get the given data from API
    const body = await request.json() as updateCommentDTO;

    // Validating on the given data (updated comment) by [zod]
    const validation = updateCommentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Storing the given data by API's user
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(params.id) },
      data: { text: body.text }
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};

/**
 * @method DELETE
 * @route  ~/api/comments/:id
 * @dec    Delete A Comment
 * @access private (Only the admin OR the owner of the comment can delete this comment)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Fetch the tragetted comment from the database
    const comment = await prisma.comment.findUnique(
      { where: { id: parseInt(params.id) } }
    );

    // Check if this comment is existed
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    // Authorizing the user by JWT token
    const user = verifyToken(request);

    // Check if there is a token
    if (user === null) {
      return NextResponse.json(
        { message: 'No token provided, access denied' },
        { status: 401 } // (Unauthorized)
      );
    }

    // Check if the user is admin or the user is the owner of the targetted comment
    if (user.isAdmin || user.id === comment.userId) {
      // Deleting the tragetted comment from the database
      await prisma.comment.delete({ where: { id: parseInt(params.id) } });

      return NextResponse.json(
        { message: 'Comment deleted' },
        { status: 200 }
      );
    }

    // If the user wasn't be the admin or the owner of the targetted comment
    return NextResponse.json(
      { message: 'You are not allowed, access denied' },
      { status: 403 } // (Forbidden)
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};
