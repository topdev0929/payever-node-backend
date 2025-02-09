/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from '.';

const section: string = 'Business Email';
const TEMPLATE_TYPE: string = 'system';

export const businessAutomatedEmailTemplates: any[] = [
  {
    _id: '336852aa-4e3a-4c65-b4fb-0a669cd77b62',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your business has been successfuly created.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever business</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Manage your business.</h1>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <p
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your business has successfuly created. Let's manage your business.</p>
            </td>
            </tr>
            <tr>
            <td>
                <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ businessUrl }}">Manage business</a>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'Create Business Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Create Business Notification',
    template_name: 'create_business_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '646097a9-451a-4d90-abc3-ea671e21392b',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your {{ business.name }} business has been removed.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever business</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your {{ business.name }} business has been removed.</h1>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'Remove Business Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Remove Business Notification',
    template_name: 'remove_business_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
];
