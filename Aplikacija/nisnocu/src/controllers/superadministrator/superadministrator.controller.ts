import { Controller,Get,Put,Param,Body,Post } from "@nestjs/common";
import {  AddSuperadministratorDto } from "dto/Superadministrator/add.Superadministrator.dto";
import { EditSuperadministratorDto } from "dto/Superadministrator/edit.Superadministrator.dto";
import { Superadministrator } from "src/entities/Superadministrator.entity";
import { ApiResponse } from "src/misc/api.response";
import { SuperadministratorService } from "src/services/superadministrator/superadministrator.service";

@Controller('api/superadministrator')
export class SuperadministratorController{
    constructor(private SuperadministratorService: SuperadministratorService) {}
    @Get()
    getAll():Promise<Superadministrator[]>{
        return this.SuperadministratorService.getAll();
    }
    @Get(':id')
    getById(@Param('id') SuperadministratorId:number):Promise<Superadministrator>{
        return this.SuperadministratorService.getById(SuperadministratorId);
    }

    @Put('add')
    async add(@Body() data: AddSuperadministratorDto):Promise<Superadministrator|ApiResponse>{
        return await this.SuperadministratorService.addSuperadministrator(data);
    }

    @Post(':id')
    edit(@Param('id') id:number, @Body() data:EditSuperadministratorDto):Promise<Superadministrator|ApiResponse>{
        return this.SuperadministratorService.edit(id,data);
    }
    //brisanje admina,tokeni
}

