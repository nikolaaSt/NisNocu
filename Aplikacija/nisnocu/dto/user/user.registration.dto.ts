import * as Validator from 'class-validator';

export class UserRegistrationDto {
  @Validator.IsNotEmpty()
  @Validator.IsString()
  // @Validator.Matches(/^[a-z][a-z0-9.@]{0,30}[a-z0-9]$/)
  email: string;

  @Validator.IsNotEmpty()
  @Validator.Length(6, 30)
  password: string;

  @Validator.IsNotEmpty()
  @Validator.IsString()
  // @Validator.Matches(/^[a-zA-Z][a-zA-Z0-9.@]{0,30}[a-zA-Z0-9]$/)
  forename: string;

  @Validator.IsNotEmpty()
  @Validator.IsString()
  // @Validator.Matches(/^[a-zA-Z][a-zA-Z0-9.@]{0,30}[a-zA-Z0-9]$/)
  surname: string;

  @Validator.IsNotEmpty()
  @Validator.IsString()
  // @Validator.Matches(/^[a-z][a-z0-9\.]{0,30}[a-z0-9]$/)
  nickname: string;

  phone_number: string;
}
