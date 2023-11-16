import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddEventDto } from "dto/events/add.event.dto";
import { editEventDto } from "dto/events/edit.event.dto";
import { concat } from "rxjs";
import { Administrator } from "src/entities/administrator.entity";
import { Events } from "src/entities/events.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response";
import {  Repository} from "typeorm";
import { Moment } from "moment";
@Injectable() 
export class EventsService { 
    constructor(
        @InjectRepository(Events)
        private readonly events: Repository<Events>,
        @InjectRepository(Administrator)
        private readonly administrator:Repository<Administrator>
    ){}
    
    getAll():Promise<Events[]>{
        return this.events.find();
    }

    getByDate(date:string):Promise<Events[]|ApiResponse>{
        return this.events.find({where:{startsAtDate:date}});
    }

    getByAdmin(id:number):Promise<Events[]>{
        return this.events.find({where:{administratorId:id}});
    }

    getById(id:number):Promise<Events>{
        return this.events.findOne({where:{eventId:id}});
    }

   async addEvent(id:number,data:AddEventDto):Promise<Events|ApiResponse>{
        const administrator:Administrator=await this.administrator.findOne({where:{administratorId:id}});
        const newEvent:Events=new Events();
        newEvent.administratorId=administrator.administratorId;
        newEvent.description=data.description;
        newEvent.startsAtDate=data.startDate;  
        newEvent.finishesAtDate=data.finishDate; 
        newEvent.availability="Available";
        newEvent.maxLounges=data.maxLounges;
        newEvent.maxTables=data.maxTables;
        newEvent.startsAtTime=data.startHour;
        newEvent.finishesAtTime=data.finishHour;
        console.log(newEvent);
        try {
            let savedEvent= await this.events.save(newEvent);
            if(!savedEvent){
                throw new Error('error');
            }
            return savedEvent;
        }
        catch(e){
            return new ApiResponse('error', -6969,'failed adding event');
        }
    }

    async editEvent(id:number, data:editEventDto):Promise<Events|ApiResponse>{
        let editedEvent:Events=await this.events.findOne({where:{eventId:id}});
        if(data.description!==''){
        editedEvent.description=data.description;}
        if(data.finishDate!==''){
        editedEvent.finishesAtDate=data.finishDate;}
        if(data.finishHour!==''){
        editedEvent.finishesAtTime=data.finishHour;}
        if(data.startDate!==''){
            editedEvent.startsAtDate=data.startDate;
        }
        if(data.startHour!==''){
            editedEvent.startsAtTime=data.startHour;
        }
        editedEvent.availability='Available';

        try {
            const savedEvent=this.events.save(editedEvent);
            if(!savedEvent){
                throw new Error('error');
            }
            return savedEvent;
        }
        catch(e){
            return new ApiResponse('error', -6968,'failed editing event');
        }
    }

    async deleteEvent(id:number){
        let pendingDelete:Events=await this.events.findOne({where:{eventId:id}});
        this.events.delete(pendingDelete);
    }
}
