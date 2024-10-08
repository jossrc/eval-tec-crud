import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClientDto {

  @IsNotEmpty({
    message: 'El nombre completo es requerido',
  })
  @IsString({
    message: 'El nombre completo debe ser una cadena de texto',
  })
  @Transform(({ value }) => value.trim())
  @MinLength(2, {
    message: 'El nombre completo debe tener al menos 2 caracteres',
  })
  fullName: string;

  @IsNotEmpty({
    message: 'El email es requerido'
  })
  @IsString({
    message: 'El email debe ser una cadena de texto',
  })
  @Transform(({ value }) => value.trim())
  @IsEmail(undefined, {
    message: 'El email debe ser uno válido',
  })
  email: string;

  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  @Transform(({ value }) => value.trim())
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres'
  })
  password: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  phone?: string;
}
