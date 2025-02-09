import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserTokenInterface } from '@pe/nest-kit';
import { Model } from 'mongoose';

import { UpdateLogoDto, UpdatePasswordDto } from '../dto';
import { User } from '../interfaces';
import { PasswordEncoder } from '../tools';

@Injectable()
export class ProfileService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  public async getLogo(email: string): Promise<any> {
    const user: User = await this.userModel.findOne({ email }).exec();

    return { logo_uuid: user.logo, email: user.email };
  }

  public async updateLogo(updateLogoDto: UpdateLogoDto): Promise<void> {
    const user: User = await this.userModel.findOne({ email: updateLogoDto.email }).exec();
    user.logo = updateLogoDto.logo_uuid;
    await user.save();
  }

  public async updatePassword(userModel: UserTokenInterface, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    const user: User = await this.userModel.findOne({ email: userModel.email }).exec();
    if (!PasswordEncoder.isPasswordValid(updatePasswordDto.oldPassword, user.salt, user.password)) {
      throw new BadRequestException('Invalid current plainPassword');
    }

    user.salt = PasswordEncoder.salt();
    user.password = PasswordEncoder.encodePassword(updatePasswordDto.newPassword, user.salt);

    return user.save();
  }
}
