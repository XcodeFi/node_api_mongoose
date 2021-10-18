import { Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore, JsonController, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto } from '@dtos/users.dto';
import userService from '@services/users.service';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { Response } from 'express';
import User from '@/models/users.model';
@JsonController()
export class UsersController {
  public userService = new userService();
  // constructor(private userService: userService) {}

  /**
   * Retrieves the details of an existing user.
   * Supply the unique user ID from either and receive corresponding user details.
   */
  @Get('/users')
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers(@Res() res: Response) {
    const findAllUsersData: User[] = await this.userService.findAllUser();
    return res.status(200).json({ data: findAllUsersData, message: 'findAll' });
  }

  @Get('/users/:id')
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('id') userId: string, @Res() res: Response) {
    const findOneUserData: User = await this.userService.findUserById(userId);
    return res.json({ data: findOneUserData, message: 'findOne' });
  }

  @Post('/users')
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() userData: CreateUserDto, @Res() res: Response) {
    const createUserData: User = await this.userService.createUser(userData);
    return res.status(201).json({ data: createUserData, message: 'created' });
  }

  @Put('/users/:id')
  @UseBefore(validationMiddleware(CreateUserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser(@Param('id') userId: string, @Body() userData: CreateUserDto, @Res() res: any) {
    const updateUserData: User = await this.userService.updateUser(userId, userData);
    return res.status(200).json({ data: updateUserData, message: 'updated' });
  }

  @Delete('/users/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('id') userId: string, @Res() res: any) {
    const deleteUserData: User = await this.userService.deleteUser(userId);
    return res.json({ data: deleteUserData, message: 'deleted' });
  }
}
