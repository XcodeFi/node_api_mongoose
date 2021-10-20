import Blog, { BlogModel } from '@/models/blog.model';
import User from '@/models/users.model';
import { BadRequestError } from '@/utils/ApiError';
import { CreateBlogDto } from '@dtos/blog.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class BlogService {
  public blogs = BlogModel;
  private AUTHOR_DETAIL = 'email profilePicUrl';
  private BLOG_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
  private BLOG_ALL_DATA = '+text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';

  public async findAllBlog(offset: number, limit: number): Promise<{
    articles: Blog[],
    articlesCount: number
  }> {

    const queryRs: Blog[] = await this.blogs
      .find()
      .select('+text')
      .skip(offset)
      .limit(limit)
      .populate('author', this.AUTHOR_DETAIL)
      .sort({ publishedAt: -1 })
      .lean<Blog[]>()
      .exec();

    const countRs = await this.blogs.count();

    return {
      articles: queryRs,
      articlesCount: countRs
    };
  }

  public async findLatestBlogs(offset: number, limit: number): Promise<Blog[]> {
    return await BlogModel.find({ status: true, isPublished: true })
      .skip(offset)
      .limit(limit)
      .populate('author', this.AUTHOR_DETAIL)
      .sort({ publishedAt: -1 })
      .lean<Blog[]>()
      .exec();
  }

  public async findBlogById(blogId: string): Promise<Blog> {
    if (isEmpty(blogId)) throw new HttpException(400, "You're not blogId");

    const findBlog: Blog = await this.blogs.findOne({ _id: blogId });
    if (!findBlog) throw new HttpException(409, "You're not blog");

    return findBlog;
  }

  public async findByUrl(blogUrl: string): Promise<Blog | null> {
    return BlogModel.findOne({ blogUrl: blogUrl, status: true }).select('+text').populate('author', this.AUTHOR_DETAIL).lean<Blog>().exec();
  }

  public async createBlog(blogData: CreateBlogDto, createdBy: User): Promise<Blog> {
    if (isEmpty(blogData)) throw new BadRequestError("You're not blogData");

    const findBlog: Blog = await this.findUrlIfExists(blogData.blogUrl);
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

    const createBlogData: Blog = await this.blogs.create(blog);

    return createBlogData;
  }

  public async updateBlog(blogId: string, blogData: CreateBlogDto): Promise<Blog> {
    if (isEmpty(blogData)) throw new BadRequestError("You're not blogData");

    const blog = await this.blogs
      .findOne({ _id: blogId, status: true })
      .select(this.BLOG_ALL_DATA)
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Blog>()
      .exec();

    const updateBlogById: Blog = await this.blogs.findByIdAndUpdate(blogId, { blogData });

    if (!updateBlogById) throw new HttpException(409, "You're not blog");

    return updateBlogById;
  }

  public async deleteBlog(blogId: string): Promise<Blog> {
    const deleteBlogById: Blog = await this.blogs.findByIdAndDelete(blogId).lean();
    if (!deleteBlogById) throw new HttpException(409, "You're not blog");

    return deleteBlogById;
  }

  public async findUrlIfExists(blogUrl: string): Promise<Blog | null> {
    return await this.blogs.findOne({ blogUrl: blogUrl }).lean<Blog>().exec();
  }
}

export default BlogService;
