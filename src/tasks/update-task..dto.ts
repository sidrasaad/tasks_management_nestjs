import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

//Make copy of create task dto and decorate it with option and make types optional
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
