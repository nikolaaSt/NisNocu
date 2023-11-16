import { Controller, Get, Param } from "@nestjs/common";
import { Photos } from "src/entities/photos.entity";
import { ApiResponse } from "src/misc/api.response";
import { PhotosService } from "src/services/photos/photos.services";

@Controller('api/photos') 
export class photosController {
    constructor(
        private readonly photosService:PhotosService,
    ){}
    
    @Get()
    getAll():Promise<Photos[]>{
        return this.photosService.getAll();
    }

    @Get(':id')
    getByAdministrator(@Param('administratorId') adminsitratorId:number):Promise<Photos[]|ApiResponse>{
        return this.photosService.getByAdministrator(adminsitratorId);
    }
}