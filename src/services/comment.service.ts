import { BlogList } from '@/services/blog';
import { BadRequestResponse, UnprocessableResponse } from '../utils/ApiResponse';
import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import User, { UserModel } from '@models/users.model';
import { isEmpty } from '@utils/util';
import { ObjectId, Types } from 'mongoose';
import { BlogModel } from '@/models/blog.model';
import Comments, { CommentModel } from '@/models/comment.model';
import { ColumnDefine } from './ColumnDefine';

export default class CommentService {
  static async addComment(blogSlug: string, body: string, user: User): Promise<Comments> {
    const article = await BlogList.findByUrl(blogSlug);

    const comment: Comments = await CommentModel.create({
      author: user,
      body,
      blog: article._id
    });

    await BlogModel.findOneAndUpdate({ blogUrl: blogSlug }, { $push: { comments: comment._id } });

    return comment;
  }

  static async findByBlogUrl(blogSlug: string): Promise<Comments[]> {
    const article = await BlogList.findByUrl(blogSlug);

    const articleId = new Types.ObjectId(article._id);

    const comments = await CommentModel.find({ blog: articleId })
      .populate('author', ColumnDefine.AUTHOR_DETAIL)
      .lean<Comments[]>()
      .exec();

    return comments;
  }

  static async deleteComment(commentId: ObjectId, user: User, articleId: ObjectId): Promise<boolean> {
    await CommentModel.deleteOne({ _id: commentId });
    await BlogModel.updateOne(
      {
        _id: articleId,
      },
      {
        $pull: {
          comments: { author: user, _id: commentId },
        },
      },
    );

    return true;
  }
}
