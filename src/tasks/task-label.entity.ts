import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
@Unique(['taskId', 'name'])
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Index()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels, {
    //database level
    onDelete: 'CASCADE', //if we delete task then labels will be deleted
    orphanedRowAction: 'delete', //if a label without any task then it will delete that label
  })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
