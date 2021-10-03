import { NextFunction, Request, Response } from 'express';
import { CreateTagDto } from '@dtos/tags.dto';
import { Tag } from '@interfaces/tags.interface';
import tagService from '@services/tags.service';

class TagsController {
  public tagService = new tagService();

  public getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTagsData: Tag[] = await this.tagService.findAllTag();

      res.status(200).json({ data: findAllTagsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTagById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagId: string = req.params.id;
      const findOneTagData: Tag = await this.tagService.findTagById(tagId);

      res.status(200).json({ data: findOneTagData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagData: CreateTagDto = req.body;
      const createTagData: Tag = await this.tagService.createTag(tagData);

      res.status(201).json({ data: createTagData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagId: string = req.params.id;
      const tagData: CreateTagDto = req.body;
      const updateTagData: Tag = await this.tagService.updateTag(tagId, tagData);

      res.status(200).json({ data: updateTagData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tagId: string = req.params.id;
      const deleteTagData: Tag = await this.tagService.deleteTag(tagId);

      res.status(200).json({ data: deleteTagData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TagsController;
