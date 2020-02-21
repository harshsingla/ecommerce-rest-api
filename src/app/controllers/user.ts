import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/User";
import { errorObj, successObj, secret, ErrorObj, SuccessObj } from "../../config/settings";
import _ from "lodash";
import console from "../../utils/logger";

let userCtrl = {
    add: (data: any) => {
        return new Promise(async (resolve) => {
            const entity: any = new User();
            _.each(data, (value: any, key: keyof UserDocument) => {
                entity[key] = value;
            });
            entity.save(async (err: object, doc: UserDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Error Saving User Details" });
                }
                return resolve({ ...successObj, message: "User added successfully", data: doc });
            });

        });
    },
    update: (id: string, data: UserDocument) => {
        return new Promise(async (resolve) => {
            User.updateOne({ _id: id }, async (err: object, doc: UserDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "user not found" });
                }
                _.each(data, (value: any, key: keyof UserDocument) => {
                    (doc[key] as any) = value;
                });
                doc.save(async (error: object, updatedDoc: UserDocument) => {
                    if (err || !updatedDoc) {
                        return resolve({ ...errorObj, message: "user not found" });
                    }
                    return resolve({ ...successObj, message: "User updated successfully", data: doc });
                });
            })
        });
    },
    getById: (data: any) => {
        return new Promise(async (resolve) => {
            User.findOne({ ...data }, async (err: object, doc: UserDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "user not found" });
                }
                return resolve({ ...successObj, message: "user fetched successfully", data: doc });
            })
        });
    },
    list: (data: any) => {
        return new Promise(async (resolve) => {
            User.find({ ...data }, async (err: object, docs: UserDocument[]) => {
                if (err) {
                    return resolve({ ...errorObj, message: "Error in fetching users" });
                }
                return resolve({ ...successObj, message: "users fetched successfully", data: docs });
            })
        });
    },
    delete: (ids: string[])=> {
        return new Promise((resolve) => {
            //@ts-ignore
            User.delete({ _id: { $in: ids } })
                .exec((err: any, data: any) => {
                    if (err || !data) {
                        return resolve({ ...errorObj, message: "unable to delete", err });
                    }
                    if (data.nModified == 0) {
                        return resolve({ ...errorObj, message: "user not found", err, data });
                    }
                    return resolve({ ...successObj, message: "user deleted", data });

                });
        });
    },

    restore: (ids: string[]): Promise<object> => {
        return new Promise((resolve) => {
            //@ts-ignore
            User.restore({ _id: { $in: ids._ids } }, function (err, result) {
                if (err) {
                    return resolve({ ...errorObj, message: "cannot restore", err })
                }
                if (result.nModified == 0) {
                    return resolve({ ...errorObj, message: "User not found", err, data: result });
                } return resolve({ ...successObj, message: "restore successfully", data: result })
            });
        })
    },
    loginWithPassword: (data: any) => (new Promise((resolve) => {
        const { email, password } = data;
        const error = "wrong email or password";
        let query = User.findOne({ email })
        query.exec(function (err, user) {
            if (!user) return resolve({ ...errorObj, message: error });

            user.comparePassword(password).then(({ err, isMatch }) => {

                if (!isMatch) {
                    // return false;
                    return resolve({ ...errorObj, message: "Invalid password" });
                }

                const JWTToken = jwt.sign({
                    _id: user._id,
                    email: user.email,
                    userType: user.userType,
                    name: user.name,
                    mobile: user.mobile

                },
                    secret,
                    {
                        expiresIn: "365d",
                    });

                return resolve({
                    ...successObj,
                    token: JWTToken,
                    user: {
                        _id: user._id,
                        email: user.email,
                        userType: user.userType,
                        name: user.name,
                        mobile: user.mobile
                    },
                });

            });

        });
    }))
}
<<<<<<< HEAD
export default userCtrl;
=======
export default userCtrl;
>>>>>>> 437df69db2b7b999b4b80fd63b9a72bad2777cf8
