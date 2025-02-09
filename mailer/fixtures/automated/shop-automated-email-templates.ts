import { headerTemplate } from '.';

const section: string = 'Shop Email';
const TEMPLATE_TYPE: string = 'system';

export const shopAutomatedEmailTemplates: any[] = [
  {
    _id: '9ac435a8-ee1e-4456-94de-58ac4c1a985d',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, Your {{ shopName }} shop need some update.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shop</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your {{ shopName }} shop need some update to be able to run properly.</h1>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Actions to do:</p>
                <p>
                <ul>
                    {% if notif | length > 0 %}
                    {% for item in notif %}
                    <li>{{ item }}</li>
                    {% endfor %}
                    {% endif %}
                </ul>
                </p>
            </td>
            </tr>
            <tr>
            <td>
                <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shopUrl }}">Manage your shop</a>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'Shop Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Your shop need taking care',
    template_name: 'shop_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'af9aefe5-19dc-4822-a66a-bc103b81afef',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            Some of your shops need some update.
            {% else %}
            Your shop need some update.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shop</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 0 %}
                Some of your shops need some update to be able to run properly.
                {% else %}
                Your shop need some update to be able to run properly.
                {% endif %}
              </h1>
            </td>
          </tr>
          {% for shop in data %}
            <tr>
              <td class="pb-2" style="padding-bottom: 20px;">
                <p
                  style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                  Actions to do for {{ shop.shopName }} shop:</p>
                <p>
                  <ul>
                    {% if shop.notif | length > 0 %}
                    {% for item in shop.notif %}
                    <li>{{ item }}</li>
                    {% endfor %}
                    {% endif %}
                  </ul>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <a class="button-black-rounded"
                  style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shop.shopUrl }}">Manage your shop</a>
                  <br><br>
              </td>
            </tr>
          {% endfor %}
        </table>
      </td>
    </tr>`,
    description: 'Shop Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Your shop need taking care',
    template_name: 'shop_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
];
