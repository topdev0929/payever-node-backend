import { BadRequestException, HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseCrmContactAwareInterface, BaseCrmLeadInterface, BaseCrmContactInterface } from '../interfaces';
import { BaseCrmEntityTypeEnum } from '../enum';
import { EventDispatcher } from '@pe/nest-kit';

@Injectable()
export class BaseCrmClientService {
  private baseApiUrl: string = 'https://api.getbase.com/v2';

  constructor(
    private readonly httpService: HttpService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly accessToken: string,
  ) {
  }

  public async createLeadFromContact(
    contact: BaseCrmContactInterface,
    leadSourceId: number = null,
  ): Promise<BaseCrmLeadInterface> {
    const lead: BaseCrmLeadInterface = {
      description: contact.description,
      email: contact.email,
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone: contact.phone,
      status: 'New',
      website: contact.website,
    };

    if (leadSourceId) {
      lead.source_id = leadSourceId;
    }

    return this.createLead(lead);
  }

  public async getLeads(page: number = 1): Promise<[{ data: BaseCrmLeadInterface }]> {
    return this.getEntityList<BaseCrmLeadInterface>(BaseCrmEntityTypeEnum.Leads, page);
  }

  public async findLeadById(id: number): Promise<BaseCrmLeadInterface> {
    return this.findEntityById<BaseCrmLeadInterface>(BaseCrmEntityTypeEnum.Leads, id);
  }

  public async findLeadByEmail(email: string): Promise<BaseCrmLeadInterface | null> {
    return this.findEntityByEmail<BaseCrmLeadInterface>(BaseCrmEntityTypeEnum.Leads, email);
  }

  public async createLead(lead: BaseCrmLeadInterface): Promise<BaseCrmLeadInterface> {
    return this.createEntity<BaseCrmLeadInterface>(BaseCrmEntityTypeEnum.Leads, lead);
  }

  public async updateLead(id: number, lead: BaseCrmLeadInterface): Promise<BaseCrmLeadInterface> {
    return this.updateEntity<BaseCrmLeadInterface>(BaseCrmEntityTypeEnum.Leads, id, lead);
  }

  public async findOrCreateLead(contact: BaseCrmLeadInterface): Promise<BaseCrmLeadInterface> {
    return this.findOrCreateEntity<BaseCrmLeadInterface>(BaseCrmEntityTypeEnum.Leads, contact);
  }

  public async getContacts(page: number = 1): Promise<[{ data: BaseCrmContactInterface }]> {
    return this.getEntityList<BaseCrmContactInterface>(BaseCrmEntityTypeEnum.Contacts, page);
  }

  public async findContactById(id: number): Promise<BaseCrmContactInterface> {
    return this.findEntityById<BaseCrmContactInterface>(BaseCrmEntityTypeEnum.Contacts, id);
  }

  public async findContactByEmail(email: string): Promise<BaseCrmContactInterface | null> {
    return this.findEntityByEmail<BaseCrmContactInterface>(BaseCrmEntityTypeEnum.Contacts, email);
  }

  public async findOrCreateContact(contact: BaseCrmContactInterface): Promise<BaseCrmContactInterface> {
    return this.findOrCreateEntity<BaseCrmContactInterface>(BaseCrmEntityTypeEnum.Contacts, contact);
  }

  public async createOrUpdateContact(contact: BaseCrmContactInterface): Promise<BaseCrmContactInterface> {
    return this.createOrUpdateEntity<BaseCrmContactInterface>(BaseCrmEntityTypeEnum.Contacts, contact);
  }

  public async createContact(contact: BaseCrmContactInterface): Promise<BaseCrmContactInterface> {
    return this.createEntity<BaseCrmContactInterface>(BaseCrmEntityTypeEnum.Contacts, contact);
  }

  public async updateContact(id: number, contact: BaseCrmContactInterface): Promise<BaseCrmContactInterface> {
    return this.updateEntity<BaseCrmContactInterface>(BaseCrmEntityTypeEnum.Contacts, id, contact);
  }

  private async getEntityList<T extends BaseCrmContactAwareInterface>(
    type: BaseCrmEntityTypeEnum,
    page: number = 1,
  ): Promise<[{ data: T }]> {
    return this.httpService.get(
      `${this.baseApiUrl}/${type}?sort_by=updated_at:desc&per_page=50&page=${page}`,
      this.getRequestConfig(),
    )
      .pipe(map((res: AxiosResponse) => res.data.items))
      .toPromise();
  }

  private async findEntityById<T extends BaseCrmContactAwareInterface>(
    type: BaseCrmEntityTypeEnum,
    id: number,
  ): Promise<T> {
    return this.httpService.get(`${this.baseApiUrl}/${type}/${id}`, this.getRequestConfig())
      .pipe(
        map((response: AxiosResponse) => response.data.data),
        catchError((error: any, caught: any) => {
          return throwError(
            new NotFoundException(error.message + (error.response ? JSON.stringify(error.response.data) : '')),
          );
        }),
      )
      .toPromise();
  }

  private async findEntityByEmail<T extends BaseCrmContactAwareInterface>(
    type: BaseCrmEntityTypeEnum,
    email: string,
  ): Promise<T> {
    return this.httpService.get(`${this.baseApiUrl}/${type}?email=${email.trim()}`, this.getRequestConfig())
      .pipe(
        map((response: AxiosResponse) => response.data.items[0] ? response.data.items[0].data : null),
        catchError((error: any, caught: any) => {
          return throwError(new NotFoundException(error.message + (error.response ? error.response.data : '')));
        }),
      )
      .toPromise();
  }

  private async createOrUpdateEntity<T extends BaseCrmContactAwareInterface>(
    type: BaseCrmEntityTypeEnum,
    contact: T,
  ): Promise<T> {
    const existingEntity: BaseCrmContactAwareInterface = await this.findEntityByEmail(type, contact.email);

    return existingEntity
      ? this.updateEntity(type, existingEntity.id, contact)
      : this.createEntity(type, contact);
  }

  private async findOrCreateEntity<T extends BaseCrmContactAwareInterface>(
    type: BaseCrmEntityTypeEnum,
    contact: T,
  ): Promise<T> {
    return await this.findEntityByEmail(type, contact.email) || this.createEntity(type, contact);
  }

  private async createEntity<T extends BaseCrmContactAwareInterface>(
    type: BaseCrmEntityTypeEnum,
    data: T,
  ): Promise<T> {
    return this.httpService.post(`${this.baseApiUrl}/${type}`, { data }, this.getRequestConfig())
      .pipe(
        map(async (response: AxiosResponse) => {
          const entity: T = response.data.data;

          await this.eventDispatcher.dispatch(`basecrm.${type}.created`, entity);

          return entity;
        }),
        catchError((error: any, caught: any) => {
          return throwError(new BadRequestException(error.message + JSON.stringify(error.response.data)));
        }),
      )
      .toPromise();
  }

  private async updateEntity<T extends BaseCrmContactAwareInterface>(
    type: BaseCrmEntityTypeEnum,
    id: number,
    data: T,
  ): Promise<T> {
    return this.httpService.put(`${this.baseApiUrl}/${type}/${id}`, { data }, this.getRequestConfig())
      .pipe(
        map((response: AxiosResponse) => response.data.data),
        catchError((error: any, caught: any) => {
          return throwError(new BadRequestException(error.message + JSON.stringify(error.response.data)));
        }),
      )
      .toPromise();
  }

  private getRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }
}
