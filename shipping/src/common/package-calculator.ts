import * as converter from 'convert-units';
import { ShippingProductItemDto } from '../shipping/dto/shipping-product-item.dto';
import { ShippingBoxInterface } from '../shipping/interfaces';
import { DimensionUnitEnums, WeightUnitEnums } from '../shipping/enums';

export class PackageCalculator {
  public static dimensionUnit: string = 'cm';
  public static weightUnit: string = 'kg';

  // tslint:disable-next-line: cognitive-complexity
  public static calculate(
    shippingBoxes: ShippingBoxInterface[],
    shippingItemsDto: ShippingProductItemDto[],
  ): ShippingBoxInterface {
    const shippingItems: ShippingProductItemDto[] = shippingItemsDto.map((item: ShippingProductItemDto) => {
      if (item.dimensionUnit !== PackageCalculator.dimensionUnit) {

        item.width = converter(item.width).from(item.dimensionUnit).to(PackageCalculator.dimensionUnit);
        item.height = converter(item.height).from(item.dimensionUnit).to(PackageCalculator.dimensionUnit);
        item.length = converter(item.length).from(item.dimensionUnit).to(PackageCalculator.dimensionUnit);
        item.weight = converter(item.weight).from(item.weightUnit).to(PackageCalculator.weightUnit);
      }

      return item;
    });
    const boxes: ShippingBoxInterface[] = shippingBoxes.map((box: ShippingBoxInterface) => {
      if (box.dimensionUnit !== PackageCalculator.dimensionUnit) {
        box.width = converter(box.width).from(box.dimensionUnit).to(PackageCalculator.dimensionUnit);
        box.height = converter(box.height).from(box.dimensionUnit).to(PackageCalculator.dimensionUnit);
        box.length = converter(box.length).from(box.dimensionUnit).to(PackageCalculator.dimensionUnit);
      }

      return box;
    });
    const longestLength: number = shippingItems
      .map((i: ShippingProductItemDto) => i.length).reduce((a: number, b: number) => a > b ? a : b);
    const longestWidth: number = shippingItems
      .map((i: ShippingProductItemDto) => i.width).reduce((a: number, b: number) => a > b ? a : b);
    const totalHeight: number = shippingItems
      .map((i: ShippingProductItemDto) => i.height * i.quantity).reduce((a: number, b: number) => a + b);
    const totalWeight: number = shippingItems
      .map((i: ShippingProductItemDto) => i.weight * i.quantity).reduce((a: number, b: number) => a + b);
    const suitableBoxes: ShippingBoxInterface[] = boxes
      .filter((box: ShippingBoxInterface) =>
        box.height >= totalHeight && box.length >= longestLength && box.width >= longestWidth);
    if (suitableBoxes.length > 0) {
      const suitableBox: ShippingBoxInterface = suitableBoxes.length > 1 ?
        suitableBoxes
          .reduce((a: ShippingBoxInterface, b: ShippingBoxInterface) =>
            Math.abs(a.width - longestWidth) > Math.abs(b.width - longestWidth) ? b : a) : suitableBoxes[0];
      suitableBox.weight = converter(totalWeight).from(PackageCalculator.weightUnit).to(suitableBox.weightUnit);
      suitableBox.width = converter(suitableBox.width)
        .from(PackageCalculator.dimensionUnit).to(suitableBox.dimensionUnit);
      suitableBox.height = converter(suitableBox.height)
        .from(PackageCalculator.dimensionUnit).to(suitableBox.dimensionUnit);
      suitableBox.length = converter(suitableBox.length)
        .from(PackageCalculator.dimensionUnit).to(suitableBox.dimensionUnit);

      return suitableBox;
    }

    return {
      dimensionUnit: DimensionUnitEnums.cm,
      height: totalHeight,
      length: longestLength,
      name: 'shipping.box.calculated',
      weight: totalWeight,
      weightUnit: WeightUnitEnums.kg,
      width: longestWidth,
    } as ShippingBoxInterface;
  }
}
