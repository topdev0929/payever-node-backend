import { UserMediaAttributeInterface } from '../interfaces';
import { AttributeFilterDto } from '../dto';

export class AttributeHelper {
  public static mergeUserAttributes(
    defaultUserAttributes: UserMediaAttributeInterface[],
    userAttributes: UserMediaAttributeInterface[],
  ): UserMediaAttributeInterface[] {
    const merge: { [key: string]: string } = { };
    const result: UserMediaAttributeInterface[] = [];

    if (defaultUserAttributes && defaultUserAttributes.length > 0) {
      for (const userAttribute of defaultUserAttributes) {
        merge[userAttribute.attribute] = userAttribute.value;
      }
    }

    if (userAttributes && userAttributes.length > 0) {
      for (const userAttribute of userAttributes) {
        merge[userAttribute.attribute] = userAttribute.value;
      }
    }

    for (const key in merge) {
      if (merge.hasOwnProperty(key)) {
        result.push(
          {
            attribute: key,
            value: merge[key],
          },
        );
      }
    }

    return result;
  }

  public static filterNotNullUserAttributes(data: any): any {
    data.userAttributes = data.userAttributes.filter((attribute: UserMediaAttributeInterface) => {
      if (attribute.attribute) {
        return attribute;
      }
    });

    return data;
  }

  public static filterUserAttribute(userAttributeFilter: AttributeFilterDto): any[] {
    const filter: any[] = [];
    userAttributeFilter.attributes.forEach((element: any) => {
      filter.push({
        $and: [
          { 'userAttributes.attribute': element.attribute },
          { 'userAttributes.value': element.value },
        ],
      });
    });

    return filter;
  }
}
