/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from '.';

const section: string = 'Shipping Email';
const TEMPLATE_TYPE: string = 'system';

export const shippingAutomatedEmailTemplates: any[] = [
  {
    _id: 'd4ba46c7-9494-4a4b-9f35-fbe06b6095a8',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your business shipping is enabled.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your business shipping is enabled.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                New shipping {{ shippingData.name }} for your business has been successfully activated.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Shipping manage</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping enable automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Enabled Notification',
    template_name: 'shipping_enable_integration_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '14f4711b-a8e4-478c-abb3-7aa3c1f8760b',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your business shipping is disabled.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your business shipping is disabled.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Shipping {{ shippingData.name }} for your business has been successfully disabled.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Shipping manage</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping disabled automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Disabled Notification',
    template_name: 'shipping_disable_integration_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'fe2467f5-50b9-4370-abe6-fba01c163864',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your business shipping is updated.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your business shipping is updated.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <ul>
                {% for shipping in data %}
                  <li>Shipping {{ shipping.shippingData.name }} for your business has been successfully {{ shipping.status }}.</li>
                {% endfor %}
                </ul>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].shippingUrl }}">Shipping manage</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping enable or disabled scheduled automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Status Scheduled Notification',
    template_name: 'shipping_status_integration_scheduled_automated_email',
    use_layout: true,
  },
  {
    _id: 'f1e94ad0-9ad4-4783-8c72-d8e1b2696487',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping origin is successfuly set.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your Shipping origin is successfuly set.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Shipping origin {{ shippingData.name }} for your business has been successfully set.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Manage Origin</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping set origin automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Set Origin Notification',
    template_name: 'shipping_set_origin_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'db7ff59d-2050-47ab-9152-0249c759c77e',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping origin is removed.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your shipping origin is removed.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Shipping origin {{ shippingData.name }} for your business has been removed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Manage Origin</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping remove origin automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Remove Origin Notification',
    template_name: 'shipping_remove_origin_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'eae7a890-31a4-49ac-b55b-6bb666fb6913',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping origin is updated.`) +
      `<tr class="card"
    style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
    <td>
      <table style="width:100%;border:0;">
        <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
            <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever shipping</p>
          </td>
        </tr>
        <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
            <h1
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Your shipping origin is updated.</h1>
          </td>
        </tr>
        <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
            <p
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              <ul>
              {% for shipping in data %}
                <li>Shipping origin {{ shipping.shippingData.name }} for your business has been successfully {{ shipping.status }}.</li>
              {% endfor %}
              </ul>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <a class="button-black-rounded"
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].shippingUrl }}">Manage Origin</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`,
    description: 'Shipping set remove origin scheduled automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Update Origin Scheduled Notification',
    template_name: 'shipping_status_origin_scheduled_automated_email',
    use_layout: true,
  },
  {
    _id: '6d9b36b9-5c82-49e2-b4a1-41ae6bfd424b',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping zone is successfuly set.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your shipping zone is successfuly set.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Shipping zone {{ shippingData.name }} for your business has been successfully set.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Manage Zone</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping set zone automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Set Zone Notification',
    template_name: 'shipping_set_zone_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '7b253b5c-2f54-4972-aa7d-1fe598499f37',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping zone is removed.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your shipping zone is removed.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Shipping zone {{ shippingData.name }} for your business has been removed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Manage Zobe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping remove zone automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Remove Zone Notification',
    template_name: 'shipping_remove_zone_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '74af5d66-9ce6-44de-83c0-f4c91696c18c',
    body:
      headerTemplate('Hi {{ owner.userAccount.firstName }}, your shipping zone is updated.') +
      `<tr class="card"
    style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
    <td>
      <table style="width:100%;border:0;">
        <tr>
          <td class="pb-1" style="padding-bottom: 14px;">
            <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
              class="small fw-500">payever shipping</p>
          </td>
        </tr>
        <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
            <h1
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              Your shipping zone is updated.</h1>
          </td>
        </tr>
        <tr>
          <td class="pb-2" style="padding-bottom: 20px;">
            <p
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
              <ul>
              {% for shipping in data %}
                <li>Shipping zone {{ shipping.shippingData.name }} for your business has been successfully {{ shipping.status }}.</li>
              {% endfor %}
              </ul>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <a class="button-black-rounded"
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].shippingUrl }}">Manage Zone</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`,
    description: 'Shipping set remove zone scheduled automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Update Zone Scheduled Notification',
    template_name: 'shipping_status_zone_scheduled_automated_email',
    use_layout: true,
  },
  {
    _id: 'fb9cc36f-9670-4d62-b0ee-9371aba9be85',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping box is successfuly set.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your shipping box is successfuly set.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Shipping Box {{ shippingData.name }} for your business has been successfully set.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Manage Box</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping set box automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Set Box Notification',
    template_name: 'shipping_set_box_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'b5086105-4dcb-4dcc-a0e2-802b7d3b1bfc',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping box is removed.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your shipping box is removed.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Shipping Box {{ shippingData.name }} for your business has been successfully removed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ shippingUrl }}">Manage Box</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping remove box automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Remove Box Notification',
    template_name: 'shipping_remove_box_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'e034cbfb-5285-49dd-b2e4-3d531f6bee01',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, your shipping box is updated.`) +
      `<tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever shipping</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Your shipping box is updated.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <ul>
                {% for shipping in data %}
                  <li>Shipping Box {{ shipping.shippingData.name }} for your business has been successfully {{ shipping.status }}.</li>
                {% endfor %}
                </ul>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].shippingUrl }}">Manage Box</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Shipping set remove box scheduled automated email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Shipping Updated Box Scheduled Notification',
    template_name: 'shipping_status_box_scheduled_automated_email',
    use_layout: true,
  },
];
