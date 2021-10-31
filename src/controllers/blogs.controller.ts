import Comments from '@/models/comment.model';
import { ValidationSource } from './../enums/validation-source';
import { modelValidationMiddleware } from './../middlewares/modelValidation.middleware';
import { BlogPagination, CreateBlogDto, CreateCommentDto } from '@dtos/blog.dto';
import { Get, Req, Body, Post, UseBefore, Res, Put, Delete, Param, JsonController, QueryParams } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import Blog from '@/models/blog.model';
import authMiddleware from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import User from '@/models/users.model';
import { SuccessMsgResponse, SuccessResponse } from '@/utils/ApiResponse';
import { BadRequestError } from '@/utils/ApiError';
import { BlogList, BlogEdit } from '@/services/blog';
import CommentService from '@/services/comment.service';
import FavoriteService from '@/services/favorite.service';
import getAuthInfoMiddleware from '@/middlewares/getAuthInfo.middleware';

@JsonController('/blogs')
export class BlogsController {
  @Get()
  @UseBefore(getAuthInfoMiddleware)
  @OpenAPI({ summary: 'Return a list of blogs' })
  async getBlogs(@Req() req: any, @Res() res: any, @QueryParams() query: BlogPagination) {

    const rs = await BlogList.findAllBlog(query, req.user as User);
    return new SuccessResponse('findAll', rs).send(res);
  }

  @Get('/feed')
  @OpenAPI({ summary: 'Return a list of blog feed' })
  async getBlogsFeed(@Req() req: any, @Res() res: any, @QueryParams() query: BlogPagination) {

    const rs = await BlogList.findAllBlog(query);
    return new SuccessResponse('blog feed', rs).send(res);
  }

  @Get('/:slug')
  @OpenAPI({ summary: 'Return find a blog' })
  async getBlogByUrl(@Param('slug') slug: string, @Req() req: any, @Res() res: any) {
    const blogUrl: string = slug;
    const blog: Blog = await BlogList.findByUrl(blogUrl);

    if (!blog) throw new BadRequestError('Blog do not exists');

    return new SuccessResponse('findByUrl', blog).send(res);
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Return find a blog' })
  async getBlogById(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const blogId: string = id;
    const findOneBlogData: Blog = await BlogList.findBlogById(blogId);

    return new SuccessResponse('findOne', findOneBlogData).send(res);
  }

  @Post()
  @UseBefore(authMiddleware)
  @UseBefore(modelValidationMiddleware(CreateBlogDto, ValidationSource.BODY, true))
  @OpenAPI({ summary: 'Create a new blog' })
  async createBlog(@Body() blogData: CreateBlogDto, @Req() req: RequestWithUser, @Res() res: any) {
    const userData: User = req.user;

    const createBlogData: Blog = await BlogEdit.createBlog(blogData, userData);

    return new SuccessResponse('created', createBlogData).send(res);
  }

  @Put('/publish-all')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'publish all blog' })
  async publishAll(@Res() res: any, @Req() req: any) {
    await BlogEdit.publishAllBlog(req.user);
    return new SuccessMsgResponse('Blog published successfully').send(res);
  }

  @Put('/:slug')
  @UseBefore(authMiddleware)
  @UseBefore(modelValidationMiddleware(CreateBlogDto, ValidationSource.BODY, true))
  @OpenAPI({ summary: 'Update a blog' })
  async updateBlog(@Res() res: any, @Param('slug') blogUrl: string, @Body() blogData: CreateBlogDto, @Req() req: any) {
    const updateBlogData: Blog = await BlogEdit.updateBlog(blogUrl, blogData, req);
    return new SuccessResponse('Blog updated successfully', updateBlogData).send(res);
  }

  @Delete('/:slug')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Delete a blog' })
  async deleteBlog(@Param('slug') blogUrl: string, @Res() res: any, @Req() req: any) {
    const deleteBlogData: Blog = await BlogEdit.deleteBlog(blogUrl, req);
    return new SuccessResponse('deleted', deleteBlogData).send(res);
  }

  @Delete()
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Delete all blog' })
  async deleteAllBlog(@Res() res: any, @Req() req: any) {
    const deleteBlogData: Blog[] = await BlogEdit.deleteAllBlog(req.user);
    return new SuccessResponse('deleted', deleteBlogData).send(res);
  }

  //#region comment region

  @Get('/:slug/comments')
  @OpenAPI({ summary: 'Return find a blog' })
  async getBlogComments(@Param('slug') slug: string, @Req() req: any, @Res() res: any) {
    const blogUrl: string = slug;
    const comments: Comments[] = await CommentService.findByBlogUrl(blogUrl);

    return new SuccessResponse('findByBlogUrl', comments).send(res);
  }

  @Post('/:slug/comments')
  @UseBefore(authMiddleware)
  @UseBefore(modelValidationMiddleware(CreateCommentDto, ValidationSource.BODY, true))
  @OpenAPI({ summary: 'Create a new blog' })
  async addComment(@Body() commentDto: CreateCommentDto, @Param('slug') slug: string, @Req() req: RequestWithUser, @Res() res: any) {
    const userData: User = req.user;

    const commentRs: Comments = await CommentService.addComment(slug, commentDto.body, userData);

    return new SuccessResponse('add comment', commentRs).send(res);
  }

  @Delete('/:slug/comments/:commentid')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Delete a blog' })
  async deleteCommentInBlog(@Param('slug') blogUrl: string, @Param('commentid') commentId: string, @Res() res: any, @Req() req: any) {
    const deleteData = await CommentService.deleteComment(blogUrl, req.user as User, commentId);
    return new SuccessResponse('deleted', deleteData).send(res);
  }

  //#endregion

  //#region favorite
  @Post('/:slug/favorite')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Favorite blog' })
  async addFavorite(@Param('slug') slug: string, @Req() req: RequestWithUser, @Res() res: any) {
    const userData: User = req.user;

    const blog: Blog = await FavoriteService.addArticleToFavorite(slug, userData);
    const blogViewModel = {
      ...blog,
      favorited: (blog.favoritedUsers as User[]).find(
        (t) => t.email === userData.email
      ) != null,
      favoritesCount:blog.favoritedUsers.length
    }

    return new SuccessResponse('add comment', blogViewModel).send(res);
  }

  @Delete('/:slug/favorite')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'UnFavorite blog' })
  async unFavorite(@Param('slug') slug: string, @Req() req: RequestWithUser, @Res() res: any) {
    const userData: User = req.user;

    const blog = await FavoriteService.deleteArticleFromFavorite(slug, userData);
    const blogViewModel = {
      ...blog,
      favorited: (blog.favoritedUsers as User[]).find(
        (t) => t.email === userData.email
      ) != null,
      favoritesCount:blog.favoritedUsers.length
    }

    return new SuccessResponse('add comment', blogViewModel).send(res);
  }


  //#endregion
}
