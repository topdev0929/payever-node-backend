import { ActionsEnum, SectionsEnum } from '../src/stepper/enums';

export const ShopSteps: any[] = [
  {
    _id: '802eb342-113b-42ea-8e17-d946398fcbd1',
    action: ActionsEnum.CreateShop,
    allowSkip: true,
    order: 1,
    section: SectionsEnum.Shop,
    title: 'steps.shop.create',
  },
  {
    _id: '3bc2ebdb-95fc-4043-9e89-36cb8452f162',
    action: ActionsEnum.ChooseTheme,
    allowSkip: true,
    order: 2,
    section: SectionsEnum.Shop,
    title: 'steps.shop.choose_theme',
  },
  {
    _id: '02c3cdd5-05c7-4eee-9d41-efcf294b5ed6',
    action: ActionsEnum.UploadProduct,
    allowSkip: true,
    order: 3,
    section: SectionsEnum.Shop,
    title: 'steps.shop.upload_theme',
  },
  {
    _id: '9331d9ec-fd5c-48c7-bbf1-caabfa5e94e9',
    action: ActionsEnum.ShopPreview,
    allowSkip: true,
    order: 4,
    section: SectionsEnum.Shop,
    title: 'step.shop.preview',
  },
];
