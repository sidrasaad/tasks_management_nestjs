import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task..dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabel } from './task-label.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly labelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    //This would automatically save task along with relation labels
    // const task = this.taskRepository.create(createTaskDto);
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }
  public async deleteTask(task: Task): Promise<void> {
    await this.taskRepository.remove(task);
  }

  public async addLabels(
    task: Task,
    labelDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    //1) Deduplicate DTO'S -DONE
    //2) Get Existing Names of labels - Done
    //3)New labels are not alreading existing on task -DONE
    //4)Save new labels , only if ther are any real new one

    //exsisting names in task
    const names = task.labels.map((label) => label.name);

    const labels = this.getUniqueLabels(labelDtos)
      //making sure that name doesn't exists in task
      .filter((label) => !names.includes(label.name))
      .map((label) => {
        return this.labelsRepository.create(label);
      });
    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepository.save(task);
    }
    return task;
  }

  public async removeLabel(
    task: Task,
    labelsToRemove: string[],
  ): Promise<Task> {
    //1. Remove existing labels from labels array
    //2. Ways to solve
    // remove labels from task->labels and save() the task
    //b Query Builder -SQL that deletes labels

    task.labels = task.labels.filter(
      (label) => !labelsToRemove.includes(label.name),
    );
    return await this.taskRepository.save(task);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];
    return uniqueNames.map((name) => {
      return { name };
    });
  }
}
