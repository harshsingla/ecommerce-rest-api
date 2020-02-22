import userCtrl from "../controllers/user";
import { Request, Response } from "express";

export default (app: any) => {
    app.route("/user")
    .get(async (req: Request, res: Response) => {
        const {query} = req;
        const response = await userCtrl.list(query);
        return res.json(response);
    })
    .post(async (req: Request, res: Response) => {
        let {body} = req;
        let response = await userCtrl.add(body);
        res.json(response);
    })

app.route("/user/:_id")
    .get(async (req: Request, res: Response) => {
        const {params: {_id}} = req;
        console.log(_id)
        const response = await userCtrl.getById(_id);
        return res.json(response);
    })
    .put(async (req: Request, res: Response) => {
        let {body, params: {_id}} = req;

        const response = await userCtrl.update(_id,body);
        res.json(response);
    })
    .delete(async (req: Request, res: Response) => {
        const { params: {_id}} = req;
        let response = await userCtrl.delete(_id);
        res.json(response);
    });
}