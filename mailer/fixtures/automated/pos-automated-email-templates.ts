/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from './common-templates';

const section: string = 'PoS Email';
const TEMPLATE_TYPE: string = 'system';

export const posAutomatedEmailTemplates: any[] = [
  {
    _id: '39825cdf-c1a9-45ba-8195-84cf1b63f7d8',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, new terminal has been created.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever pos</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                New point of sale terminal has been created.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Point of sale {{ PoSData.name }} terminal has been created.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ url }}">Manage pos</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'New Point of Sale Terminal Created Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'New Point of Sale Terminal Created  Notification',
    template_name: 'pos_created_terminal_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'f6bc3af6-fa7d-4c38-b828-e07302f16d50',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, terminal has been updated.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever pos</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Point of sale terminal has been updated.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Point of sale {{ PoSData.name }} terminal has been updated.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ url }}">Manage pos</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Point of Sale Terminal Updated Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Point of Sale Terminal updated Notification',
    template_name: 'pos_updated_terminal_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '4f4cc705-2996-4bbf-8202-bb6c879fc126',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, terminal has been removed.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever pos</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Point of sale terminal has been removed.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                A point of sale terminal has been removed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ url }}">Manage pos</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Point of Sale Terminal Removed Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Point of Sale Terminal removed Notification',
    template_name: 'pos_removed_terminal_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '29fccb2a-5dec-4737-943d-698d8929d9a3',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, terminal has been set as default.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever pos</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Successfully set as default terminal</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Successfully set as default point of sale terminal.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ url }}">Manage pos</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Point of Sale Terminal Set Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Point of Sale Terminal Set Notification',
    template_name: 'pos_set_terminal_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'ea6d4630-2069-44a0-9afc-ad157d170bad',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several terminals have been updated.
            {% else %}
            a terminal has been updated.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever pos</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">      
                {% if data | length > 1 %}
                Several terminals have been updated.
                {% else %}
                A terminal has been updated.
                {% endif %}
              </h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                Several terminals 
                {% else %}
                A terminal 
                {% endif %} for your point of sale business has been updated.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].url }}">Manage terminal</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Point of Sale Terminal Status Scheduled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Point of Sale Terminal Status Scheduled Notification',
    template_name: 'pos_status_terminal_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
];
