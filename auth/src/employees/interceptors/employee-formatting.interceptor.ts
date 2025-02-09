import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { isMerchantRoleInterface, UserRoleInterface, UserRoleMerchant } from '@pe/nest-kit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Permission, User } from '../../users/interfaces';
import { Employee, EmployeeResponse, PositionInterface } from '../interfaces';
import { GroupsService } from '../services';

interface UserObject extends User, Employee { }

@Injectable()
export class EmployeeFormattingInterceptor implements NestInterceptor {
  constructor(private readonly groupsService: GroupsService) { }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest();
    const businessId: string = request.params.businessId;

    return next.handle().pipe(
      map(async (result: { data: UserObject | UserObject[]; count: number }) => {
        if (!businessId) {
          return result;
        }
        if (typeof result === 'number') {
          return result;
        }
        if (result && !result.data) {
          result = { data: (result as unknown) as UserObject, count: 1 };
        }
        if (!Array.isArray(result.data)) {
          return this.getEmployeeResponse(result.data, businessId);
        }

        const response: any = { data: [], count: result.count };
        for (const employee of result.data) {
          response.data.push(await this.getEmployeeResponse(employee, businessId));
        }

        return response;
      }),
    );
  }

  private async getEmployeeResponse(employeeEntity: UserObject, businessId: string): Promise<EmployeeResponse> {
    const employee: any = employeeEntity.toObject ? employeeEntity.toObject() : employeeEntity;
    let employeeResponse: EmployeeResponse = {
      _id: employee._id,
      email: employee.email,
      firstName: employee.firstName,
      fullName: employee.fullName,
      groups: await this.groupsService.getGroups(employee._id, businessId),
      lastName: employee.lastName,
      roles: EmployeeFormattingInterceptor.getRoles(employee.roles, businessId),
    };
    if (!Array.isArray(employee.positions)) {
      employeeResponse = { ...employeeResponse, ...employee.positions };
    }

    if (employee.positions && employee.positions.length) {
      const position: PositionInterface = employee.positions.find(
        (_position: PositionInterface) => _position.businessId === businessId,
      );
      employeeResponse.position = position && position.positionType;
      employeeResponse.status = position && position.status;
    }

    return employeeResponse;
  }

  private static getRoles(roles: UserRoleInterface[], businessId: string): UserRoleMerchant[] {
    const result: any[] = [];
    if (Array.isArray(roles)) {
      for (const role of roles) {
        if (!isMerchantRoleInterface(role)) {
          continue;
        }

        for (const permissionId of Object.keys(role.permissions).reverse()) {
          const permission: Permission = role.permissions[permissionId];
          if (businessId !== permission.businessId) {
            role.permissions.splice(parseInt(permissionId, 10), 1);
          }
        }
        result.push(role);
      }
    }

    return result;
  }
}
