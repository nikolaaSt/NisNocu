import { jwtDataDto } from "dto/auth/jwt.data.dto";

declare module 'express'{
    interface Request{
        token:jwtDataDto;
    }
}