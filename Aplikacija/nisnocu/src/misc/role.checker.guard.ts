import { CanActivate, Injectable } from "@nestjs/common";
import {Observable} from 'rxjs';
import { Request } from "express";
import { Reflector } from "@nestjs/core";
@Injectable()
export class RoleCheckerGuard implements CanActivate{

    constructor(private reflector:Reflector){}
    canActivate(context:import("@nestjs/common").ExecutionContext):boolean|Promise<boolean>|import("rxjs").Observable<boolean>{
        const req:Request=context.switchToHttp().getRequest();
        const role=req.token.role;

        const allowedToRoles=this.reflector.get<("administrator"|"user"|"superadministrator")[]>('allow_to_roles',context.getHandler());
        if(!allowedToRoles.includes(role)){
            return false;
        }

        return true;
    }
}