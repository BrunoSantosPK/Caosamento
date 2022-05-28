import CustomResponse from "../utils/response";
import { validateToken } from "../utils/firebase";
import { Request, Response, NextFunction } from "express";

export default class AuthController {
    
    static async token(request: Request, response: Response, next: NextFunction) {
        const { token, uid } = request.headers;
        const res = new CustomResponse();

        try {
            // Verifica o envio do header de autenticação
            if(token == undefined || uid == undefined)
                throw new Error("É preciso informar o header de autenticação: token e uid.");

            // Faz a verificação do token
            const result = await validateToken(token as string);
            if(!result.success)
                throw new Error(result.message);

            // Verifica a correspondência do uid
            if(uid != result.message)
                throw new Error("O token não corresponde ao usuário informado.");

        } catch(error: any) {
            res.setStatus(401);
            res.setMessage(error.message);

        } finally {
            if(res.getStatus() == 200)
                next();
            else
                return response.json(res.getJSON());
        }
    }

}