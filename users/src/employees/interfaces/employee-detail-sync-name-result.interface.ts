import { EmployeeDetail } from '.';

type PickFields = 'employeeId' | 'userId' | 'firstName' | 'lastName';
export interface EmployeeDetailSyncNameResultInterface extends Pick<EmployeeDetail, PickFields> {

}
