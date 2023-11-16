import { Body, Controller, Injectable, Post, Req,Put, HttpException, HttpStatus } from "@nestjs/common";
import { loginDto } from "dto/administrator/login.administrator.dto";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { jwtDataDto } from "dto/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { UserRegistrationDto } from "dto/user/user.registration.dto";
import { UserService } from "src/services/user/user.services";
import { User } from "src/entities/user.entity";
import { loginUserDto } from "dto/auth/login.user.dto";
import { loginInfoDto } from "dto/auth/login.info.dto";
import { jwtRefreshDataDto } from "dto/auth/jwt.refresh.dto";
import { userRefreshTokenDto } from "dto/auth/user.refresh.token.dto";
import { ApiResponse } from "src/misc/api.response";
import { SuperadministratorService } from "src/services/superadministrator/superadministrator.service";

@Controller('auth')
export class AuthController{
    constructor(public administratorService:AdministratorService,
                public userService:UserService,
                public superadminsitratorService:SuperadministratorService){  }

    @Post('login')
    async login(@Body() data:loginDto, @Req() req:Request):Promise<loginInfoDto|ApiResponse>{
        const administrator=await this.administratorService.getByUsername(data.username);
        console.log(administrator);
        if (!administrator){
            const user=await this.userService.getByNickname(data.username);
        if (!user){
            const superadministrator=await this.superadminsitratorService.getByUsername(data.username)
            console.log(superadministrator);
        if(!superadministrator){
            return new Promise(resolve=>resolve(new ApiResponse('error',-3001 ,'Bad username')));}
            const passwordHash=crypto.createHash('sha512');
            passwordHash.update(data.password);
            const passwordHashString=passwordHash.digest('hex').toUpperCase();
            if(superadministrator.passwordHash!==passwordHashString){
                return new Promise(resolve=>resolve(new ApiResponse('error',-3002 ,'Bad password')));   
            }
    
            const jwtData=new jwtDataDto();
            jwtData.role="superadministrator";
            jwtData.id=superadministrator.superadministratorId;
            jwtData.identity=superadministrator.username;
            jwtData.exp=this.getDatePlus(60*60*60*60);
            jwtData.ip=req.ip.toString();
            jwtData.ua=req.headers["user-agent"];
    
            
    
            let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);
    
            const jwtRefreshData=new jwtRefreshDataDto();
            jwtRefreshData.id=jwtData.id;
            jwtRefreshData.role=jwtData.role;
            jwtRefreshData.identity=jwtData.identity;
            jwtRefreshData.exp=this.getDatePlus(60*60*24*31);
            jwtRefreshData.ip=jwtData.ip;
            jwtRefreshData.ua=jwtData.ua;
    
            let refreshToken:string=jwt.sign(jwtRefreshData.toPlainObject(),jwtSecret);
    
            const responseObject=new loginInfoDto(
                superadministrator.superadministratorId,
                superadministrator.username,
                token,
                refreshToken,
                this.getIsoDate(jwtRefreshData.exp)
            );
            await this.superadminsitratorService.addToken(superadministrator.superadministratorId,refreshToken,this.getDatabaseDateFormat(this.getIsoDate(jwtRefreshData.exp)));
    
            return new Promise(resolve=>resolve(responseObject));
        }

        const passwordHash=crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString=passwordHash.digest('hex').toUpperCase();
        if(user.passwordHash!==passwordHashString){
            return new Promise(resolve=>resolve(new ApiResponse('error',-3002 ,'Bad password')));   
        }

        const jwtData=new jwtDataDto();
        jwtData.role="user";
        jwtData.id=user.userId;
        jwtData.identity=user.nickname;
        jwtData.exp=this.getDatePlus(60*10);
        jwtData.ip=req.ip.toString();
        jwtData.ua=req.headers["user-agent"];


        let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const jwtRefreshData=new jwtRefreshDataDto();
        jwtRefreshData.id=jwtData.id;
        jwtRefreshData.role=jwtData.role;
        jwtRefreshData.identity=jwtData.identity;
        jwtRefreshData.exp=this.getDatePlus(60*60*24*31);
        jwtRefreshData.ip=jwtData.ip;
        jwtRefreshData.ua=jwtData.ua;

        let refreshToken:string=jwt.sign(jwtRefreshData.toPlainObject(),jwtSecret);

        const responseObject=new loginInfoDto(
            user.userId,
            user.email,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp),
        );

       
        await this.userService.addToken(user.userId,refreshToken,this.getDatabaseDateFormat(this.getIsoDate(jwtRefreshData.exp)));

