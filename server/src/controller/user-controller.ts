import { Request, Response } from "express";
import * as UserService from "../service/user-service.js";
import axios from "axios";
import { validationResult } from "express-validator";
import { userTable } from "../db/schema.js";

export const createUserAndRepos = async (userData: any, repoData: any) => {
    try {
        const userResult = await UserService.createUser({
            username: userData.login,
            avatar_url: userData.avatar_url,
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

        if (!userResult || userResult.length === 0) {
            return { error: "Failed to create user" };
        }

        const repoInsertPromises = repoData.map((repo: any) => {
            return UserService.createRepo({
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                language: repo.language,
                stargazersCount: repo.stargazers_count,
                forksCount: repo.forks_count,
                openIssuesCount: repo.open_issues_count,
                ownerId: userResult[0]?.id || 1,
                createdAt: new Date(repo.created_at),
                updatedAt: new Date(repo.updated_at)
            });
        });

        const repoResult = await Promise.all(repoInsertPromises);
        return { user: userResult[0], repos: repoResult.flat() };
    } catch (error) {
        console.log(error);
        return { error: 'An error occurred while creating the user and repos' };
    }
};

export const getUser = async (req: Request, res: Response) => {
    console.log("get user controller")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const username: string = req.params.username!;
    try {
        const existingUser = await UserService.getUserByUsername(username);
        if (existingUser.length > 0) {
            console.log("existing user")
            const userRepos = await UserService.getUserRepos(existingUser[0]?.id as number);

            return res.status(200).json({
                user: existingUser[0],
                repos: userRepos
            });
        }

        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        const repoResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
        const userAndRepos = await createUserAndRepos(userResponse.data, repoResponse.data);

        if (userAndRepos.error) {
            return res.status(500).json({ error: userAndRepos.error });
        }

        return res.status(201).json({ user: userAndRepos.user, repos: userAndRepos.repos });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

export const getFriends = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const username: string = req.params.username!;
    console.log("get Friends contoller")
    try {
        const existingFriends = await UserService.getExistingFriends(username);
        if (existingFriends.length > 0) {
            console.log("Returning friends from database");
            const friendsDetails = await Promise.all(
                existingFriends.map(friend => UserService.getUserByUsername(friend.friend))
            );
            console.log(friendsDetails.flat())

            return res.status(200).json({ friends: friendsDetails.flat()});
        }

        const followersResponse = await axios.get(`https://api.github.com/users/${username}/followers`);
        const followingResponse = await axios.get(`https://api.github.com/users/${username}/following`);

        const followers = followersResponse.data.map((user: any) => user.login);
        const following = followingResponse.data.map((user: any) => user.login);
        const mutualFriends = followers.filter((user: string) => following.includes(user));
        console.log(mutualFriends)

        const friendsDetails = await Promise.all(mutualFriends.map(async (friend: string) => {
            let user = await UserService.getUserByUsername(friend);
            let userDetails
            if (Array.isArray(user) && user.length === 0) {
                // userDetails = await UserService.createUser({ username: friend });
                const userResponse = await axios.get(`https://api.github.com/users/${friend}`);
                const repoResponse = await axios.get(`https://api.github.com/users/${friend}/repos`);
                const userAndRepos = await createUserAndRepos(userResponse.data, repoResponse.data);
                console.log(userAndRepos)
                userDetails = userAndRepos.user;
            }
            await UserService.insertFriends({ username, friend });
            return userDetails;
        }));

        res.status(200).json({ friends: friendsDetails });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

export const searchUser = async (req: Request, res: Response) => {
    const { username, location } = req.query;

    try {
        const result = await UserService.searchUsers({ username: username as string, location: location as string });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

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
        console.log(error)
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
