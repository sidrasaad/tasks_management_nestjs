import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FineOneParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
