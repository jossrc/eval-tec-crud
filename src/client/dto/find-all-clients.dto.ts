import { IsOptional, IsString } from "class-validator";

export class FindAllClientsDto {
  @IsOptional()
  @IsString()
  email: string;
}

