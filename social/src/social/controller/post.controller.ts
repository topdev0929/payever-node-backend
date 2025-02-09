import {
  Body,
  Controller,
  Delete,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit';
import { BusinessSchemaName } from '../../business/schemas';
import { PostsService } from '../services';
import { PostModel } from '../models';
import { CreatePostDto } from '../dtos';
import { BusinessLocalModel } from '../../business/models';
import { PostSchemaName } from '../schemas';
import { MultipartService } from '../services/multipart.service';
import { mediaMimeTypes } from '../settings';
import { DuplicatePostDto } from '../dtos/duplicate-post.dto';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const BUSINESS_ID_PLACEHOLDER: string = ':businessId';

@Controller('business/:businessId/post')
@ApiTags('Post')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant, RolesEnum.system)
export class PostsController extends AbstractController {
  constructor(
    @InjectModel(PostSchemaName) private readonly postModel: Model<PostModel>,
    private readonly postsService: PostsService,
    private readonly multipartService: MultipartService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async getPost(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessLocalModel,
  ): Promise<PostModel[]> {
    return this.postsService.getByBusiness(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.create })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async createPost(
    @Body() createPostDto: CreatePostDto,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessLocalModel,
  ): Promise<PostModel> {
    return this.postsService.create(business, createPostDto);
  }

  @Post('duplicate-post')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.create })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async duplicatePost(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessLocalModel,
    @Body() duplicatePostDto: DuplicatePostDto,
  ): Promise<any> {
    return this.postsService.duplicate(business, duplicatePostDto);
  }

  @Post('media-post')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.create })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async createMediaPost(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessLocalModel,
    @Query('post') postString: string,
    @Req() request: any,
    @Res() response: any,
  ): Promise<any> {
    const data: CreatePostDto = JSON.parse(postString);
    const postDto: CreatePostDto = plainToClass(CreatePostDto, data);
    const errors: ValidationError[] = await validate(postDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.multipartService.setHandler<PostModel>(
      request,
      response,
      this.postsService.createMediaPost(),
      business as any,
      postDto,
      mediaMimeTypes,
    );
  }

  @Patch('update-media-post/:postId')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.create })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async upadteMediaPost(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessLocalModel,
    @ParamModel(':postId', PostSchemaName, true) post: PostModel,
    @Query('post') postString: string,
    @Req() request: any,
    @Res() response: any,
  ): Promise<any> {
    const data: CreatePostDto = JSON.parse(postString);
    const postDto: CreatePostDto = plainToClass(CreatePostDto, data);
    const errors: ValidationError[] = await validate(postDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.multipartService.setHandler<PostModel>(
      request,
      response,
      this.postsService.updateMediaPost(),
      business as any,
      postDto,
      mediaMimeTypes,
      post._id,
    );
  }

  @Get('/:postId')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async getPostById(
    @ParamModel(':postId', PostSchemaName, true) post: PostModel,
    @Param('businessId') businessId: string,
  ): Promise<PostModel> {
    if (businessId !== post.businessId) {
      throw new ForbiddenException();
    }

    return post;
  }

  @Patch('/:postId')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.update })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async updatePost(
    @Body() updatePostDto: CreatePostDto,
    @ParamModel(':postId', PostSchemaName, true) post: PostModel,
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName, true) business: BusinessLocalModel,
  ): Promise<PostModel> {
    return this.postsService.update(business, updatePostDto, post._id);
  }

  @Delete('/:postId')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'social', action: AclActionsEnum.delete })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async deletePost(
    @User() user: AccessTokenPayload,
    @ParamModel(':postId', PostSchemaName, true) post: PostModel,
  ): Promise<void> {

    return this.postsService.delete(post);
  }
}
