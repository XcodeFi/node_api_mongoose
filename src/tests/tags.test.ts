import { TagsController } from '@controllers/tags.controller';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateTagDto } from '@dtos/tags.dto';
import tagModel from '@/models/tags.model';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Tags', () => {

  describe('[GET] /tags', () => {
    it('response fineAll Tags', async () => {
      const app = new App([TagsController]);
      const tags = tagModel;

      tags.find = jest.fn().mockReturnValue([
        {
          _id: 'qpwoeiruty',
          name: 'a@email.com',
        },
        {
          _id: 'alskdjfhg',
          name: 'b@email.com',
        },
        {
          _id: 'zmxncbv',
          name: 'c@email.com',
        },
      ]);

      (mongoose as any).connect = jest.fn();

      return request(app.getServer()).get(`/tags`).expect(200);
    });
  });

  describe('[GET] /tags/:id', () => {
    it('response findOne Tag', async () => {
      const tagId = 'qpwoeiruty';

      const app = new App([TagsController]);
      const tags = tagModel;

      tags.findOne = jest.fn().mockReturnValue({
        _id: 'qpwoeiruty',
        name: 'a@email.com',
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).get(`/tags/${tagId}`).expect(200);
    });
  });

  describe('[POST] /tags', () => {
    const app = new App([TagsController]);
    const tags = tagModel;

    it('response Create Tag', async () => {
      const tagData: CreateTagDto = {
        name: 'test@email.com'
      };

      tags.findOne = jest.fn().mockReturnValue(null);
      tags.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        name: tagData.name
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).post(`/tags`).send(tagData).expect(201);
    });
  });

  describe('[PUT] /tags/:id', () => {
    it('response Update Tag', async () => {
      const app = new App([TagsController]);
      const tags = tagModel;

      const tagId = '60706478aad6c9ad19a31c84';
      const tagData: CreateTagDto = {
        name: 'test@email.com',
      };

      if (tagData.name) {
        tags.findOne = jest.fn().mockReturnValue({
          _id: tagId,
          name: tagData.name,
        });
      }

      tags.findByIdAndUpdate = jest.fn().mockReturnValue({
        _id: tagId,
        name: tagData.name,
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).put(`/tags/${tagId}`).send(tagData);
    });
  });

  describe('[DELETE] /tags/:id', () => {
    it('response Delete Tag', async () => {
      const app = new App([TagsController]);
      const tags = tagModel;

      const tagId = '60706478aad6c9ad19a31c84';

      tags.findByIdAndDelete = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        name: 'test@email.com',
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).delete(`/tags/${tagId}`).expect(200);
    });
  });
});
