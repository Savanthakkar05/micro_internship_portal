// middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";

interface ValidationSchemas {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    const sources: Array<keyof ValidationSchemas> = ["body", "query", "params"];

    for (const source of sources) {
      const schema = schemas[source];
      if (schema) {
        const { error, value } = schema.validate(req[source], {
          abortEarly: false, // collect all errors
          stripUnknown: true, // remove extra fields
        });

        if (error) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            details: error.details.map((d) => d.message),
          });
        }
        req[source] = value; // assign the sanitized value
      }
    }
    next();
  };
