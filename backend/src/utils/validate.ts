import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

type SchemaShape = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export function validate(schema: SchemaShape) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query) as Request["query"];
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params) as Request["params"];
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
