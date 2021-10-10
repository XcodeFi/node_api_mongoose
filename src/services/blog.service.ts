import Blog, { BlogModel } from '@/models/blog.model';
import User from '@/models/users.model';
import { CreateBlogDto } from '@dtos/blog.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class BlogService {
  public blogs = BlogModel;

  public async findAllBlog(): Promise<Blog[]> {
    const blogs: Blog[] = await this.blogs.find();
    return blogs;
  }

  public async findBlogById(blogId: string): Promise<Blog> {
    if (isEmpty(blogId)) throw new HttpException(400, "You're not blogId");

    const findBlog: Blog = await this.blogs.findOne({ _id: blogId });
    if (!findBlog) throw new HttpException(409, "You're not blog");

    return findBlog;
  }

  public async createBlog(blogData: CreateBlogDto, createdBy: User): Promise<Blog> {
    if (isEmpty(blogData)) throw new HttpException(400, "You're not blogData");

    // const findBlog: Blog = await this.blogs.findOne({ name: blogData.name });
    // if (findBlog) throw new HttpException(409, `You're blog name ${blogData.name} already exists`);

    const blog = {
      title: blogData.title,
      description: blogData.description,
      draftText: blogData.text,
      tags: blogData.tags,
      author: createdBy,
      
      blogUrl: blogData.blogUrl,
      imgUrl: blogData.imgUrl,
      score: blogData.score,
      createdBy: createdBy,
      createdAt: new Date()
    } as Blog;

    const createBlogData: Blog = await this.blogs.create(blog);

    return createBlogData;
  }

  public async updateBlog(blogId: string, blogData: CreateBlogDto): Promise<Blog> {
    if (isEmpty(blogData)) throw new HttpException(400, "You're not blogData");

    if (blogData.title) {
      const findBlog: Blog = await this.blogs.findOne({ name: blogData.title });
      if (findBlog && findBlog._id != blogId) throw new HttpException(409, `You're blog title ${blogData.title} already exists`);
    }

    const updateBlogById: Blog = await this.blogs.findByIdAndUpdate(blogId, { blogData });
    if (!updateBlogById) throw new HttpException(409, "You're not blog");

    return updateBlogById;
  }

  public async deleteBlog(blogId: string): Promise<Blog> {
    const deleteBlogById: Blog = await this.blogs.findByIdAndDelete(blogId);
    if (!deleteBlogById) throw new HttpException(409, "You're not blog");

    return deleteBlogById;
  }
}

export default BlogService;
