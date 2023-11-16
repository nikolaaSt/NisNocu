export class jwtDataUserDto{
    id:number;
    email:string;
    exp:number;
    ip:string;
    ua:string;
    toPlainObject(){
        return{
            id:this.id,
            email:this.email,
            exp:this.exp,
            ip:this.ip,
            ua:this.ua
        }
    }
}