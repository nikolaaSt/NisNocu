import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { qrcode } from "src/entities/qrcode.entity";
import { Administrator } from "src/entities/administrator.entity";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";
import { qrcodeDto } from "dto/qrcode/qrcode.dto";
import { storageConfig } from "config/storage.config";
@Injectable() 
export class qrcodeService extends TypeOrmCrudService<qrcode> { 
    constructor(
        @InjectRepository(qrcode)
        private readonly qrcode: Repository<qrcode>,
        
    ){ super(qrcode); }

    add(newQr:qrcode):Promise<qrcode>{
        return this.qrcode.save(newQr);
    }

    getByReservation(reservationId:number):Promise<qrcode[]|ApiResponse>{
        return this.qrcode.find({where:{reservationId:reservationId}});
    }

    getAll():Promise<qrcode[]>{
        return this.qrcode.find();
    }
    async addNew(reservationId:number, data:qrcodeDto)
    {
        data.reservationId=reservationId;
        let randomPart:string=
                    new Array(10)
                    .fill(0)
                    .map(e=>(Math.random()*9).toFixed(0).toString())
                    .join('');
        const qrname='ronaldo'+randomPart+'.png';
        const qr=require('qrcode');

        let qrData='reservationId: '+data.reservationId+' ime:'+ data.forename+' prezime:' + data.surname+ ' nadimak:' +data.nickname +' broj telefona:'+data.phoneNumber;
        let qrJson=JSON.stringify(qrData);
        qr.toFile(storageConfig.photo.photosDestination+qrname,qrJson,function(err){
            if(err) return console.log('error');
        });
        const newQr:qrcode=new qrcode();
        newQr.reservationId=reservationId;
        newQr.qrPath=qrname;
        try{
            const savedQr=await this.qrcode.save(newQr);
            if(!savedQr){
            throw new Error('error');
        }
        return savedQr;
        }
        catch(e){
            return new ApiResponse('error', 69,'error');
        }
    }

    async deleteQr(reservationId:number){
        let pendingDelete:qrcode[]=await this.qrcode.find({where:{reservationId:reservationId}})
        for(let i=0;i<pendingDelete.length;i++){
          await this.qrcode.delete(pendingDelete[i]);
          console.log(pendingDelete[i]);
        }
        return; 
    }
    
}