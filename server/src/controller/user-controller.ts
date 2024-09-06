import { Request, Response } from "express";
import * as UserService from "../service/user-service.js";
import axios from "axios";
import { validationResult } from "express-validator";
import { userTable } from "../db/schema.js";

export const getUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const username: string = req.params.username!;

    try {
        const existingUser = await UserService.getUserByUsername(username);
        if (existingUser.length > 0) {
            return res.status(200).json(existingUser[0]);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);
        const userData = response.data;

        const result = await UserService.createUser({
            username: userData.login,
            name: userData.name,
            location: userData.location,
            blog: userData.blog,
            bio: userData.bio,
            publicRepos: userData.public_repos,
            publicGists: userData.public_gists,
            followers: userData.followers,
            following: userData.following,
            createdAt: new Date(userData.created_at)
        });

        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

export const getFriends = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const username: string = req.params.username!;

    try {
        const followersResponse = await axios.get(`https://api.github.com/users/${username}/followers`);
        const followingResponse = await axios.get(`https://api.github.com/users/${username}/following`);

        const followers = followersResponse.data.map((user: any) => user.login);
        const following = followingResponse.data.map((user: any) => user.login);

        // Mutual followers
        const mutualFriends = followers.filter((user: string) => following.includes(user));

        // Save mutual friends to the database
        await Promise.all(mutualFriends.map((friend: string) =>
            UserService.insertFriends({ username, friend })
        ));

        res.status(200).json({ friends: mutualFriends });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

// Search for users
export const searchUser = async (req: Request, res: Response) => {
    const { username, location } = req.query;

    try {
        const result = await UserService.searchUsers({ username: username as string, location: location as string });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

// Soft delete user
export const deleteUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const username: string = req.params.username!;

    try {
        await UserService.deleteUser(username);
        res.status(200).json({ message: 'User soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const username: string = req.params.username!;
    const { location, blog, bio } = req.body;

    try {
        const result = await UserService.updateUser(username, { location, blog, bio });

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

export const sortUsers = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const sort_by = req.query.sort_by as keyof typeof userTable | undefined;
    const order = req.query.order as 'asc' | 'desc' | undefined;

    try {
        const result = await UserService.sortUsers(sort_by, order);
        if ('error' in result) {
            return res.status(400).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
