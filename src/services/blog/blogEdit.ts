import Blog, { BlogModel } from '@/models/blog.model';
import User from '@/models/users.model';
import { BadRequestError } from '@/utils/ApiError';
import { CreateBlogDto } from '@dtos/blog.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import blogList from './blogList';
import { BlogServiceVariable } from './index';

export default class BlogEdit {
  static async createBlog(blogData: CreateBlogDto, createdBy: User): Promise<Blog> {
    if (isEmpty(blogData)) throw new BadRequestError("You're not blogData");

    const findBlog: Blog = await blogList.findUrlIfExists(blogData.blogUrl);
    if (findBlog) throw new BadRequestError('Blog with this url already exists');

    const blog = {
      title: blogData.title,
      description: blogData.description,
      text: blogData.text,
      draftText: blogData.text,
      tags: blogData.tags,
      author: createdBy,
      blogUrl: blogData.blogUrl,
      imgUrl: blogData.imgUrl,
      score: blogData.score,
      createdBy: createdBy,
      createdAt: new Date(),
    } as Blog;

    const createBlogData: Blog = await BlogModel.create(blog);

    return createBlogData;
  }

  static async updateBlog(blogId: string, blogData: CreateBlogDto): Promise<Blog> {
    if (isEmpty(blogData)) throw new BadRequestError("You're not blogData");

    const blog = await BlogModel.findOne({ _id: blogId, status: true })
      .select(BlogServiceVariable.BLOG_ALL_DATA)
      .populate('author', BlogServiceVariable.AUTHOR_DETAIL)
      .lean<Blog>()
      .exec();

    const updateBlogById: Blog = await BlogModel.findByIdAndUpdate(blogId, { blogData });

    if (!updateBlogById) throw new HttpException(409, "You're not blog");

    return updateBlogById;
  }

  static async deleteBlog(blogId: string): Promise<Blog> {
    const deleteBlogById: Blog = await BlogModel.findByIdAndDelete(blogId).lean();
    if (!deleteBlogById) throw new HttpException(409, "You're not blog");

    return deleteBlogById;
  }
}
