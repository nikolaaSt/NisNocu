import { SetMetadata } from "@nestjs/common/decorators";

export const AllowToRoles=(...roles: ("administrator"|"user"|"superadministrator")[])=>{
    return SetMetadata('allow_to_roles',roles);
};