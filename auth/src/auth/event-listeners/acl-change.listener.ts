import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { User, UserService } from '../../users';
import { ACL_REMOVED_EVENT, ACL_UPDATED_EVENT } from '../../common';
import { RequestParser, TokenService } from '../services';

@Injectable()
export class ACLChangeListener {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) { }

  @EventListener(ACL_UPDATED_EVENT)
  public async onAclUpdateEvent(users: User[], businessId: string): Promise<void> {
    await this.tokenService.removeTokens(users.map((userData: User) => userData._id), businessId);

    const user: User = await this.userService.findAndPopulateWithBusiness(users[0]._id, businessId);
    await this.tokenService.issueToken(user, RequestParser.parse(null), businessId);
  }

  @EventListener(ACL_REMOVED_EVENT)
  public async onAclRemovedEvent(users: User[], businessId: string): Promise<void> {
    await this.tokenService.removeTokens(users.map((user: User) => user._id), businessId);
  }
}
