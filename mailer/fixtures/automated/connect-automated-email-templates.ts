/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from '.';

const section: string = 'Connect Email';
const TEMPLATE_TYPE: string = 'system';

export const connectAutomatedEmailTemplates: any[] = [
  {
    _id: 'c14d70dc-0c46-45cd-947d-c2ab0da58fed',
    body:
      headerTemplate(
        `Hi {{ owner.userAccount.firstName }}, {{ thirdPartyData.name }} {{ thirdPartyData.category }} has been successfuly enabled in your business.`,
      ) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever connect</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Application {{ thirdPartyData.name }} {{ thirdPartyData.category }} has been successfuly enabled in your business.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Third party application {{ thirdPartyData.name }} {{ thirdPartyData.category }} for your business has been successfully enabled.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ url }}">Manage Connection</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Connect Enabled Third Party automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Connect Enabled Third Party Notification',
    template_name: 'connect_enable_subscription_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'dd3deaab-62d6-4b28-87db-53fde6291cdc',
    body:
      headerTemplate(
        `Hi {{ owner.userAccount.firstName }}, {{ thirdPartyData.name }} {{ thirdPartyData.category }} has been successfuly disabled in your business.`,
      ) +
      `<tr class="card"
    style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
    <td>
      <table style="width:100%;border:0;">
        <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
            <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever connect</p>
          </td>
        </tr>
        <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
            <h1
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Application {{ thirdPartyData.name }} {{ thirdPartyData.category }} has been successfuly disabled in your business.</h1>
          </td>
        </tr>
        <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
            <p
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Third party application {{ thirdPartyData.name }} {{ thirdPartyData.category }} for your business has been successfully disabled.
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <a class="button-black-rounded"
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ url }}">Manage Connection</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`,
    description: 'Connect Disabled Third Party automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Connect Disabled Third Party Notification',
    template_name: 'connect_disable_subscription_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '3abb235b-54f9-45e8-8429-7c5be5ab40b0',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several third party application has been updated.
            {% else %}
            Third party application has been updated.
            {% endif %}`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever connect</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
								{% if data | length > 1 %}
								Several third party application has been updated.
								{% else %}
								Third party application has been updated.
								{% endif %}
              </h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <ul>
                {% for connect in data %}
                  <li>{{ connect.thirdPartyData.name }} {{ connect.thirdPartyData.category }} for your business has been {{ connect.status }}.</li>
                {% endfor %}
                </ul>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].url }}">Manage Connection</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Connect Updated Third Party Status Scheduled automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Connect Updated Third Party Status Scheduled Notification',
    template_name: 'connect_status_subscription_automated_email',
    use_layout: true,
  },
];
