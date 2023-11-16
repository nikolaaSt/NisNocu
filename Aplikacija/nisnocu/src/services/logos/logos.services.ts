import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Logos } from "src/entities/logo.entity";
import { Administrator } from "src/entities/administrator.entity";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";
@Injectable() 
export class LogosService extends TypeOrmCrudService<Logos> { 
    constructor(
        @InjectRepository(Logos)
        private readonly Logos: Repository<Logos>,
        
    ){ super(Logos); }

    add(newLogo:Logos):Promise<Logos>{
        return this.Logos.save(newLogo);
    }

    getByAdministrator(administratorId:number):Promise<Logos[]|ApiResponse>{
        return this.Logos.find({where:{administratorId:administratorId}});
    }

    getAll():Promise<Logos[]>{
        return this.Logos.find();
    }

}