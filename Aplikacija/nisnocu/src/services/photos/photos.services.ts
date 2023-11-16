import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Photos } from "src/entities/Photos.entity";
import { Administrator } from "src/entities/administrator.entity";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";
@Injectable() 
export class PhotosService extends TypeOrmCrudService<Photos> { 
    constructor(
        @InjectRepository(Photos)
        private readonly Photos: Repository<Photos>,
        
    ){ super(Photos); }

    add(newPhoto:Photos):Promise<Photos>{
        return this.Photos.save(newPhoto);
    }

    getByAdministrator(administratorId:number):Promise<Photos[]|ApiResponse>{
        return this.Photos.find({where:{administratorId:administratorId}});
    }

    getAll():Promise<Photos[]>{
        return this.Photos.find();
    }

}