import { Router } from 'express';
import TagsController from '@controllers/tags.controller';
import { CreateTagDto } from '@dtos/tags.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class TagsRoute implements Routes {
  public path = '/tags';
  public router = Router();
  public tagsController = new TagsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.tagsController.getTags);
    this.router.get(`${this.path}/:id`, this.tagsController.getTagById);
    this.router.post(`${this.path}`, validationMiddleware(CreateTagDto, 'body'), this.tagsController.createTag);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateTagDto, 'body', true), this.tagsController.updateTag);
    this.router.delete(`${this.path}/:id`, this.tagsController.deleteTag);
  }
}

export default TagsRoute;
