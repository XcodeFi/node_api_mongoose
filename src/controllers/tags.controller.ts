import { NextFunction, Request, Response } from 'express';
import { CreateTagDto } from '@dtos/tags.dto';
import tagService from '@services/tags.service';
import { Get, Req, Body, Post, UseBefore, HttpCode, Res, Put, Delete, Param, JsonController } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import Tag from '@/models/tags.model';

@JsonController()
export class TagsController {
  public tagService = new tagService();

  @Get('/tags')
  @OpenAPI({ summary: 'Return a list of tags' })
  async getTags(@Req() req: any, @Res() res: Response) {
    const findAllTagsData: Tag[] = await this.tagService.findAllTag();
    return res.status(200).json({ data: findAllTagsData, message: 'findAll' });
  };

  @Get('/tags/:id')
  @OpenAPI({ summary: 'Return find a tag' })
  async getTagById(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const tagId: string = id;
    const findOneTagData: Tag = await this.tagService.findTagById(tagId);

    return res.status(200).json({ data: findOneTagData, message: 'findOne' });
  }

  @Post('/tags')
  @UseBefore(validationMiddleware(CreateTagDto, 'body'))
  @OpenAPI({ summary: 'Create a new tag' })
  async createTag(@Body() tagData: CreateTagDto, @Req() req: any, @Res() res: any) {
    const createTagData: Tag = await this.tagService.createTag(tagData);
    return res.status(201).json({ data: createTagData, message: 'created' });
  }

  @Put('/tags/:id')
  @UseBefore(validationMiddleware(CreateTagDto, 'body', true))
  @OpenAPI({ summary: 'Update a tag' })
  async updateTag(@Res() res: any, @Param('id') tagId: string, @Body() tagData: CreateTagDto) {
    const updateTagData: Tag = await this.tagService.updateTag(tagId, tagData);
    return res.status(200).json({ data: updateTagData, message: 'updated' });
  }

  @Delete('/tags/:id')
  @OpenAPI({ summary: 'Delete a tag' })
  async deleteTag(@Param('id') tagId: string, @Res() res: any) {
    const deleteTagData: Tag = await this.tagService.deleteTag(tagId);
    return res.status(200).json({ data: deleteTagData, message: 'deleted' });
  }
}
