import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { ModelInvalidResponse } from '@/utils/ApiResponse';

const getAllNestedObjErrors = (error: ValidationError): Record<string, string[]> => {
  if (error.constraints) {

    let _key = error.property;
    let errs = Object.values(error.constraints);

    return { [_key]: errs };
  }
  return error.children.reduce((pre, curr) => {
    let cur = getAllNestedObjErrors(curr);

    return { ...pre, ...cur };
  }, {});
}

export const modelValidationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToClass(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const messageObj = errors.reduce((pre, curr) => {
          let cur = getAllNestedObjErrors(curr);

          return { ...pre, ...cur };
        }, {});

        return new ModelInvalidResponse(messageObj).send(res);
      } else {
        next();
      }
    });
  };
};
