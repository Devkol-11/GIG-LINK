import { IAvatarGenerator } from '../ports/IAvatarGenerator.js';

//IMPORT IMPLEMENTATION
import { avatarGenerator } from '../adapters/avatarGenerator.js';
export class UserService {
        constructor(private avatarGenerator: IAvatarGenerator) {}

        createAvatar() {
                const avatar = this.avatarGenerator.generateAvatar();
                return avatar;
        }
}

export const userService = new UserService(avatarGenerator);
