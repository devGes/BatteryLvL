import { UserModel } from ".SchemaUser";

export class UserDAO {
  async createUser(user) {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser.toJSON();
  }

  
  async getAuthors() {
    return UserModel.find();
  }
}
