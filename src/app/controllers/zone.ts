import jwt from "jsonwebtoken";
import { Zone, ZoneDocument } from "../models/zone";
import { errorObj, successObj, secret, ErrorObj, SuccessObj } from "../../config/settings";
import _ from "lodash";
import console from "../../utils/logger";

let ZoneCtrl = {
    add: (data: any) => {
        return new Promise(async (resolve) => {
            const entity: any = new Zone();
            _.each(data, (value: any, key: keyof ZoneDocument) => {
                entity[key] = value;
            });
            entity.save(async (err: object, doc: ZoneDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Error Saving Zone Details" });
                }
                return resolve({ ...successObj, message: "Zone added successfully", data: doc });
            });

        });
    },
    update: (id: string, data: ZoneDocument) => {
        return new Promise(async (resolve) => {
            Zone.updateOne({ _id: id }, async (err: object, doc: ZoneDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Zone not found" });
                }
                _.each(data, (value: any, key: keyof ZoneDocument) => {
                    (doc[key] as any) = value;
                });
                doc.save(async (error: object, updatedDoc: ZoneDocument) => {
                    if (err || !updatedDoc) {
                        return resolve({ ...errorObj, message: "Zone not found" });
                    }
                    return resolve({ ...successObj, message: "Zone updated successfully", data: doc });
                });
            })
        });
    },
    getById: (data: any) => {
        return new Promise(async (resolve) => {
            Zone.findOne({ ...data }, async (err: object, doc: ZoneDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Zone not found" });
                }
                return resolve({ ...successObj, message: "Zone fetched successfully", data: doc });
            })
        });
    },
    list: (data: any) => {
        return new Promise(async (resolve) => {
            Zone.find({ ...data }, async (err: object, docs: ZoneDocument[]) => {
                if (err) {
                    return resolve({ ...errorObj, message: "Error in fetching Zones" });
                }
                return resolve({ ...successObj, message: "Zones fetched successfully", data: docs });
            })
        });
    },
    delete: (ids: string[])=> {
        return new Promise((resolve) => {
            //@ts-ignore
            Zone.delete({ _id: { $in: ids } })
                .exec((err: any, data: any) => {
                    if (err || !data) {
                        return resolve({ ...errorObj, message: "unable to delete", err });
                    }
                    if (data.nModified == 0) {
                        return resolve({ ...errorObj, message: "Zone not found", err, data });
                    }
                    return resolve({ ...successObj, message: "Zone deleted", data });

                });
        });
    },
    restore: (ids: string[]): Promise<object> => {
        return new Promise((resolve) => {
            //@ts-ignore
            Zone.restore({ _id: { $in: ids._ids } }, function (err, result) {
                if (err) {
                    return resolve({ ...errorObj, message: "cannot restore", err })
                }
                if (result.nModified == 0) {
                    return resolve({ ...errorObj, message: "Zone not found", err, data: result });
                } return resolve({ ...successObj, message: "restore successfully", data: result })
            });
        })
    },
}
export default ZoneCtrl;
