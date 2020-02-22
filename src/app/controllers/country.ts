import jwt from "jsonwebtoken";
import { Country, CountryDocument } from "../models/country";
import { errorObj, successObj, secret, ErrorObj, SuccessObj } from "../../config/settings";
import _ from "lodash";
import console from "../../utils/logger";

let countryCtrl = {
    add: (data: any) => {
        return new Promise(async (resolve) => {
            const entity: any = new Country();
            _.each(data, (value: any, key: keyof CountryDocument) => {
                entity[key] = value;
            });
            entity.save(async (err: object, doc: CountryDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Error Saving Country Details" });
                }
                return resolve({ ...successObj, message: "Country added successfully", data: doc });
            });

        });
    },
    update: (id: string, data: CountryDocument) => {
        return new Promise(async (resolve) => {
            Country.updateOne({ _id: id }, async (err: object, doc: CountryDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Country not found" });
                }
                _.each(data, (value: any, key: keyof CountryDocument) => {
                    (doc[key] as any) = value;
                });
                doc.save(async (error: object, updatedDoc: CountryDocument) => {
                    if (err || !updatedDoc) {
                        return resolve({ ...errorObj, message: "Country not found" });
                    }
                    return resolve({ ...successObj, message: "Country updated successfully", data: doc });
                });
            })
        });
    },
    getById: (data: any) => {
        return new Promise(async (resolve) => {
            Country.findOne({ ...data }, async (err: object, doc: CountryDocument) => {
                if (err || !doc) {
                    return resolve({ ...errorObj, message: "Country not found" });
                }
                return resolve({ ...successObj, message: "Country fetched successfully", data: doc });
            })
        });
    },
    list: (data: any) => {
        return new Promise(async (resolve) => {
            Country.find({ ...data }, async (err: object, docs: CountryDocument[]) => {
                if (err) {
                    return resolve({ ...errorObj, message: "Error in fetching countrys" });
                }
                return resolve({ ...successObj, message: "countrys fetched successfully", data: docs });
            })
        });
    },
    delete: (ids: string[])=> {
        return new Promise((resolve) => {
            //@ts-ignore
            Country.delete({ _id: { $in: ids } })
                .exec((err: any, data: any) => {
                    if (err || !data) {
                        return resolve({ ...errorObj, message: "unable to delete", err });
                    }
                    if (data.nModified == 0) {
                        return resolve({ ...errorObj, message: "Country not found", err, data });
                    }
                    return resolve({ ...successObj, message: "Country deleted", data });

                });
        });
    },
    restore: (ids: string[]): Promise<object> => {
        return new Promise((resolve) => {
            //@ts-ignore
            Country.restore({ _id: { $in: ids._ids } }, function (err, result) {
                if (err) {
                    return resolve({ ...errorObj, message: "cannot restore", err })
                }
                if (result.nModified == 0) {
                    return resolve({ ...errorObj, message: "Country not found", err, data: result });
                } return resolve({ ...successObj, message: "restore successfully", data: result })
            });
        })
    },
}
export default countryCtrl;
