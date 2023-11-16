import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { addRatingDto } from "dto/ratings/add.ratings.dto";
import { Ratings } from "src/entities/ratings.entity";
import { ApiResponse } from "src/misc/api.response";
import { ratingService } from "src/services/ratings/ratings.services";

@Controller('api/ratings')
export class ratingsController{
    constructor(private readonly ratingsService:ratingService,
    ){}

    @Get('admin/:adminId')
    async getbyAdmin(@Param('adminId') adminId:number){
        return await this.ratingsService.getByAdmin(adminId);
    }

    @Get('user/:userId')
    async getbyUser(@Param('userId') userId:number){
        return await this.ratingsService.getByUser(userId);
    }
         
    @Put('add/:userId/:administratorId')
    addRating(@Param('userId') userId:number, @Param('administratorId') administratorId:number, @Body() data:addRatingDto):Promise<Ratings|ApiResponse>{
        return this.ratingsService.addRating(userId,administratorId,data);
    }
}