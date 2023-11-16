import * as Validator from 'class-validator';

export class AddAdministratorDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[a-z][a-z0-9\.]{0,30}[a-z0-9]$/)
    username:string;
    @Validator.IsNotEmpty()
    @Validator.Length(6,30)
    password:string;
    phone_number:string;
    address:string;
    description:string;
}