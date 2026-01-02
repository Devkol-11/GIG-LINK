import { admin_user_Repository } from '../repository/admin_user_Repository.js';

export class Admin_user_Services {
        // Service methods related to admin user management

        async deleteUser(userId: string): Promise<{ message: string }> {
                await admin_user_Repository.deleteUserById(userId);
                return { message: `User with ID ${userId} has been deleted.` };
        }
}
export const admin_user_Services = new Admin_user_Services();
