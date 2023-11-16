import { Controller,Get,Put,Param,Body,Post, SetMetadata, UseGuards, UseInterceptors, UploadedFile, Req, Patch, Delete } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { storageConfig } from "config/storage.config";
import { AddAdministratorDto } from "dto/administrator/add.administrator.dto";
import { EditAdministratorDto } from "dto/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator.entity";
import { AllowToRoles } from "src/misc/allow.to.roles.desc";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AdministratorService } from "src/services/administrator/administrator.service";
import {diskStorage} from "multer";
import { PhotosService } from "src/services/photos/photos.services";
import { Photos } from "src/entities/photos.entity";
import * as fs from "fs";
import * as sharp from "sharp";
import { ApiResponse } from "src/misc/api.response";
import { Logos } from "src/entities/logo.entity";
import { LogosService } from "src/services/logos/logos.services";


@Controller('api/administrator')
export class AdministratorController{
    constructor(private administratorService: AdministratorService,
                public photoService: PhotosService,
                public logosService:LogosService) {}
    @Get()
    getAll():Promise<Administrator[]>{
        return this.administratorService.getAll();
    }

    @Get('toprated')
   async getTopRatedPlaces():Promise<Administrator[]>{
        let ronaldo;
        let places=await this.administratorService.getAll();
        console.log(places);
        for(let i=0; i<=places.length-1; i++){
            for(let j=i+1;j<=places.length-1;j++){
                if(places[i].averageRating<places[j].averageRating){
                    ronaldo=places[i].averageRating;
                    places[i].averageRating=places[j].averageRating;
                    places[j].averageRating=ronaldo;
                }
            }
        }
        console.log(places);
         return places;
    }
   
    @Get(':id')
    getById(@Param('id') administratorId:number):Promise<Administrator>{
        return this.administratorService.getById(administratorId);
    }
    @Put('add')
    // @UseGuards(RoleCheckerGuard)
    // @AllowToRoles('superadministrator')
    add(@Body() data:AddAdministratorDto):Promise<Administrator|ApiResponse>{
        return this.administratorService.add(data);
    }

    @Patch('edit/:id')
    // @UseGuards(RoleCheckerGuard)
    // @AllowToRoles('superadministrator','administrator')
    edit(@Param('id') id:number, @Body() data:EditAdministratorDto):Promise<Administrator|ApiResponse>{
        return this.administratorService.edit(id,data);
    }

  /*  @Patch(':id/editLogo')
    //@UseGuards(RoleCheckerGuard)
    //@AllowToRoles('superadministrator','administrator')
    async editLogo(@Param('id') id:number, @Body() data:EditAdministratorDto):Promise<Administrator|ApiResponse>{
        return await this.administratorService.edit(id,data);
    }*/

    //brisanje admina,tokeni

