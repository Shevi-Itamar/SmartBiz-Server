import UserModel from '../models/Users.model';

const getAllUsers = async () => {
    return await UserModel.find({});
};

const getUserByEmail = async (email:any) => {
    return await UserModel.findOne({ userEmail: email });
};

const createUser = async (userData:any) => {
    const newUser = new UserModel(userData);
    return await newUser.save();
};

const updateUser = async (email:any, userData:any) => {
    return await UserModel.findOneAndUpdate({ userEmail: email }, userData, { new: true });
};

const deleteUser = async (email:any) => {
    return await UserModel.findOneAndDelete({ userEmail: email });
};

export default {
    getAllUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};
