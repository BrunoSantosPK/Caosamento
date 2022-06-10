export interface UserNew {
    statusCode: number;
    message: string;
}

export interface UserLogin {
    statusCode: number;
    message: string;
    data: {
        user: {
            uid: string,
            token: string
        }
    };
}

export interface UserUpdateData {
    statusCode: number;
    message: string;
}

export interface UserData {
    statusCode: number;
    message: string;
    data: {
        user: {
            _id: string,
            email: string,
            uid: string,
            city: string,
            whatsapp?: string,
            shareWhatsapp: boolean,
            country: string,
            uf: string,
            name: string
        }
    }
}

export interface UserUpdatePass {
    statusCode: number;
    message: string;
}

export interface UserRestPass {
    statusCode: number;
    message: string;
}