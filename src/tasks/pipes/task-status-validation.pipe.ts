import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TaskStatus, taskStatusArray } from '../tasks.model';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [...taskStatusArray];

  transform(value: string) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`'${value}' is an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any): boolean {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
