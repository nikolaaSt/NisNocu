import { Controller,Get,Put,Param,Body,Post, Patch, Delete } from "@nestjs/common";
import { EditUserDto } from "dto/User/edit.user.dto";
import { qrcodeDto } from "dto/qrcode/qrcode.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response";
import { UserService } from "src/services/user/user.services";

@Controller('api/user')
export class UserController{
    constructor(private UserService: UserService) {}
    @Get()
    getAll():Promise<User[]>{
        return this.UserService.getAll();
    }

    @Get(':id')
    getById(@Param('id') UserId:number):Promise<User>{
        return this.UserService.getById(UserId);
    }

   /* @Put()
    add(@Body() data:AddSuperadministratorDto):Promise<Superadministrator>{
        return this.userService.add(data);
    }*/

    @Patch(':id')
    edit(@Param('id') id:number, @Body() data:EditUserDto):Promise<User|ApiResponse>{
        return this.UserService.edit(id,data);
    }



}

