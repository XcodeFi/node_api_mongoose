import { UsersController } from '@controllers/users.controller';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import userModel from '@/models/users.model';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {


  describe('[GET] /users', () => {
    it('response fineAll Users', async () => {
      const app = new App([UsersController]);
      const users = userModel;

      users.find = jest.fn().mockReturnValue([
        {
          _id: 'qpwoeiruty',
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          _id: 'alskdjfhg',
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          _id: 'zmxncbv',
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      (mongoose as any).connect = jest.fn();

      return request(app.getServer()).get(`/users`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne User', async () => {
      const userId = 'qpwoeiruty';

      const app = new App([UsersController]);
      const users = userModel;

      users.findOne = jest.fn().mockReturnValue({
        _id: 'qpwoeiruty',
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).get(`/users/${userId}`).expect(200);
    });
  });

  describe('[POST] /users', () => {
    const app = new App([UsersController]);
    const users = userModel;

    it('response Create User', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      users.findOne = jest.fn().mockReturnValue(null);
      users.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).post(`/users`).send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update User', async () => {
      const app = new App([UsersController]);
      const users = userModel;

      const userId = '60706478aad6c9ad19a31c84';
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      if (userData.email) {
        users.findOne = jest.fn().mockReturnValue({
          _id: userId,
          email: userData.email,
          password: await bcrypt.hash(userData.password, 10),
        });
      }

      users.findByIdAndUpdate = jest.fn().mockReturnValue({
        _id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).put(`/users/${userId}`).send(userData);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete User', async () => {
      const app = new App([UsersController]);
      const users = userModel;

      const userId = '60706478aad6c9ad19a31c84';

      users.findByIdAndDelete = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: 'test@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      (mongoose as any).connect = jest.fn();
      return request(app.getServer()).delete(`/users/${userId}`).expect(200);
    });
  });
});
