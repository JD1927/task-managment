import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { taskStatusArray, TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {

  @IsOptional()
  @IsIn([...taskStatusArray])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
