import { TaskStatus, taskStatusArray } from '../tasks.model';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto {

  @IsOptional()
  @IsIn([...taskStatusArray])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
