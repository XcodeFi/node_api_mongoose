import { ValidationSource } from './../enums/validation-source';
import { modelValidationMiddleware } from './../middlewares/modelValidation.middleware';
import { CreateBlogDto } from '@dtos/blog.dto';
import { Get, Req, Body, Post, UseBefore, Res, Put, Delete, Param, JsonController, QueryParams } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import Blog from '@/models/blog.model';
import authMiddleware from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import User from '@/models/users.model';
import { SuccessMsgResponse, SuccessResponse } from '@/utils/ApiResponse';
import { PaginationQuery } from '@/dtos/pagnation.dto';
import { BadRequestError } from '@/utils/ApiError';
import BlogList from '@/services/blog/blogList';
import BlogEdit from '@/services/blog/blogEdit';

@JsonController()
export class BlogsController {
  @Get('/blogs')
  @OpenAPI({ summary: 'Return a list of blogs' })
  async getBlogs(@Req() req: any, @Res() res: any, @QueryParams() query: PaginationQuery) {
    const limit = query.limit;
    const offset = query.offset;

    const rs = await BlogList.findAllBlog(offset, limit);
    return new SuccessResponse('findAll', rs).send(res);
  }

  @Get('/blogs/:slug')
  @OpenAPI({ summary: 'Return find a blog' })
  async getBlogByUrl(@Param('slug') slug: string, @Req() req: any, @Res() res: any) {
    const blogUrl: string = slug;
    const blog: Blog = await BlogList.findByUrl(blogUrl);

    if (!blog) throw new BadRequestError('Blog do not exists');

    return new SuccessResponse('findByUrl', blog).send(res);
  }

  @Get('/blogs/:slug/comments')
  @OpenAPI({ summary: 'Return find a blog' })
  async getBlogComments(@Param('slug') slug: string, @Req() req: any, @Res() res: any) {
    const blogUrl: string = slug;
    // const findOneBlogData: Blog = await this.blogService.findByUrl(blogUrl);

    return new SuccessResponse('findByUrl', []).send(res);
  }

  @Get('/blogs/:id')
  @OpenAPI({ summary: 'Return find a blog' })
  async getBlogById(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const blogId: string = id;
    const findOneBlogData: Blog = await BlogList.findBlogById(blogId);

    return new SuccessResponse('findOne', findOneBlogData).send(res);
  }

  @Post('/blogs')
  @UseBefore(authMiddleware)
  @UseBefore(modelValidationMiddleware(CreateBlogDto, ValidationSource.BODY, true))
  @OpenAPI({ summary: 'Create a new blog' })
  async createBlog(@Body() blogData: CreateBlogDto, @Req() req: RequestWithUser, @Res() res: any) {
    const userData: User = req.user;

    const createBlogData: Blog = await BlogEdit.createBlog(blogData, userData);

    return new SuccessResponse('created', createBlogData).send(res);
  }

  @Put('/blogs/publish-all')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'publish all blog' })
  async publishAll(@Res() res: any, @Req() req: any) {
    await BlogEdit.publishAllBlog(req.user);
    return new SuccessMsgResponse('Blog published successfully').send(res);
  }

  @Put('/blogs/:id')
  @UseBefore(modelValidationMiddleware(CreateBlogDto, ValidationSource.BODY, true))
  @OpenAPI({ summary: 'Update a blog' })
  async updateBlog(@Res() res: any, @Param('id') blogId: string, @Body() blogData: CreateBlogDto) {
    const updateBlogData: Blog = await BlogEdit.updateBlog(blogId, blogData);
    return res.status(200).json({ data: updateBlogData, message: 'updated' });
  }

  @Delete('/blogs/:id')
  @OpenAPI({ summary: 'Delete a blog' })
  async deleteBlog(@Param('id') blogId: string, @Res() res: any) {
    const deleteBlogData: Blog = await BlogEdit.deleteBlog(blogId);
    return res.status(200).json({ data: deleteBlogData, message: 'deleted' });
  }
}
