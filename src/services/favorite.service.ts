import { BlogList } from '@/services/blog';
import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import User, { UserModel } from '@models/users.model';
import { isEmpty } from '@utils/util';
import { ObjectId, Types } from 'mongoose';
import Blog, { BlogModel } from '@/models/blog.model';
import Comments, { CommentModel } from '@/models/comment.model';
import { ColumnDefine } from './ColumnDefine';
import { BadRequestError } from '@/utils/ApiError';

export default class FavoriteService {
  static async addArticleToFavorite(blogSlug: string, user: User): Promise<Blog> {
    const article = await BlogList.findByUrl(blogSlug);

    if (!article) {
      throw new BadRequestError("not found");
    }

    const blog: Blog = await BlogModel.findOneAndUpdate({ blogUrl: blogSlug }, { $push: { favoritedUsers: user._id } }).lean<Blog>();

    return blog;
  }

  static async deleteArticleFromFavorite(blogSlug: string, user: User) {

    const article = await BlogList.findByUrl(blogSlug);

    if (!article) {
      throw new BadRequestError("not found");
    }

    await BlogModel
      .updateOne(
        {
          _id: article._id,
        },
        {
          $pull: { favoritedUsers: user._id },
        },
      )
      .exec();

    return true;
  }

  async isArticlesFavoriteByUser(
    user: User,
    articleIds: ObjectId[],
  ): Promise<boolean[]> {
    const articles = await BlogModel.find({ _id: { $in: { articleIds } } });
    return articles.map((article) =>
      !article.favoritedUsers ? false : !!article.favoritedUsers.find(u => u._id.toString() === user._id.toString())
    )

  }
}
