import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddSuperadministratorDto } from "dto/Superadministrator/add.Superadministrator.dto";
import { Superadministrator } from "src/entities/Superadministrator.entity";
import { Admin, Repository } from "typeorm";
import * as crypto from"crypto";
import { EditSuperadministratorDto } from "dto/Superadministrator/edit.Superadministrator.dto";
import { ApiResponse } from "src/misc/api.response";
import { SuperadministratorToken } from "src/entities/superadministrator.token.entity";

@Injectable()
export class SuperadministratorService{
    constructor(
        @InjectRepository(Superadministrator)
        private readonly Superadministrator:Repository<Superadministrator>,
        @InjectRepository(SuperadministratorToken)
        private readonly superadministratorToken:Repository<SuperadministratorToken>
    ){}

    getAll():Promise<Superadministrator[]>{
       return this.Superadministrator.find();
    }

    getById(id:number):Promise<Superadministrator>{
        return this.Superadministrator.findOne({where:{superadministratorId:id}});
    }
    async getByUsername(username:string):Promise<Superadministrator>{
        const superadmin=await this.Superadministrator.findOne({where:{username:username}})
        if(superadmin){
            return superadmin;
        }
        return null;
    }

   async addSuperadministrator(data: AddSuperadministratorDto):Promise<Superadministrator|ApiResponse>{
        const passwordHash=crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString=passwordHash.digest('hex').toUpperCase();
       const newSuper:Superadministrator=new Superadministrator();
        newSuper.username=data.username;
        newSuper.passwordHash=passwordHashString;
        console.log(newSuper);
        try {
            const savedSuper=await this.Superadministrator.save(newSuper);
            if(!savedSuper){
                throw new Error('error');
            }
            return savedSuper;
        }
        catch(e){
            return new ApiResponse('error', 2222, 'error'); 
        }
    }

    async edit(id:number, data:EditSuperadministratorDto):Promise<Superadministrator|ApiResponse>{
        let editedSuper:Superadministrator=await this.Superadministrator.findOne({where:{superadministratorId:id}})
        const passwordHash=crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString=passwordHash.digest('hex').toUpperCase();
        
        editedSuper.passwordHash=passwordHashString;
        

        try {
            const savedSuper=await this.Superadministrator.save(editedSuper);
            if(!savedSuper){
                throw new Error('error');
            }
            return savedSuper;
        }
        catch(e){
            return new ApiResponse('error', -6969,'failed adding reservation');
        }
    }
    async addToken(superadministratorId:number,token:string,expiresAt:string){
        const superadministratorToken=new SuperadministratorToken();
        superadministratorToken.superadministratorId=superadministratorId;
        superadministratorToken.token=token;
        superadministratorToken.expiresAt=expiresAt;

        return await this.superadministratorToken.save(superadministratorToken);
    }

    async getSuperAdministratorToken(token:string):Promise<SuperadministratorToken>{
        return await this.superadministratorToken.findOne({where:{token:token}});
    }

    async invalidateToken(token:string):Promise<SuperadministratorToken|ApiResponse>{
        const superadministratorToken=await this.superadministratorToken.findOne({where:{
            token:token,
        }});

        if(!superadministratorToken){
            return new ApiResponse('ERROR', -10000, 'haos');
        }
        superadministratorToken.isValid=0;

        await this.superadministratorToken.save(superadministratorToken);
        return await this.getSuperAdministratorToken(token);
    }

    async invalidateSuperAdministratorTokens(superadministratorId:number):Promise<SuperadministratorToken[]|null>{
        const userTokens=await this.superadministratorToken.find({where:{
            superadministratorId:superadministratorId,
        }});

        const results=[];

        for(const superadministratorToken of userTokens){
            results.push(this.invalidateToken(superadministratorToken.token));
        }

        return results;
    }

}