        return new Promise(resolve=>resolve(responseObject));
        }
        const passwordHash=crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString=passwordHash.digest('hex').toUpperCase();
        if(administrator.passwordHash!==passwordHashString){
            return new Promise(resolve=>resolve(new ApiResponse('error',-3002 ,'Bad password')));   
        }

        const jwtData=new jwtDataDto();
        jwtData.role="administrator";
        jwtData.id=administrator.administratorId;
        jwtData.identity=administrator.username;
        jwtData.exp=this.getDatePlus(60*60);
        jwtData.ip=req.ip.toString();
        jwtData.ua=req.headers["user-agent"];

        

        let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const jwtRefreshData=new jwtRefreshDataDto();
        jwtRefreshData.id=jwtData.id;
        jwtRefreshData.role=jwtData.role;
        jwtRefreshData.identity=jwtData.identity;
        jwtRefreshData.exp=this.getDatePlus(60*60*24*31);
        jwtRefreshData.ip=jwtData.ip;
        jwtRefreshData.ua=jwtData.ua;

        let refreshToken:string=jwt.sign(jwtRefreshData.toPlainObject(),jwtSecret);

        const responseObject=new loginInfoDto(
            administrator.administratorId,
            administrator.username,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp)
        );
        await this.administratorService.addToken(administrator.administratorId,refreshToken,this.getDatabaseDateFormat(this.getIsoDate(jwtRefreshData.exp)));

        return new Promise(resolve=>resolve(responseObject));
    }

    @Put('user/register')
    async userRegister(@Body() data: UserRegistrationDto): Promise<User|ApiResponse>{
        return await this.userService.register(data);
    }

    @Post('user/refresh')

    async userTokenRefresh(@Req() req:Request,@Body() data:userRefreshTokenDto){
        const userToken=await this.userService.getUserToken(data.token);
        if(!userToken){
            return new ApiResponse('ERROR', -10000, 'haos');
        }

        if(userToken.isValid===0){
            return new ApiResponse('ERROR', -10000, 'haos');
        }

        const now=new Date();
        const expires=new Date(userToken.expiresAt);

        if(expires.getTime()<now.getTime()){
            return new ApiResponse('ERROR', -10000, 'haos');
        }

        let jwtRefreshData:jwtRefreshDataDto;

        try{
            jwtRefreshData=jwt.verify(data.token,jwtSecret);
        } catch(e){
            throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED);
        }
        if (!jwtRefreshData){
            throw new HttpException('Token not found!', HttpStatus.UNAUTHORIZED);
        }


        if(jwtRefreshData.ip!==req.ip.toString()){
            throw new HttpException('Token not found!!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtRefreshData.ua!==req.headers["user-agent"]){
            throw new HttpException('Token not found!!!', HttpStatus.UNAUTHORIZED);
        }

        const jwtData=new jwtDataDto();
        jwtData.role=jwtRefreshData.role;
        jwtData.id=jwtRefreshData.id;
        jwtData.identity=jwtRefreshData.identity;
        jwtData.exp=this.getDatePlus(60*10);
        jwtData.ip=jwtRefreshData.ip;
        jwtData.ua=jwtRefreshData.ua;


        let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const responseObject=new loginInfoDto(
            jwtData.id,
            jwtData.identity,
            token,
            data.token,
            this.getIsoDate(jwtRefreshData.exp),
        );

        return responseObject;
    }

    private getDatePlus(numberOfSeconds:number):number{
       return new Date().getTime()/1000+numberOfSeconds;
    }



    private getIsoDate(timestamp:number):string{
        const date=new Date();
        date.setTime(timestamp*1000);
        return date.toISOString();
    }

    private getDatabaseDateFormat(isoFormat:string):string{
        return isoFormat.substr(0,19).replace('T',' ');
    }
}