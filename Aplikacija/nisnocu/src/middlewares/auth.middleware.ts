import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { jwtDataDto } from "dto/auth/jwt.data.dto";
import { NextFunction,Request,Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { jwtSecret } from "config/jwt.secret";
import * as jwt from "jsonwebtoken";
import { UserService } from "src/services/user/user.services";
import { SuperadministratorService } from "src/services/superadministrator/superadministrator.service";
import { User } from "src/entities/user.entity";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(public administratorService:AdministratorService,
                private readonly userService:UserService,
                public superadministratorService:SuperadministratorService){}
   async use(req: Request, res: Response, next: NextFunction)  {
        if(!req.headers.authorization){
            throw new HttpException('Token not found!', HttpStatus.UNAUTHORIZED);
        }

        const token =req.headers.authorization;

        const tokenParts=token.split(' ');
        if(tokenParts.length!==2){
            throw new HttpException('Token not found!!', HttpStatus.UNAUTHORIZED);
        }

        const tokenString=tokenParts[1];

        let jwtData:jwtDataDto;

        try{
            jwtData=jwt.verify(tokenString,jwtSecret);
        }
        catch(e){
            throw new HttpException('Token not found!!!', HttpStatus.UNAUTHORIZED);
        }
        if (!jwtData){
            throw new HttpException('Token not found!!!!', HttpStatus.UNAUTHORIZED);
        }


        if(jwtData.ip!==req.ip.toString()){
            throw new HttpException('Token not found!!!!!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ua!==req.headers["user-agent"]){
            throw new HttpException('Token not found!!!!!!', HttpStatus.UNAUTHORIZED);
        }


        if(jwtData.role==="administrator"){
        const administrator=await this.administratorService.getById(jwtData.id);
        if (!administrator){
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }
    } 

    else if(jwtData.role==="superadministrator"){
        const superadministrator=await this.superadministratorService.getById(jwtData.id);
        if (!superadministrator){
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }
    }
   
    else if(jwtData.role==="user") {
        console.log(jwtData.role);
        console.log(jwtData.identity);
        console.log(typeof(jwtData.id));
       let korisnik:User=await this.userService.getById(jwtData.id);
        if (!korisnik){
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }
    }

    const thisMoment=new Date().getTime()/1000;

         if(thisMoment>=jwtData.exp){
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }

        req.token=jwtData;

        next();
    }

}