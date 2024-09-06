import { Request, Response } from "express";
import { body, query, param, validationResult } from "express-validator";

export const validateGetUser = [
    param('username').isString().notEmpty().withMessage('Username is required and must be a non-empty string'),
    (req: Request, res: Response, next: Function) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateUpdateUser = [
    param('username').isString().notEmpty().withMessage('Username is required and must be a non-empty string'),
    body('location').optional().isString().withMessage('Location must be a string'),
    body('blog').optional().isString().withMessage('Blog must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string')
];

export const validateSearchUser = [
    query('username').optional().isString().withMessage('Username must be a valid string'),
    query('location').optional().isString().withMessage('Location must be a valid string')
];

export const validateSortUsers = [
    query('sort_by').isString().notEmpty().withMessage('Sort by is required and must be a non-empty string'),
    query('order')
        .isString()
        .isIn(['asc', 'desc'])
        .withMessage('Order is required and must be either "asc" or "desc"')
];