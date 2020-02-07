import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where(`task.userId = :userId`, { userId: user.id });

    if (status) {
      query.andWhere(`task.status = :status`, { status });
    }

    if (search) {
      query.andWhere(
        `(task.title LIKE :search OR task.description LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();
    delete task.user;

    return task;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.findOne({ where: { id, userId: user.id } });

    if (!found) {
      this.taskNotFound(id);
    }
    return found;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, userId: user.id });
    if (result.affected === 0) {
      this.taskNotFound(id);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  private taskNotFound(id: number): void {
    throw new NotFoundException(`Task with ID: '${id}' not found`);
  }
}
