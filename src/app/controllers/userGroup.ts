import jwt from "jsonwebtoken";
import { UserGroup, UserGroupDocument } from "../models/userGroup";
import { errorObj, successObj, secret, ErrorObj, SuccessObj } from "../../config/settings";
import _ from "lodash";
import console from "../../utils/logger";

let userCtrl = {
    add: (data: any) => {
        return new Promise(async (resolve) => {
            const entity: any = new UserGroup();
            _.each(data, (value: any, key: keyof UserGroupDocument) => {
                entity[key] = value;
            });
            entity.save(async (err: object, doc: UserGroupDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Error Saving UserGroup Details" });
                }
                return resolve({ ...successObj, message: "UserGroup added successfully", data: doc });
            });

        });
    },
    update: (id: string, data: UserGroupDocument) => {
        return new Promise(async (resolve) => {
            UserGroup.updateOne({ _id: id }, async (err: object, doc: UserGroupDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "user not found" });
                }
                _.each(data, (value: any, key: keyof UserGroupDocument) => {
                    (doc[key] as any) = value;
                });
                doc.save(async (error: object, updatedDoc: UserGroupDocument) => {
                    if (err || !updatedDoc) {
                        return resolve({ ...errorObj, message: "user not found" });
                    }
                    return resolve({ ...successObj, message: "UserGroup updated successfully", data: doc });
                });
            })
        });
    },
    getById: (data: any) => {
        return new Promise(async (resolve) => {
            UserGroup.findOne({ ...data }, async (err: object, doc: UserGroupDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "user not found" });
                }
                return resolve({ ...successObj, message: "user fetched successfully", data: doc });
            })
        });
    },
    list: (data: any) => {
        return new Promise(async (resolve) => {
            UserGroup.find({ ...data }, async (err: object, docs: UserGroupDocument[]) => {
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
            UserGroup.delete({ _id: { $in: ids } })
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
            UserGroup.restore({ _id: { $in: ids._ids } }, function (err, result) {
                if (err) {
                    return resolve({ ...errorObj, message: "cannot restore", err })
                }
                if (result.nModified == 0) {
                    return resolve({ ...errorObj, message: "UserGroup not found", err, data: result });
                } return resolve({ ...successObj, message: "restore successfully", data: result })
            });
        })
    },
}
export default userGroupCtrl;
