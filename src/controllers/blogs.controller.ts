import { modelValidationMiddleware } from './../middlewares/modelValidation.middleware';
import { NextFunction, Request, Response } from 'express';
import { CreateBlogDto } from '@dtos/blog.dto';
import blogService from '@services/blog.service';
import { Get, Req, Body, Post, UseBefore, HttpCode, Res, Put, Delete, Param, JsonController } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import Blog from '@/models/blog.model';
import authMiddleware from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import User from '@/models/users.model';
import { SuccessResponse } from '@/utils/ApiResponse';

@JsonController()
export class BlogsController {
  public blogService = new blogService();

  @Get('/blogs')
  @OpenAPI({ summary: 'Return a list of blogs' })
  async getBlogs(@Req() req: any, @Res() res: Response) {
    const findAllBlogsData: Blog[] = await this.blogService.findAllBlog();
    return new SuccessResponse('findAll', findAllBlogsData).send(res);
  };

  @Get('/blogs/:id')
  @OpenAPI({ summary: 'Return find a blog' })
  async getBlogById(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const blogId: string = id;
    const findOneBlogData: Blog = await this.blogService.findBlogById(blogId);

    return new SuccessResponse('findOne', findOneBlogData).send(res);
  }

  @Post('/blogs')
  @UseBefore(authMiddleware)
  @UseBefore(modelValidationMiddleware(CreateBlogDto, 'body', true))
  @OpenAPI({ summary: 'Create a new blog' })
  async createBlog(@Body() blogData: CreateBlogDto, @Req() req: RequestWithUser, @Res() res: any) {
    const userData: User = req.user;

    const createBlogData: Blog = await this.blogService.createBlog(blogData, userData);

    return new SuccessResponse('created', createBlogData).send(res);
  }

  @Put('/blogs/:id')
  @UseBefore(modelValidationMiddleware(CreateBlogDto, 'body', true))
  @OpenAPI({ summary: 'Update a blog' })
  async updateBlog(@Res() res: any, @Param('id') blogId: string, @Body() blogData: CreateBlogDto) {
    const updateBlogData: Blog = await this.blogService.updateBlog(blogId, blogData);
    return res.status(200).json({ data: updateBlogData, message: 'updated' });
  }

  @Delete('/blogs/:id')
  @OpenAPI({ summary: 'Delete a blog' })
  async deleteBlog(@Param('id') blogId: string, @Res() res: any) {
    const deleteBlogData: Blog = await this.blogService.deleteBlog(blogId);
    return res.status(200).json({ data: deleteBlogData, message: 'deleted' });
  }
}
