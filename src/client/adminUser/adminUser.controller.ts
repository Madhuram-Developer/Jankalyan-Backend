import type { Request, Response } from 'express';
import { createAdminUserService, getAllAdminUsersService, getAdminUserByIdService, addAdminUserService, registerAdminService, loginAdminService } from './adminUser.service.js';
import type { CreateAdminUserData, AddAdminUserData, RegisterAdminData, LoginAdminData } from './adminUser.types.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';


export const addAdminUserController = asyncHandler(async (req: Request, res: Response) => {
    const { email , addedBy } = req.body;
    console.log('Request Body:', req.body);

    if (!email) {
        throw new ApiError(400, 'Missing required fields: email, role');
    }

    try {
        const adminUser = await addAdminUserService({
            email,
            role : 'SUPERADMIN',
            addedBy,
        });

        res.status(201).json(new ApiResponse(201, adminUser, 'Admin permission granted successfully'));
    } catch (error) {
        if (error instanceof Error && error.message === 'Admin user already exists') {
            throw new ApiError(409, 'Admin user already exists');
        }
        throw error;
    }
});

export const registerAdminController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
        throw new ApiError(400, 'Missing required fields: email, password, fullName');
    }

    try {
        const adminUser = await registerAdminService({
            email,
            password,
            fullName,
        });

        res.status(201).json(new ApiResponse(201, adminUser, 'Admin registered successfully'));
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Admin user not found') {
                throw new ApiError(404, 'Admin user not found');
            } else if (error.message === 'Admin user already registered') {
                throw new ApiError(409, 'Admin user already registered');
            }
        }
        throw error;
    }
});

export const loginAdminController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Missing required fields: email, password');
    }

    try {
        const { accessToken, user } = await loginAdminService({
            email,
            password,
        });

        res
        .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 14 * 24 * 60 * 60 * 1000, 
        })
        .status(200)
        .json(new ApiResponse(200, { id: user.id, email: user.email, role: user.role }, 'Login successful'));
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
            throw new ApiError(401, 'Invalid credentials');
        }
        throw error;
    }
});

export const getAllAdminUsersController = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllAdminUsersService(page, limit);

    res.status(200).json(new ApiResponse(200, result));
});

export const getAdminUserByIdController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'ID is required');
    }

    const adminUser = await getAdminUserByIdService(id);

    if (!adminUser) {
        throw new ApiError(404, 'Admin user not found');
    }

    res.status(200).json(new ApiResponse(200, adminUser));
});

export const logoutAdminController = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});