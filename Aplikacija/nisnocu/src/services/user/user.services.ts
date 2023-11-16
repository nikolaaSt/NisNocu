import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { EditUserDto } from "dto/User/edit.user.dto";
import { UserRegistrationDto } from "dto/user/user.registration.dto";
import { UserToken } from "src/entities/usertoken.entity";
import { ApiResponse } from "src/misc/api.response";
import { qrcodeDto } from "dto/qrcode/qrcode.dto";
import { storageConfig } from "config/storage.config";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly User:Repository<User>,
        @InjectRepository(UserToken)
        private readonly userToken:Repository<UserToken>
    ){}
        
    getAll():Promise<User[]>{
       return this.User.find();
    }

    async getById(id: number): Promise<User> {
        try {
          const user = await this.User.findOne({ where: { userId: id } });
          return user;
        } catch (error) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }

    getByNickname(nickname:string):Promise<User>{
       const user= this.User.findOne({where:{nickname:nickname}});
       if(user){
        return user;
       }
       return null;
    }

    async register(data:UserRegistrationDto):Promise<User|ApiResponse>{
        const passwordHash=crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString=passwordHash.digest('hex').toUpperCase();
        const newUser:User=new User();
        newUser.email=data.email;
        newUser.passwordHash=passwordHashString;
        newUser.nickname=data.nickname;
        newUser.phoneNumber=data.phone_number;
        newUser.forename=data.forename;
        newUser.surname=data.surname;
        console.log(newUser);
        try{
            const savedUser=await this.User.save(newUser);
            if(!savedUser){
                throw new Error('error');
            }
            return savedUser;
        }catch(e){
            return new ApiResponse('error', 52,'error');
        }
    }

    async edit(id:number, data:EditUserDto):Promise<User|ApiResponse>{
        let editedUser:User=await this.User.findOne({where:{userId:id}})

        

        const passwordHash=crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString=passwordHash.digest('hex').toUpperCase();
        if(data.password!==''){
        editedUser.passwordHash=passwordHashString;}

        if(data.phone_number!==''){
        editedUser.phoneNumber=data.phone_number;}
        if(data.forename!==''){
        editedUser.forename=data.forename;}
        if(data.surname!==''){
        editedUser.surname=data.surname;}
        if(data.nickname!==''){
        editedUser.nickname=data.nickname;}


        try{
            const savedUser=await this.User.save(editedUser);
            if(!savedUser){
                throw new Error('error');
            }
            return savedUser;
        }catch(e){
            return new ApiResponse('error', 52,'error');
        }
    }

    async addToken(userId:number,token:string,expiresAt:string){
        const userToken=new UserToken();
        userToken.userId=userId;
        userToken.token=token;
        userToken.expiresAt=expiresAt;

        return await this.userToken.save(userToken);
    }

    async getUserToken(token:string):Promise<UserToken>{
        return await this.userToken.findOne({where:{token:token}});
    }

    async invalidateToken(token:string):Promise<UserToken|ApiResponse>{
        const userToken=await this.userToken.findOne({where:{
            token:token,
        }});

        if(!userToken){
            return new ApiResponse('ERROR', -10000, 'haos');
        }
        userToken.isValid=0;

        await this.userToken.save(userToken);
        return await this.getUserToken(token);
    }

    async invalidateUserTokens(userId:number):Promise<UserToken[]|null>{
        const userTokens=await this.userToken.find({where:{
            userId:userId,
        }});

        const results=[];

        for(const userToken of userTokens){
            results.push(this.invalidateToken(userToken.token));
        }

        return results;
    }

}

