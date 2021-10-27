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
import { ObjectId } from 'mongoose';
import { commentModel } from '@/models/comment.model';

export default class CommentService {
  public users = UserModel;

  async addComment(
    blogSlug: string,
    body: string,
    user: User,
  ): Promise<Comment> {
    const article = await BlogList.findByUrl(blogSlug);
    
    const comment = new commentModel({
      author: user,
      body,
    });

    const newComment: Comment = await comment.save();


    article.comments.push(newComment);
    await (article as ArticleDocument).save();
    await this.pubSub.publish(COMMENT_ADDED_EVENT, {
      commentAdded: newComment,
    });
    return newComment;
  }

  async deleteComment(
    commentId: ObjectId,
    user: User,
    articleId: ObjectId,
  ): Promise<boolean> {
    await this.commentModel.deleteOne({ _id: commentId });
    await this.articleModel.updateOne(
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