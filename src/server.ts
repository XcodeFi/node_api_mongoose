process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import 'reflect-metadata';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import { AuthController } from './controllers/auth.controller';
import { TagsController } from './controllers/tags.controller';
import { UsersController } from '@controllers/users.controller';
import { IndexController } from '@controllers/index.controller';

validateEnv();

const app = new App([IndexController, UsersController, AuthController, TagsController]);

app.listen();
