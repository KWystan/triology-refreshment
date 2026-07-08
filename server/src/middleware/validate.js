/**
 * Request validation middleware factory.
 *
 * Usage:
 *   import { validate } from '../middleware/validate.js';
 *   router.post('/items', validate({ body: mySchema }), handler);
 *
 * Each schema is a function that returns an object with:
 *   { valid: boolean, errors?: { field: string, message: string }[] }
 *
 * Example schema:
 *   const createItemSchema = (data) => {
 *     const errors = [];
 *     if (!data.name) errors.push({ field: 'name', message: 'Name is required' });
 *     return { valid: errors.length === 0, errors };
 *   };
 */

/**
 * @param {object} schemas - { body?, query?, params? }
 * @returns {import('express').RequestHandler}
 */
export function validate(schemas) {
  return (req, _res, next) => {
    const allErrors = [];

    for (const [part, schema] of Object.entries(schemas)) {
      if (!schema) continue;
      const result = schema(req[part]);
      if (!result.valid && result.errors) {
        allErrors.push(...result.errors);
      }
    }

    if (allErrors.length > 0) {
      const err = new Error('Validation failed');
      err.status = 400;
      err.errors = allErrors;
      return next(err);
    }

    next();
  };
}
