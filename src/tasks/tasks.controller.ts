import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FineOneParams } from './fine-one.params';
import { UpdateTaskDto } from './update-task..dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  public async findall(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Get('/:id')
  public async findOne(@Param() params: FineOneParams): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id')
  public async updateTask(
    @Param() params: FineOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FineOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.deleteTask(task);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  @Post('/:id/labels')
  async addLabels(
    @Param() { id }: FineOneParams,
    @Body() labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(id);
    return await this.tasksService.addLabels(task, labels);
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLabels(
    @Param() { id }: FineOneParams,
    @Body() labelNames: string[],
  ): Promise<void> {
    const task = await this.findOneOrFail(id);
    await this.tasksService.removeLabel(task, labelNames);
  }
}
