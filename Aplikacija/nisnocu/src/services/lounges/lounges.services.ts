import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Lounges } from "src/entities/Lounges.entity";
import { Repository } from "typeorm";
@Injectable() 
export class LoungesService extends TypeOrmCrudService<Lounges>{ //crud sluzi za create, add, edit itd neke najosnovnije funkcije
    constructor(
        @InjectRepository(Lounges)
        private readonly Lounges: Repository<Lounges> // !!!!
    ){
        super(Lounges); //super constructor
    }
}