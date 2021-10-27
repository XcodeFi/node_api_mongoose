import Blog, { BlogModel } from '@/models/blog.model';
import { TagModel } from '@/models/tags.model';
import User from '@/models/users.model';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Aggregate, Types } from 'mongoose';
import { BlogServiceVariable } from './index';

export class BlogList {
  static async findAllBlog(offset: number, limit: number, tag: string): Promise<Record<string, unknown>> {
    const filter: Record<string, unknown> = {
      status: true,
      isPublished: true,
    };

    if (tag) {
      const tagId = await TagModel.findOne({ name: tag });

      filter['tags'] = new Types.ObjectId(tagId._id);
    }

    const queryRs: Blog[] = await BlogModel.find(filter)
      .select('+text')
      .skip(offset)
      .limit(limit)
      .populate('author', BlogServiceVariable.AUTHOR_DETAIL)
      .populate('tags', BlogServiceVariable.TAG)
      .sort({ publishedAt: -1 })
      .lean<Blog[]>()
      .exec();

    const countRs = await BlogModel.find(filter).count();

    return {
      articles: queryRs,
      articlesCount: countRs,
    };
  }

  static async findLatestBlogs(offset: number, limit: number): Promise<Blog[]> {
    return await BlogModel.find({ status: true, isPublished: true })
      .skip(offset)
      .limit(limit)
      .populate('author', BlogServiceVariable.AUTHOR_DETAIL)
      .sort({ publishedAt: -1 })
      .lean<Blog[]>()
      .exec();
  }

  static async findBlogById(blogId: string): Promise<Blog> {
    if (isEmpty(blogId)) throw new HttpException(400, "You're not blogId");

    const findBlog: Blog = await BlogModel.findOne({ _id: blogId });
    if (!findBlog) throw new HttpException(409, "You're not blog");

    return findBlog;
  }

  static async findByTagAndPaginated(tag: string, pageNumber: number, limit: number): Promise<Blog[]> {
    return await BlogModel.find({ tags: tag, status: true, isPublished: true })
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .populate('author', BlogServiceVariable.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Blog[]>()
      .exec();
  }

  static async findAllDrafts(): Promise<Blog[]> {
    return await this.findDetailedBlogs({ isDraft: true, status: true });
  }

  static async findAllSubmissions(): Promise<Blog[]> {
    return await this.findDetailedBlogs({ isSubmitted: true, status: true });
  }

  static async findAllPublished(): Promise<Blog[]> {
    return await this.findDetailedBlogs({ isPublished: true, status: true });
  }

  static async findAllSubmissionsForWriter(user: User): Promise<Blog[]> {
    return await this.findDetailedBlogs({ author: user, status: true, isSubmitted: true });
  }

  static async findAllPublishedForWriter(user: User): Promise<Blog[]> {
    return await this.findDetailedBlogs({ author: user, status: true, isPublished: true });
  }

  static async findAllDraftsForWriter(user: User): Promise<Blog[]> {
    return await this.findDetailedBlogs({ author: user, status: true, isDraft: true });
  }

  static async findDetailedBlogs(query: Record<string, unknown>): Promise<Blog[]> {
    return await BlogModel.find(query)
      .select(BlogServiceVariable.BLOG_ALL_DATA)
      .populate('author', BlogServiceVariable.AUTHOR_DETAIL)
      .populate('createdBy', BlogServiceVariable.AUTHOR_DETAIL)
      .populate('updatedBy', BlogServiceVariable.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Blog[]>()
      .exec();
  }

  static async findByUrl(blogUrl: string): Promise<Blog | null> {
    return BlogModel.findOne({ blogUrl: blogUrl, status: true })
      .select('+text +draftText')
      .populate('author', BlogServiceVariable.AUTHOR_DETAIL)
      .populate('tags', BlogServiceVariable.TAG)
      .lean<Blog>()
      .exec();
  }

  static async findUrlIfExists(blogUrl: string): Promise<Blog | null> {
    return await BlogModel.findOne({ blogUrl: blogUrl }).lean<Blog>().exec();
  }
}
