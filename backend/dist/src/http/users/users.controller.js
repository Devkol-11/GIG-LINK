import { usersService } from "../../services/users.service.js";
export const usersController = {
    async createProfile(req, res) {
        const result = await usersService.createProfile(req.user.id, req.body);
        res.status(201).json({ data: result, message: "Profile created successfully" });
    },
    async getProfile(req, res) {
        const result = await usersService.getProfile(req.user.id);
        res.status(200).json({ data: result, message: "Profile fetched successfully" });
    },
    async updateProfile(req, res) {
        const result = await usersService.updateProfile(req.user.id, req.body);
        res.status(200).json({ data: result, message: "Profile updated successfully" });
    },
    async uploadAvatar(req, res) {
        const result = await usersService.uploadAvatar(req.user.id, req.body);
        res.status(200).json({ data: result, message: "Avatar updated successfully" });
    },
};
