import { Controller, Get, Param } from "@nestjs/common";
import { Logos } from "src/entities/logo.entity";
import { ApiResponse } from "src/misc/api.response";
import { LogosService } from "src/services/logos/logos.services";

@Controller('api/logos') 
export class logosController {
    constructor(
        private readonly logosService:LogosService,
    ){}
    
    @Get()
    getAll():Promise<Logos[]>{
        return this.logosService.getAll();
    }

    @Get(':id')
    getByAdministrator(@Param('administratorId') adminsitratorId:number):Promise<Logos[]|ApiResponse>{
        return this.logosService.getByAdministrator(adminsitratorId);
    }
}