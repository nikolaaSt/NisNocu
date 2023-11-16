import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Tables } from "src/entities/tables.entity";
import { Repository } from "typeorm";
@Injectable() 
export class TablesService extends TypeOrmCrudService<Tables>{ //crud sluzi za create, add, edit itd neke najosnovnije funkcije
    constructor(
        @InjectRepository(Tables)
        private readonly Tables: Repository<Tables> // !!!!
    ){
        super(Tables); //super constructor
    }
}