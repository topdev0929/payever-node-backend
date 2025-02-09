/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from './automated';

const TEMPLATE_TYPE: string = 'system';

export const qrEmailTemplate: any[] = [
  {
    _id: `454ec28f-4b8e-4832-a760-31d0137c6d88`,
    body:
      headerTemplate(`Hi {{first_name|default('')}}, Your QR has been generated.`) +
      `
	  <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
      <table style="width:100%;border:0;">
          <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">QR</p>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <h1
              style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Your QR has been successfully generated.</h1>
          </td>
          </tr>
          <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
              <p
							style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Please check the attachment file for your QR files.
              </p>
          </td>
          </tr>
      </table>
      </td>
		</tr>`,
    description: '',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'User',
    subject: 'Your QR has been generated.',
    template_name: 'generated_qr_finished_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
];
