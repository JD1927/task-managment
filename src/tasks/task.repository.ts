import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async getTasks(filterFto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filterFto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere(`task.status = :status`, { status });
    }

    if (search) {
      query.andWhere(
        `(task.title LIKE :search OR task.description LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    await task.save();
    return task;
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.findOne(id);

    if (!found) {
      this.taskNotFound(id);
    }
    return found;
  }

  async deleteTaskById(id: number): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      this.taskNotFound(id);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();

    return task;
  }

  private taskNotFound(id: number): void {
    throw new NotFoundException(`Task with ID: '${id}' not found`);
  }
}
