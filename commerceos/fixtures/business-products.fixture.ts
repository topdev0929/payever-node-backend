import { BusinessStatusesEnum } from '../src/business/enums';

export const products: any[] = [
  {
    code: 'BUSINESS_PRODUCT_RETAIL_B2C',
    order: 1,
    industries: [
      {
        code: 'BRANCHE_ART_CRAFT',
      },
      {
        code: 'BRANCHE_AUTOMOTIVE',
        logo: '#icon-industries-mobility',
        slug: 'automotive',
      },
      {
        code: 'BRANCHE_BABY',
      },
      {
        code: 'BRANCHE_CARE',
      },
      {
        code: 'BRANCHE_BOOKS',
      },
      {
        code: 'BRANCHE_COMPUTER',
      },
      {
        code: 'BRANCHE_ELECTRONICS',
        logo: '#icon-industries-electronics',
        slug: 'electronics',
      },
      {
        code: 'BRANCHE_FASHION',
        logo: '#icon-industries-fashion',
        slug: 'fashion',
        wallpaper: 'https://payeverproduction.blob.core.windows.net/wallpapers/2e164bca-aca6-4d59-a73e-84bb7e4e57c2-AdobeStock_91434005.jpeg',
      },
      {
        code: 'BRANCHE_HEALTH_HOUSEHOLD',
      },
      {
        code: 'BRANCHE_HOME_KITCHEN',
        logo: '#icon-industries-home',
      },
      {
        code: 'BRANCHE_LUGGAGE',
      },
      {
        code: 'BRANCHE_TV',
      },
      {
        code: 'BRANCHE_MUSIC',
      },
      {
        code: 'BRANCHE_PET_SUPPLIES',
      },
      {
        code: 'BRANCHE_SPORTS',
      },
      {
        code: 'BRANCHE_TOOLS',
      },
      {
        code: 'BRANCHE_TOYS',
      },
      {
        code: 'BRANCHE_VIDEO_GAMES',
      },
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },

  {
    _id: '281ed5f6-81ca-45ff-8455-7048451c6113',
    code: 'BUSINESS_PRODUCT_RETAIL_B2B',
    order: 2,
    industries: [
      {
        code: 'BRANCHE_FINISHING_PRODUTS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_ADDITIVE_PRODUCTS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_DOOR_PRODUTS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_CUTTING_TOOLS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_FASTENERS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_FILTRATION',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_FOOD_SUPPLIES',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_PNEUMATICS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_ELECTRICAL',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_HARDWARE',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_HAND_TOOLS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_JANITORIAL_SUPPLIES',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_SCIENCE_PRODUTS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_MATERIAL_HANDLINGS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_HEALTH',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_SHIPPING_SUPPLIES',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_POWER_TRANSMISSION',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_DENTAL_SUPPLIES',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_MEDICAL_SUPPLIES',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_RAW_MATERIALS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_RETAIL_STORE',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_ROBOTICS',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_SCIENCE_EDUCATION',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_ADHESIVES',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_MEASURE',
        logo: '#icon-industries-b2b',
      },
      {
        code: 'BRANCHE_OTHER',
        logo: '#icon-industries-b2b',
      },
    ],
  },

  {
    _id: '4bf80b07-1a47-418e-b1e9-d085c5eb9014',
    code: 'BUSINESS_PRODUCT_GIDITAL_GOODS',
    order: 3,
    industries: [
      {
        code: 'BRANCHE_DIGITAL_MUSIC',
      },
      {
        code: 'BRANCHE_DIGITAL_VIDEOS',
      },
      {
        code: 'BRANCHE_SOFTWARE',
      },
      {
        code: 'BRANCHE_GAMES',
      },
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },

  {
    _id: '4ec8fdc6-e0aa-4434-825d-f58c2220b72a',
    code: 'BUSINESS_PRODUCT_SERVICES',
    order: 4,
    industries: [
      {
        code: 'BRANCHE_COACHING',
        defaultBusinessStatus: BusinessStatusesEnum.SoloEntrepreneur,
      },
      {
        code: 'BRANCHE_CONSULTING',
      },
      {
        code: 'BRANCHE_CAR_REPAIR',
      },
      {
        code: 'BRANCHE_NAIL_STUDIO',
      },
      {
        code: 'BRANCHE_LOCKSMITH',
      },
      {
        code: 'BRANCHE_HAIR_STYLIST',
      },
      {
        code: 'BRANCHE_TOURISM',
      },
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },

  {
    _id: '7ac7eaf0-5dd0-4953-8514-b1955fffe780',
    code: 'BUSINESS_PRODUCT_OVERNIGHT_STAY',
    order: 5,
    industries: [
      {
        code: 'BRANCHE_HOTEL',
      },
      {
        code: 'BRANCHE_MOTEL',
      },
      {
        code: 'BRANCHE_BED_BRAKFAST',
      },
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },

  {
    _id: '3dda32fb-89ca-4589-9da6-deb950dbf5c0',
    code: 'BUSINESS_PRODUCT_MEALS',
    order: 6,
    industries: [
      {
        code: 'BRANCHE_RESTAURANT',
      },
      {
        code: 'BRANCHE_FOOD_TRACK',
      },
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },

  {
    _id: '4915963e-977e-4f16-bb49-1fafddb2cecd',
    code: 'BUSINESS_PRODUCT_FOOD',
    order: 7,
    industries: [
      {
        code: 'BRANCHE_SUPERMARKET',
      },
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },

  {
    _id: '4123963e-977e-4f16-bb49-1fafddb2cecd',
    code: 'BUSINESS_PRODUCT_DRINKS',
    order: 8,
    industries: [
      {
        code: 'BRANCHE_BAR',
      },
      {
        code: 'BRANCHE_CAFE',
      },
      {
        code: 'BRANCHE_CLUB',
      },
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },

  {
    _id: 'dca3963e-977e-4f16-bb49-1fafddb2cecd',
    code: 'BUSINESS_PRODUCT_OTHERS',
    order: 9,
    industries: [
      {
        code: 'BRANCHE_OTHER',
      },
    ],
  },
];
