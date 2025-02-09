export class SaleHelper {
  public static saleDateFormat(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    data.priceTable = data.priceTable && Array.isArray(data.priceTable) ?
      data.priceTable.map((priceTable: any) => {
        const subResult: any = { ...priceTable };
        subResult.sale = this.saleDateToString(subResult.sale);

        return subResult;
      }) :
      [];

    data.sale = this.saleDateToString(data.sale);

    if (data.variants && data.variants.length > 0) {
      for (let i: number = 0; i < data.variants.length; i++) {
        data.variants[i] = this.saleDateFormat(data.variants[i]);
      }
    }

    return data;
  }

  private static saleDateToString(sale: any): any {
    if (!sale) {
      return ;
    }

    return {
      ...sale,
      saleEndDate: sale.saleEndDate ? sale.saleEndDate.toISOString() : null,
      saleStartDate: sale.saleStartDate ? sale.saleStartDate.toISOString() : null,
    };
  }
}
