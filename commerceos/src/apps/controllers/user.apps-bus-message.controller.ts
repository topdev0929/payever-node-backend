import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UserDto } from '../dto';
import { UserService } from '../services/user.service';

@Controller()
export class UserBusMessageController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern({
    name: 'users.event.user.updated',
  })
  public async onUserUpdateEvent(updateUserDto: UserDto): Promise<void> {
    await this.userService.update(updateUserDto);
  }
}
