import { Injectable, Param, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddAdministratorDto } from "dto/administrator/add.administrator.dto";
import { Administrator } from "src/entities/administrator.entity";
import { Admin, Repository } from "typeorm";
import * as crypto from"crypto";
import { EditAdministratorDto } from "dto/administrator/edit.administrator.dto";
import { ApiResponse } from "src/misc/api.response";
import { UserToken } from "src/entities/usertoken.entity";
import { AdministratorToken } from "src/entities/administratortoken.entity";
import { Ratings } from "src/entities/ratings.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { storageConfig } from "config/storage.config";
import {diskStorage} from "multer";
import { EditAdministratorLogoDto } from "dto/administrator/edit.administrator.logo.dto";

@Injectable()
export class AdministratorService{
    constructor(
        @InjectRepository(Administrator)
        private readonly administrator:Repository<Administrator>,
        @InjectRepository(AdministratorToken)
        private readonly administratorToken:Repository<AdministratorToken>,
    ){}

    getAll():Promise<Administrator[]>{
       return this.administrator.find();
    }

   async getByUsername(username:string):Promise<Administrator>{
        const admin=await this.administrator.findOne({where:{username:username}})
        if(admin){
            return admin;
        }
        return null;
    }

    getById(id:number):Promise<Administrator>{
        return this.administrator.findOne({where:{administratorId:id}});
    }
    //superadmin samo
   async add(data:AddAdministratorDto):Promise<Administrator|ApiResponse>{
        const passwordHash=crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString=passwordHash.digest('hex').toUpperCase();
        let newAdmin:Administrator=new Administrator();
        newAdmin.username=data.username;
        newAdmin.passwordHash=passwordHashString;
        newAdmin.phoneNumber=data.phone_number;
        newAdmin.address=data.address;
        newAdmin.description=data.description;

        try{
            const savedAdmin=await this.administrator.save(newAdmin);
            if(!savedAdmin){
                throw new Error('error');
            }
            return savedAdmin;
        }catch(e){
            return new ApiResponse('error', 52,'error');
        }
    }
    //administrator
    async edit(id:number, data:EditAdministratorDto):Promise<Administrator|ApiResponse>{
        let edited:Administrator=await this.administrator.findOne({where:{administratorId:id}})
            if(data.phone_number!==''){
            edited.phoneNumber=data.phone_number;}
            if(data.address!==''){
            edited.address=data.address;}
            if(data.description!==''){
            edited.description=data.description;}

        try{
            const savedAdmin=await this.administrator.save(edited);
            if(!savedAdmin){
                throw new Error('error');
            }
            return savedAdmin;
        }catch(e){
            return new ApiResponse('error', 52,'error');
        }
    }

   /* async editLogo(id:number, data:EditAdministratorLogoDto):Promise<Administrator|ApiResponse>{
        let edited:Administrator=await this.administrator.findOne({where:{administratorId:id}});
        edited.logoPath=data.logoPath;

        try{
            const savedAdmin=await this.administrator.save(edited);
            if(!savedAdmin){
                throw new Error('error');
            }
            return savedAdmin;
        }catch(e){
            return new ApiResponse('error', 52,'error');
        }
    }*/
    async addToken(administratorId:number,token:string,expiresAt:string){
        const administratorToken=new AdministratorToken();
        administratorToken.administratorId=administratorId;
        administratorToken.token=token;
        administratorToken.expiresAt=expiresAt;

        return await this.administratorToken.save(administratorToken);
    }

    async getAdministratorToken(token:string):Promise<AdministratorToken>{
        return await this.administratorToken.findOne({where:{token:token}});
    }

    async invalidateToken(token:string):Promise<AdministratorToken|ApiResponse>{
        const administratorToken=await this.administratorToken.findOne({where:{
            token:token,
        }});

        if(!administratorToken){
            return new ApiResponse('ERROR', -10000, 'haos');
        }
        administratorToken.isValid=0;

        await this.administratorToken.save(administratorToken);
        return await this.getAdministratorToken(token);
    }

    async invalidateUserTokens(administratorId:number):Promise<AdministratorToken[]|null>{
        const userTokens=await this.administratorToken.find({where:{
            administratorId:administratorId,
        }});

        const results=[];

        for(const administratorToken of userTokens){
            results.push(this.invalidateToken(administratorToken.token));
        }

        return results;
    }

    async deleteAdmin(administratorId:number){
        const pendingDelete=await this.administrator.findOne({where:{administratorId:administratorId}})
        this.administrator.delete(pendingDelete);
    }

}

