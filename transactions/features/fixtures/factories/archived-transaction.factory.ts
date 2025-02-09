import * as uuid from 'uuid';
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { ArchivedTransactionModel } from '../../../src/archived-transactions';

const seq = new SequenceGenerator();

const defaultArchivedTransactionFactory = (): ArchivedTransactionModel => {
  seq.next();

  return ({
    _id: '8a47a7a5-6885-470d-ab18-3b9db3ed7a64',
    uuid: 'ad738281-f9f0-4db7-a4f6-670b0dff5327',
    businessId: '36bf8981-8827-4c0c-a645-02d9fc6d72c8',
    data: {
      uuid: 'ad738281-f9f0-4db7-a4f6-670b0dff5327',
      _id: '7ec33a43-2fd7-4193-b57f-14b144b6c4a8',
      total: 50,
      type: 'payex_creditcard',
    },
    encryptedData: 'U2FsdGVkX1+bdD+FsS1RnULlKzzt47Os0dELgNyM1fWLUSG3ibIQk+c2AH/tjXvvtdShmgYVM773uFW55vQT68pU7TnqncOYPf/sSgG/9u18E2Fr88Yy8YVNG+1+FtW8enYp0MugHwFXZJqKcPbNOu1UPkupE1BH6W6eu/2Rp0W8++sqRDYpavlflFvDNRRhQYQxXY5VFCDryd7T1qToW2n6uva1U6xP3AZmAHwpvDOkUNLPdaniowDXBgfAscRkEhZDERqkE/TnO6UUJLLu9T5dWMiPlfjpOOyHDLhe7v3ZQYmjaoyZuwBvsFUiWQZb5qqEwGR0Y3576fTpeamNDRGSQCBTO/I4kfeQv+xw0rYeA76nCG8rDDgOnRzyci5Goa2ZmVSZVNrHFWz3Km0XJBKlEo1WghCrtF6Tp7nw91v/StDIY1Wdx9D1dnj4m/ISR3CowATIseQEJVp+3lhMti40w/i9gzHSajkuF3PohV4jCNYH5nXdsWgRFIctp55FQZD3r+8wpo2/sN4rfVDxFUEDc0L+VesDr8Dr1IZHPK1CNxCalOuagnYtALPu7nm3ZXIs1QeMwt0cvhycPkmayH7WbeOAecnelHLXApIT6zKsW8/DMXjkI8CJGDZWWDSgITrd4n5OEPdqV3uG8Sx/H36HDFNCDOBhHbBauxXzZ+SsctlGHOrcWN7QJst5u5tDfQBE9wIwYQ6mcBkgnlS+ZPKU2hx1mFm8WgOWYMipFqY1wLXOGAj35+NaYZqJhpqEo/T4Gy68ZfllhTUK3R3+SoZicEnybstAm6yAoSTdm7xVySzPMySzGvkdzH/JR7MpixFT0n9fIYn0VxfQPR4J+3oIrqBsoRFGJ7/AhkQ7sW2MxqQ/pSjF6xGfpVeCNLlJZybc5sPxyts1pIsncngvWZ5HhkxKl89uoVGvk6zsGMNhvhj9wE6JHfeUyRAVmV/VLlw9ksskow9aWwNrDbGKxTL9Wi+j/xsi+2w71CXOZkEzt7Dfd+Dr1m7UCrf23BSsb+vujsgusYO/rO2c0WPd2eNhBPF+3Zt57MD9Zwv4KgexQI45LGhovmtWyWXxL5KWP3KRRYYzMwlNxESOzz3QOLLXRsCgaTb4a9nPiUeOTsv30345V3m/rMcWVhAViXFq40fL2CM89l4CoIXILxy8yHjD55mZNPSwmK0KGhHFSTd/g6ydSnqjh25VjmRX/xMYo+LIv2cgxzKFSLtK5ZV5eEyLlSbx2eLGLM35GCO/gCrlDOzxin8wR2ufxQMY6cJrYJdCMrMUJINRySvfE8NBlgg0cyMQjKy/BNzCdhEjsZbNmxCIJpzoA1FLC0Q27sZdlB9mmJnZwkUbC1u0wEgtGFueRGcaOuJ3GUp9RVxEVG7f+wQFIswQd9e+1v2rStjKC4NpfXhjNvk7ePu51vgyzSyLt1FpY1LY/WM84GkJRMVPzNRDKgMFTRynDB5lGOVvhlkg+bbiXeMLtUtLfhVlM3WuA8fA0sCq5XmiZV94waYhdrAMh3GoyW2gjv9Khh08uVc5ihe26CM4DlRfgizQ2xAW0BxazM0SZH1StUnTqci0acx8FpieA03edBiqkEVsOklGO7NQ8IAqkbgUeCLBn8mWnUdWKDElEcBPc+v7eh59oBGIygSqV/paZe7Rbkbv8aK/PBeDfBUgw6OogIT7Nc9REV8gT/UvUNHFMo2p+//R4PBkT/AA6DqyVYHccFlR3YtsIXcm1vzq5Frq55m3rjltQXQWf+egntAyD41fOKUlLP9UXrf/Mdk230UfJaZZl5RNz9UQfYtQShgA/zQFGA=='
  } as ArchivedTransactionModel);
};

export class archivedTransactionFactory {
  public static create: PartialFactory<ArchivedTransactionModel> = partialFactory<ArchivedTransactionModel>(defaultArchivedTransactionFactory);
}
