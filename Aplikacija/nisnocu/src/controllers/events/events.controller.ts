import { Body, Controller, Delete, Get, Param, Put,Post, Patch } from "@nestjs/common";
import { AddEventDto } from "dto/events/add.event.dto";
import { editEventDto } from "dto/events/edit.event.dto";
import { Events } from "src/entities/events.entity";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { EventsService } from "src/services/events/events.services";
import { qrcodeService } from "src/services/qrcode/qrcode.services";
import { ReservationsService } from "src/services/reservations/reservations.services";

@Controller('api/events')
export class eventsController{
    constructor(private readonly eventsService:EventsService,
                private readonly administratorService:AdministratorService,
                private readonly reservationService:ReservationsService,
                private readonly qrcodeService:qrcodeService){}

    @Get()
    getAll():Promise<Events[]>{
        return this.eventsService.getAll();
    }

    @Get(':id')
    getById(@Param('id') EventsId:number):Promise<Events|ApiResponse>{
        return this.eventsService.getById(EventsId);
    }

    @Get('date/:date')
    getByDate(@Param('date') date:string):Promise<Events[]|ApiResponse>{
        return this.eventsService.getByDate(date);
    }

    @Get('admin/:adminId')
    getByAdmin(@Param('adminId') adminId:number):Promise<Events[]>{
        return this.eventsService.getByAdmin(adminId);
    }

    @Put('add/:id')
    addEvent(@Param('id') id:number, @Body() data:AddEventDto):Promise<Events|ApiResponse>{
        return this.eventsService.addEvent(id,data);
    }

    @Delete(':id')
    async removeEvent(@Param('id') EventsId:number){
        await this.qrcodeService.deleteQr(EventsId);
        await this.reservationService.deleteByEvent(EventsId);
        return await this.eventsService.deleteEvent(EventsId);
    }

    @Patch('edit/:id')
    editEvent(@Param('id') EventsId:number, @Body() data:editEventDto):Promise<Events|ApiResponse>{
        return this.eventsService.editEvent(EventsId,data);
    }   
}
