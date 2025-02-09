export class ImportFailedException extends Error {
  private readonly businessId: string;

  public constructor(message: string, businessId: string) {
    super(message);
    this.businessId = businessId;
  }
}
