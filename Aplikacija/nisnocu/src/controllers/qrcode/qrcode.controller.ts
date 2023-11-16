import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { qrcodeDto } from "dto/qrcode/qrcode.dto";
import { qrcode } from "src/entities/qrcode.entity";
import { ApiResponse } from "src/misc/api.response";
import { qrcodeService } from "src/services/qrcode/qrcode.services";

@Controller('api/qrcode') 
export class qrcodeController {
    constructor(
        private readonly qrcodeService:qrcodeService,
    ){}
    
    @Get()
    getAll():Promise<qrcode[]>{
        return this.qrcodeService.getAll();
    }

    @Get(':id')
    getByReservation(@Param('reservationId') reservationId:number):Promise<qrcode[]|ApiResponse>{
        return this.qrcodeService.getByReservation(reservationId);
    }

    @Put('ronaldo/:reservationId')
   async addNew(@Param('reservationId') reservationId:number, @Body() data:qrcodeDto){
        return await this.qrcodeService.addNew(reservationId,data)
    }

    @Delete('event/:id')
    removebyEvent(@Param('id') EventId:number){
        return this.qrcodeService.deleteQr(EventId);
    }
}