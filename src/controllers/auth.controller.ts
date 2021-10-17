import { Response } from 'express';
import { Controller, Req, Body, Post, UseBefore, HttpCode, Res, JsonController } from 'routing-controllers';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';
import AuthService from '@services/auth.service';
import User from '@/models/users.model';
import { SuccessResponse } from '@/utils/ApiResponse';
import { modelValidationMiddleware } from '@/middlewares/modelValidation.middleware';

@JsonController()
export class AuthController {
  public authService = new AuthService();

  @Post('/signup')
  @UseBefore(modelValidationMiddleware(CreateUserDto, 'body'))
  @HttpCode(201)
  async signUp(@Body() userData: CreateUserDto, @Res() res) {
    const signUpUserData: User = await this.authService.signup(userData);
    return res.status(200).json( { data: signUpUserData, message: 'signup'});
  }

  @Post('/login')
  @UseBefore(modelValidationMiddleware(CreateUserDto, 'body'))
  async logIn(@Res() res: Response, @Body() userData: CreateUserDto) {
    const { cookie, findUser, token } = await this.authService.login(userData);

    res.setHeader('Set-Cookie', [cookie]);

    return new SuccessResponse('login', {
      user:{
        id:findUser._id,
        email:findUser.email,
        token: token
      }
    }).send(res);
  }

  @Post('/logout')
  @UseBefore(authMiddleware)
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    const userData: User = req.user;
    const logOutUserData: User = await this.authService.logout(userData);

    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
    return res.status(200).json( { data: logOutUserData, message: 'logout'});
  }
}
