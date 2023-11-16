export class loginInfoDto{
    id:number;
    identity:string;
    token:string;
    refreshToken:string;
    refreshTokenExpiresAt:string;
    constructor(id:number, identity:string, jwt:string,refreshToken:string, refreshTokenExpiresAt:string){
        this.id=id;
        this.token=jwt;
        this.identity=identity;
        this.refreshToken=refreshToken;
        this.refreshTokenExpiresAt=refreshTokenExpiresAt;
    }
}

