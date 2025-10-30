import { IAvatarGenerator } from "../interfaces/IAvatarGenerator.js";

//IMPORT IMPLEMENTATION
import { avatarGenerator } from "../../infrastructure/avatarGenerator.js";
export class UserService {
  constructor(private avatarGenerator: IAvatarGenerator) {}

  createAvtar() {
    const avatar = this.avatarGenerator.generateAvatar();
    return avatar;
  }
}

export const userService = new UserService(avatarGenerator);
