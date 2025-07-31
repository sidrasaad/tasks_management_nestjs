import { IsEnum, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from './task.model';
import { Transform } from 'class-transformer';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @MinLength(3)
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;

    // Handle case when value is already an array
    if (Array.isArray(value)) {
      return value
        .map((label) => (typeof label === 'string' ? label.trim() : label))
        .filter(Boolean);
    }

    // Handle case when value is a string
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((label) => label.trim())
        .filter((label) => label.length);
    }

    return undefined;
  })
  labels: string[];

  @IsOptional()
  @IsIn(['title', 'status', 'createdAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
