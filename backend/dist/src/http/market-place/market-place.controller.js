import { marketPlaceService } from "../../services/market-place.service.js";
export const marketPlaceController = {
    async createGig(req, res) {
        const result = await marketPlaceService.createGig(req.user.id, req.user.role, req.body);
        res.status(201).json({ data: result, message: "Gig created successfully" });
    },
    async listGigs(req, res) {
        const result = await marketPlaceService.listGigs(Number(req.query.page), Number(req.query.limit));
        res.status(200).json({
            data: result.items,
            pagination: result.pagination,
            message: "Gigs fetched successfully",
        });
    },
    async getGig(req, res) {
        const result = await marketPlaceService.getGig(req.params.id);
        res.status(200).json({ data: result, message: "Gig fetched successfully" });
    },
    async updateGig(req, res) {
        const result = await marketPlaceService.updateGig(req.user.id, req.user.role, req.params.id, req.body);
        res.status(200).json({ data: result, message: "Gig updated successfully" });
    },
    async deleteGig(req, res) {
        const result = await marketPlaceService.deleteGig(req.user.id, req.user.role, req.params.id);
        res.status(200).json({ data: result, message: "Gig deleted successfully" });
    },
    async createApplication(req, res) {
        const result = await marketPlaceService.createApplication(req.user.id, req.user.role, req.body);
        res.status(201).json({ data: result, message: "Application created successfully" });
    },
    async listApplications(req, res) {
        const result = await marketPlaceService.listApplications(req.user.id, req.user.role);
        res.status(200).json({ data: result, message: "Applications fetched successfully" });
    },
    async updateApplicationStatus(req, res) {
        const result = await marketPlaceService.updateApplicationStatus(req.user.id, req.user.role, req.params.id, req.body.status);
        res.status(200).json({ data: result, message: "Application status updated successfully" });
    },
    async createContract(req, res) {
        const result = await marketPlaceService.createContract(req.user.id, req.user.role, req.body);
        res.status(201).json({ data: result, message: "Contract created successfully" });
    },
    async getContract(req, res) {
        const result = await marketPlaceService.getContract(req.user.id, req.params.id);
        res.status(200).json({ data: result, message: "Contract fetched successfully" });
    },
    async updateContractStatus(req, res) {
        const result = await marketPlaceService.updateContractStatus(req.user.id, req.user.role, req.params.id, req.body.status);
        res.status(200).json({ data: result, message: "Contract status updated successfully" });
    },
};
