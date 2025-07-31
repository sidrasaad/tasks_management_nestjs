import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskLabel } from './task-label.entity';

@Module({
  //this will allow to use task repository in service
  imports: [TypeOrmModule.forFeature([Task, TaskLabel])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
