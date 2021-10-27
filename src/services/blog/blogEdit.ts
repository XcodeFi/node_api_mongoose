import Tag, { TagModel } from './../../models/tags.model';
import Blog, { BlogModel } from '@/models/blog.model';
import User from '@/models/users.model';
import { BadRequestError, ForbiddenError } from '@/utils/ApiError';
import { CreateBlogDto } from '@dtos/blog.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Promise } from 'mongoose';
import { BlogList } from './blogList';
import { BlogServiceVariable } from './index';

export class BlogEdit {
  static async createBlog(blogData: CreateBlogDto, createdBy: User): Promise<Blog> {
    if (isEmpty(blogData)) throw new BadRequestError("You're not blogData");

    const findBlog: Blog = await BlogList.findUrlIfExists(blogData.blogUrl);
    if (findBlog) throw new BadRequestError('Blog with this url already exists');

    const blog = {
      title: blogData.title,
      description: blogData.description,
      text: blogData.text,
      draftText: blogData.text,
      author: createdBy,
      blogUrl: blogData.blogUrl,
      imgUrl: blogData.imgUrl,
      score: blogData.score,
      createdBy: createdBy,
      createdAt: new Date(),
      isPublished: true,
    } as Blog;

    const createBlogData: Blog = await BlogModel.create(blog);

    Promise.all(
      blogData.tags.map(async (tag_name: string) => {
        const tagAdd = await TagModel.findOneAndUpdate(
          { name: tag_name },
          { name: tag_name },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          },
        );

        if (tagAdd) {
          await BlogModel.findByIdAndUpdate(createBlogData._id, { $push: { tags: tagAdd._id } }, { new: true });
          await TagModel.findByIdAndUpdate(tagAdd._id, { $push: { blogs: createBlogData._id } }, { new: true });
        }
      }),
    );

    return createBlogData;
  }

  static async updateBlog(blogUrl: string, editData: CreateBlogDto, req: any): Promise<Blog> {
    if (isEmpty(editData)) throw new BadRequestError("You're not blogData");

    const findBlog: Blog = await BlogList.findUrlIfExists(editData.blogUrl);
    if (!findBlog) throw new BadRequestError('Blog with this url not exists');

    if (!(findBlog.author as User)._id === req.user._id) throw new ForbiddenError("You don't have necessary permissions");

    const updateBlogById: Blog = await BlogModel.findByIdAndUpdate(
      findBlog._id,
      {
        title: editData.title,
        description: editData.description,
        text: editData.text,
        updatedBy: req.user as User,
        blogUrl: editData.blogUrl,
        imgUrl: editData.imgUrl,
        score: editData.score,
        updatedAt: new Date(),
      },
      { new: true },
    )
      .populate('tags')
      .lean();

    const editTags = editData.tags;
    const oldTags = updateBlogById.tags.map(t => t.name);

    const inA_not_B = (a: string[], b: string[]) => {
      const rs = {};

      a.forEach(t => {
        rs[t] = t;
      });

      b.forEach(t => {
        if (rs[t]) rs[t] = null;
      });

      return Object.values(rs).filter(t => t);
    };

    const deleteTags = inA_not_B(oldTags, editTags);
    const newTags = inA_not_B(editTags, oldTags);

    Promise.all(
      deleteTags.map(async (tag_name: string) => {
        const tagFind: Tag = await TagModel.findOne({ name: tag_name });

        await BlogModel.findByIdAndUpdate(updateBlogById._id, { $pull: { tags: tagFind._id } }, { new: true });
        await TagModel.findByIdAndUpdate(tagFind._id, { $pull: { blogs: updateBlogById._id } }, { new: true });
      }),
    );

    Promise.all(
      newTags.map(async (tag_name: string) => {
        const tagFind = await TagModel.findOneAndUpdate(
          { name: tag_name },
          { name: tag_name },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          },
        );

        if (tagFind) {
          await BlogModel.findByIdAndUpdate(updateBlogById._id, { $push: { tags: tagFind._id } }, { new: true });
          await TagModel.findByIdAndUpdate(tagFind._id, { $push: { blogs: updateBlogById._id } }, { new: true });
        }
      }),
    );

    Promise.all(
      editTags.map(async (tag_name: string) => {
        const tagAdd = await TagModel.findOneAndUpdate(
          { name: tag_name },
          { name: tag_name },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          },
        );
      }),
    );

    if (!updateBlogById) throw new HttpException(409, "You're not blog");

    return updateBlogById;
  }

  static async publishAllBlog(user: User): Promise<Blog[]> {
    const blogDrags = await BlogList.findAllDrafts();

    const now = new Date();

    Promise.all(
      blogDrags.map((t: Blog) => {
        return BlogModel.findByIdAndUpdate(t._id, {
          text: t.draftText,
          isPublished: true,
          isDraft: false,
          updatedAt: now,
          updatedBy: user.id,
        });
      }),
    );

    return blogDrags;
  }

  static async deleteAllBlog(user: User): Promise<Blog[]> {
    const blogDrags = await BlogModel.find({}).lean<Blog[]>().exec();

    const now = new Date();

    await BlogModel.deleteMany({}).exec();
    await TagModel.deleteMany({}).exec();

    return blogDrags;
  }

  async update(query: Record<string, unknown>, doc: Record<string, unknown>, options: Record<string, unknown>, cb: any): Promise<void> {
    await BlogModel.where(query).setOptions(options).update(doc, cb);
  }

  static async deleteBlog(blogUrl: string, req: any): Promise<Blog> {
    const findBlog: Blog = await BlogList.findUrlIfExists(blogUrl);
    if (!findBlog) throw new BadRequestError('Blog with this url not exists');

    if (!(findBlog.author as User)._id === req.user._id) throw new ForbiddenError("You don't have necessary permissions");

    const deleteBlogById: Blog = await BlogModel.findByIdAndUpdate(findBlog._id, { status: false });

    if (!deleteBlogById) throw new HttpException(409, "You're not blog");

    return deleteBlogById;
  }
}