   @Post(':id/uploadPhoto/')
    //@UseGuards(RoleCheckerGuard)
    //@AllowToRoles('superadministrator','administrator')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage:diskStorage({
                destination:storageConfig.photo.photosDestination,
                filename:(req,file,callback)=>{
                    
                    let original:string=file.originalname;
                    console.log(file.originalname);
                    let normalized=original.replace(/\s+/g,'-');
                    let sada=new Date();
                    let part='';
                    part+=sada.getFullYear().toString();
                    part+=(sada.getMonth()+1).toString();
                    part+=sada.getDate().toString();

                    let randomPart:string=
                    new Array(10)
                    .fill(0)
                    .map(e=>(Math.random()*9).toFixed(0).toString())
                    .join('');
                    let fileName=part+'-'+randomPart+'-'+normalized;

                    callback(null,fileName);
                }
            }),
          /*  fileFilter:(req,file,callback)=>{
                console.log(file.originalname);
                if(!file.originalname.match(/\.(jpg|png)$/)){
                   //let fileFilterError='Bad file extension';
                    callback(null, false);
                    return;
                }

                console.log('prvi:', req.fileFilterError);

                if(!file.mimetype.includes('jpeg')||!file.mimetype.includes('png')){
                   // req.fileFilterError='Bad file content';
                    callback(null, false);
                    return;
                }
                callback(null,true);
            }*/
            limits:{
                files:5,
                fieldSize:storageConfig.photo.photoMaxFileSize,
            }
        })
    )
     async uploadPhoto(@Param('id') administratorId:number,@UploadedFile() photo,@Req() req):Promise<ApiResponse|Photos>{
      //  if(req.fileFilterError){
        //   return new ApiResponse('error', 9393, 'da');
       //}
        if(!photo){
            console.log(photo);
            return new ApiResponse('error', 9393, 'los fajl');
        }

    //    await this.createThumb(photo);
      //  await this.createSmallImage(photo);

        const newPhoto:Photos=new Photos();
        newPhoto.administratorId=administratorId;
        newPhoto.imagePath=photo.filename;

        const savedPhoto=await this.photoService.add(newPhoto);

        if(!savedPhoto){
            return null;
        }
        
        return savedPhoto;
    }

    @Delete(':id/delete')
    async deleteAdmin(@Param('id') id:number){
        return await this.administratorService.deleteAdmin(id);
    }

    @Post(':id/logo/')
    //@UseGuards(RoleCheckerGuard)
    //@AllowToRoles('superadministrator','administrator')
    @UseInterceptors(
        FileInterceptor('logo', {
            storage:diskStorage({
                destination:'../logo',
                filename:(req,file,callback)=>{
                    
                    let original:string=file.originalname;
                    console.log(file.originalname);
                    let normalized=original.replace(/\s+/g,'-');
                    let sada=new Date();
                    let part='';
                    part+=sada.getFullYear().toString();
                    part+=(sada.getMonth()+1).toString();
                    part+=sada.getDate().toString();

                    let randomPart:string=
                    new Array(10)
                    .fill(0)
                    .map(e=>(Math.random()*9).toFixed(0).toString())
                    .join('');
                    let fileName=part+'-'+randomPart+'-'+normalized;

                    callback(null,fileName);
                }
            }),
          /*  fileFilter:(req,file,callback)=>{
                console.log(file.originalname);
                if(!file.originalname.match(/\.(jpg|png)$/)){
                   //let fileFilterError='Bad file extension';
                    callback(null, false);
                    return;
                }

                console.log('prvi:', req.fileFilterError);

                if(!file.mimetype.includes('jpeg')||!file.mimetype.includes('png')){
                   // req.fileFilterError='Bad file content';
                    callback(null, false);
                    return;
                }
                callback(null,true);
            }*/
            limits:{
                files:5,
                fieldSize:storageConfig.photo.photoMaxFileSize,
            }
        })
    )
     async uploadLogo(@Param('id') administratorId:number,@UploadedFile() logo,@Req() req):Promise<ApiResponse|Logos>{
      //  if(req.fileFilterError){
        //   return new ApiResponse('error', 9393, 'da');
       //}
        if(!logo){
            console.log(logo);
            return new ApiResponse('error', 9393, 'los fajl');
        }

    //    await this.createThumb(photo);
      //  await this.createSmallImage(photo);

        const newLogo:Logos=new Logos();
        newLogo.administratorId=administratorId;
        newLogo.logoPath=logo.filename;

        const savedLogo=await this.logosService.add(newLogo);

        if(!savedLogo){
            return null;
        }
        
        return savedLogo;
    }



   async createThumb(photo){
        const originalFilePath=photo.path;
        const fileName=photo.filename;

        const destinationFilePath=storageConfig.photo.photosDestination+"thumb/"+fileName;

       await sharp(originalFilePath)
        .resize({
            fit:'cover',
            width:storageConfig.photo.photoThumbSize.width,
            height:storageConfig.photo.photoThumbSize.height,
        })
        .toFile(destinationFilePath);
    }


    async createSmallImage(photo){
        const originalFilePath=photo.path;
        const fileName=photo.filename;

        const destinationFilePath=storageConfig.photo.photosDestination+"small/"+fileName;

       await sharp(originalFilePath)
        .resize({
            fit:'cover',
            width:storageConfig.photo.photoSmallSize.width,
            height:storageConfig.photo.photoSmallSize.height,
        })
        .toFile(destinationFilePath);
    }

  

}
