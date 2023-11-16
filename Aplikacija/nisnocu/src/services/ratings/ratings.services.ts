import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { addRatingDto } from "dto/ratings/add.ratings.dto";
import { Administrator } from "src/entities/administrator.entity";
import { Ratings } from "src/entities/ratings.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class ratingService{
    constructor(
        @InjectRepository(Ratings)
        private readonly ratings: Repository<Ratings>,
        @InjectRepository(User)
        private readonly user:Repository<User>,
        @InjectRepository(Administrator)
        private readonly administrator:Repository<Administrator>){}

    async addRating(userId:number, administratorId:number, data:addRatingDto):Promise<Ratings|ApiResponse>{
        const user=await this.user.findOne({where:{userId:userId}});
        const administrator=await this.administrator.findOne({where:{administratorId:administratorId}});

        const newRating:Ratings=new Ratings();

        newRating.administratorId=administrator.administratorId;
        newRating.userId=user.userId;
        newRating.rating=data.ratings;
        newRating.comment=data.comment;

        try{
            const savedRating=this.ratings.save(newRating);

            if(!savedRating){
                throw new Error('error');
            }
            administrator.numberOfRatings++;
            administrator.rating+=newRating.rating;
            administrator.averageRating=administrator.rating/administrator.numberOfRatings;
            this.administrator.save(administrator);
            return savedRating;
            
        }catch(e){
            return new ApiResponse('error', -7000,'failed adding rating');
        }
    }

    async getByAdmin(id:number){
        const rating:Ratings[]=await this.ratings.find({where:{administratorId:id}});
        return rating;
    }

    async getByUser(id:number){
        const rating:Ratings[]=await this.ratings.find({where:{userId:id}});
        return rating;
    }
}