import { headerTemplate } from '.';

const TEMPLATE_TYPE: string = 'system';

export const costumerAutomatedEmailTemplates: any[] = [
  {
    _id: '5645d94b-336a-44d4-b859-7037f4e70382',
    body:
      headerTemplate(`Hi {{ owner.first_name }}, someone has registered in your {{ applicationType }}.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever user</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                New customer registered in your {{ applicationType }}</h1>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <p
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {{ customer.first_name }} has register to your {{ applicationType }}.</p>
            </td>
            </tr>
            <tr>
            <td>
                <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ url }}">Manage Customer</a>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'New customer registered in your {{ applicationType }}',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'Customer',
    subject: 'New customer registered in your {{ applicationType }}',
    template_name: 'customer_registered',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '638dbdfd-a0af-41c7-8f9f-275e5f6192a2',
    body:
      headerTemplate(`Hi {{ customer.first_name }}, your registration process for {{ applicationType }} has been approved.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever user</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your registration process for {{ applicationType }} has been approved.</h1>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'Registration process for {{ applicationType }} has been approved',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'Customer',
    subject: 'Registration process for {{ applicationType }} has been approved',
    template_name: 'customer_approved',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '19343d38-5f85-402e-aa63-4b9faef31ac2',
    body:
      headerTemplate(`Hi {{ customer.first_name }}, your registration process for {{ applicationType }} has been denied.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever user</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your registration process for {{ applicationType }} has been denied.</h1>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'Registration process for {{ applicationType }} has been denied',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: 'Customer',
    subject: 'Registration process for {{ applicationType }} has been denied',
    template_name: 'customer_denied',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },

];
