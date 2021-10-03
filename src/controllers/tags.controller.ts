import { NextFunction, Request, Response } from 'express';
import { CreateTagDto } from '@dtos/tags.dto';
import { Tag } from '@interfaces/tags.interface';
import tagService from '@services/tags.service';
import { Controller, Get, Req, Body, Post, UseBefore, HttpCode, Res, Put, Delete, Param } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { validationMiddleware } from '@/middlewares/validation.middleware';

@Controller()
export class TagsController {
  public tagService = new tagService();

  @Get('/tags')
  @OpenAPI({ summary: 'Return a list of tags' })
  public getTags = async () => {
    const findAllTagsData: Tag[] = await this.tagService.findAllTag();

    return { data: findAllTagsData, message: 'findAll' };
  };

  @Get('/tags/:id')
  @OpenAPI({ summary: 'Return find a tag' })
  async getTagById(@Param('id') id: string) {
    const tagId: string = id;
    const findOneTagData: Tag = await this.tagService.findTagById(tagId);

    return { data: findOneTagData, message: 'findOne' };
  };

  @Post('/tags')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateTagDto, 'body'))
  @OpenAPI({ summary: 'Create a new tag' })
  async createTag(@Body() tagData: CreateTagDto) {
    const createTagData: Tag = await this.tagService.createTag(tagData);
    return { data: createTagData, message: 'created' };
  };

  @Put('/tags/:id')
  @UseBefore(validationMiddleware(CreateTagDto, 'body', true))
  @OpenAPI({ summary: 'Update a tag' })
  async updateTag(@Param('id') tagId: string, @Body() tagData: CreateTagDto) {
    const updateTagData: Tag = await this.tagService.updateTag(tagId, tagData);
    return { data: updateTagData, message: 'updated' };
  };

  @Delete('/tags/:id')
  @OpenAPI({ summary: 'Delete a tag' })
  async deleteTag(@Param('id') tagId: string) {
    const deleteTagData: Tag = await this.tagService.deleteTag(tagId);
    return { data: deleteTagData, message: 'deleted' };
  };
}
