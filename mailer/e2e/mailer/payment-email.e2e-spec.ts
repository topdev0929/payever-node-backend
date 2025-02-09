import { MailerEventController, MailerModule } from '../../src/mailer';
import { Test, TestingModule } from '@nestjs/testing';

export type UserType = {
  email: string;
  password: string;
  uuid: string;
};

const PASSWORD: string = '$2y$12$RCn5hpcdCVe4huPk/WPL6.utbSRTXlJKcUy8qhb4OiXJxkc4ANqEy';

describe('Payment Email', () => {
  let mailerEventController: MailerEventController;

  const templateModel: {
    findOne: () => void;
  } = {
    findOne: () => { },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailerModule],
    })
      .overrideProvider('TemplateInterfaceModel')
      .useValue(templateModel)
      .compile();

    mailerEventController = module.get<MailerEventController>(MailerEventController);
  });

  const user: UserType = {
    email: 'example@example.com',
    password: PASSWORD,
    uuid: '28b8d900-ceeb-4c1e-865b-c95a2be43a43',
  };
  
  const findOneResult: Promise<UserType> 
    = new Promise((resolve: (value?: UserType) => void) => Promise.resolve(user));

  jest.spyOn(templateModel, 'findOne').mockImplementation(() => findOneResult);

  it('Should send a payment email', async () => {
    const dto : {
      data: {
        html: string;
        language: string;
        subject: string;
        to: string;
      };
    } = {
      data: {
        html: '<html></html>',
        language: 'en',
        subject: 'my subject',
        to: 'test@test.com',
      },
    };

    await mailerEventController.onSingleMailSend(dto);
  });
});
