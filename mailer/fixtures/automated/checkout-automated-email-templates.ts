/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import { headerTemplate } from './common-templates';

const section: string = 'Checkout Email';
const TEMPLATE_TYPE: string = 'system';

export const checkoutAutomatedEmailTemplates: any[] = [
  {
    _id: 'e9887f04-1570-4347-81ed-ed4fa1d7d866',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, new payment has been confirmed.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                New payment has been confirmed.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <table>
                  <tr>
                    <td>Payment ID</td><td>{{ checkoutData.uuid }}</td>
                  </tr>
                  <tr>
                    <td>Status</td><td>{{ checkoutData.status }}</td>
                  </tr>
                  <tr>
                    <td>Name</td><td>{{ checkoutData.customer_name }}</td>
                  </tr>
                  <tr>
                    <td>Email</td><td>{{ checkoutData.customer_email }}</td>
                  </tr>
                  <tr>
                    <td>Total</td><td>{{ checkoutData.total }} {{ checkoutData.currency }}</td>
                  </tr>
                  <tr>
                    <td>Address</td><td>{{ checkoutData.shipping_address.salutation }} {{ checkoutData.shipping_address.first_name }} {{ checkoutData.shipping_address.last_name }} {{ checkoutData.shipping_address.street }} {{ checkoutData.shipping_address.city }} {{ checkoutData.shipping_address.country }} {{ checkoutData.shipping_address.zip_code }}
                    </td>
                  </tr>
                </table>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ transactionsUrl }}">Manage payment</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Payment Created Checkout Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Payment Created Checkout Notification',
    template_name: 'payment_created_checkout_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '3d4dfe15-fa6a-44c5-abbf-ebd813f96b32',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several new payments has been confirmed.
            {% else %}
            new payment has been confirmed.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                Several new payments has been confirmed.
                {% else %}
                New payment has been confirmed.
                {% endif %}
              </h1>
            </td>
          </tr>
          {% for checkout in data %}
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <table>
                  <tr>
                    <td>Payment ID</td><td>{{ checkout.checkoutData.uuid }}</td>
                  </tr>
                  <tr>
                    <td>Status</td><td>{{ checkout.checkoutData.status }}</td>
                  </tr>
                  <tr>
                    <td>Name</td><td>{{ checkout.checkoutData.customer_name }}</td>
                  </tr>
                  <tr>
                    <td>Email</td><td>{{ checkout.checkoutData.customer_email }}</td>
                  </tr>
                  <tr>
                    <td>Total</td><td>{{ checkout.checkoutData.total }} {{ checkout.checkoutData.currency }}</td>
                  </tr>
                  <tr>
                    <td>Address</td><td>{{ checkout.checkoutData.shipping_address.salutation }} {{ checkout.checkoutData.shipping_address.first_name }} {{ checkout.checkoutData.shipping_address.last_name }} {{ checkout.checkoutData.shipping_address.street }} {{ checkout.checkoutData.shipping_address.city }} {{ checkout.checkoutData.shipping_address.country }} {{ checkout.checkoutData.shipping_address.zip_code }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <a class="button-black-rounded"
                        style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ checkout.transactionsUrl }}">Manage payment</a>
                    </td>
                  </tr>
                </table>
              </p>
            </td>
          </tr>
          {% endfor %}
        </table>
      </td>
    </tr>`,
    description: 'Payment Created Checkout Scheduled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Payment Created Checkout Scheduled Notification',
    template_name: 'payment_created_checkout_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'f7c66aed-3c77-4d18-9a59-5365b13bda3a',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, payment has been updated.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Payment has been updated.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <table>
                  <tr>
                    <td>Payment ID</td><td>{{ checkoutData.uuid }}</td>
                  </tr>
                  <tr>
                    <td>Status</td><td>{{ checkoutData.status }}</td>
                  </tr>
                  <tr>
                    <td>Name</td><td>{{ checkoutData.customer_name }}</td>
                  </tr>
                  <tr>
                    <td>Email</td><td>{{ checkoutData.customer_email }}</td>
                  </tr>
                  <tr>
                    <td>Total</td><td>{{ checkoutData.total }} {{ checkoutData.currency }}</td>
                  </tr>
                  <tr>
                    <td>Address</td><td>{{ checkoutData.shipping_address.salutation }} {{ checkoutData.shipping_address.first_name }} {{ checkoutData.shipping_address.last_name }} {{ checkoutData.shipping_address.street }} {{ checkoutData.shipping_address.city }} {{ checkoutData.shipping_address.country }} {{ checkoutData.shipping_address.zip_code }}
                    </td>
                  </tr>
                </table>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ transactionsUrl }}">Manage payment</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Payment Updated Checkout Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Payment Updated Checkout Notification',
    template_name: 'payment_updated_checkout_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '3a5700dc-a4f0-4a4f-a56f-6c355de1d1af',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several payments has been updated.
            {% else %}
            payment has been updated.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                Several payments has been updated.
                {% else %}
                Payment has been updated.
                {% endif %}
              </h1>
            </td>
          </tr>
          {% for checkout in data %}
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <table>
                  <tr>
                    <td>Payment ID</td><td>{{ checkout.checkoutData.uuid }}</td>
                  </tr>
                  <tr>
                    <td>Status</td><td>{{ checkout.checkoutData.status }}</td>
                  </tr>
                  <tr>
                    <td>Name</td><td>{{ checkout.checkoutData.customer_name }}</td>
                  </tr>
                  <tr>
                    <td>Email</td><td>{{ checkout.checkoutData.customer_email }}</td>
                  </tr>
                  <tr>
                    <td>Total</td><td>{{ checkout.checkoutData.total }} {{ checkout.checkoutData.currency }}</td>
                  </tr>
                  <tr>
                    <td>Address</td><td>{{ checkout.checkoutData.shipping_address.salutation }} {{ checkout.checkoutData.shipping_address.first_name }} {{ checkout.checkoutData.shipping_address.last_name }} {{ checkout.checkoutData.shipping_address.street }} {{ checkout.checkoutData.shipping_address.city }} {{ checkout.checkoutData.shipping_address.country }} {{ checkout.checkoutData.shipping_address.zip_code }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <a class="button-black-rounded"
                        style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ checkout.transactionsUrl }}">Manage payment</a>
                    </td>
                  </tr>
                </table>
              </p>
            </td>
          </tr>
          {% endfor %}
        </table>
      </td>
    </tr>`,
    description: 'Payment Updated Checkout Scheduled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Payment Updated Checkout Scheduled Notification',
    template_name: 'payment_updated_checkout_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '827ce4f5-08fd-46a4-9955-0ca91509b054',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, payment has been removed.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Payment has been removed.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <table>
                  <tr>
                    <td>Payment ID</td><td>{{ checkoutData.uuid }}</td>
                  </tr>
                  <tr>
                    <td>Status</td><td>{{ checkoutData.status }}</td>
                  </tr>
                  <tr>
                    <td>Name</td><td>{{ checkoutData.customer_name }}</td>
                  </tr>
                  <tr>
                    <td>Email</td><td>{{ checkoutData.customer_email }}</td>
                  </tr>
                  <tr>
                    <td>Total</td><td>{{ checkoutData.total }} {{ checkoutData.currency }}</td>
                  </tr>
                  <tr>
                    <td>Address</td><td>{{ checkoutData.shipping_address.salutation }} {{ checkoutData.shipping_address.first_name }} {{ checkoutData.shipping_address.last_name }} {{ checkoutData.shipping_address.street }} {{ checkoutData.shipping_address.city }} {{ checkoutData.shipping_address.country }} {{ checkoutData.shipping_address.zip_code }}
                    </td>
                  </tr>
                </table>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ transactionsUrl }}">Manage payment</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Payment Removed Checkout Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Payment Removed Checkout Notification',
    template_name: 'payment_removed_checkout_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'd08311b8-e6d7-4baf-8fd0-be2885f47d2c',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several payments has been removed.
            {% else %}
            payment has been removed.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                Several payments has been removed.
                {% else %}
                Payment has been removed.
                {% endif %}
              </h1>
            </td>
          </tr>
          {% for checkout in data %}
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <table>
                  <tr>
                    <td>Payment ID</td><td>{{ checkout.checkoutData.uuid }}</td>
                  </tr>
                  <tr>
                    <td>Status</td><td>{{ checkout.checkoutData.status }}</td>
                  </tr>
                  <tr>
                    <td>Name</td><td>{{ checkout.checkoutData.customer_name }}</td>
                  </tr>
                  <tr>
                    <td>Email</td><td>{{ checkout.checkoutData.customer_email }}</td>
                  </tr>
                  <tr>
                    <td>Total</td><td>{{ checkout.checkoutData.total }} {{ checkout.checkoutData.currency }}</td>
                  </tr>
                  <tr>
                    <td>Address</td><td>{{ checkout.checkoutData.shipping_address.salutation }} {{ checkout.checkoutData.shipping_address.first_name }} {{ checkout.checkoutData.shipping_address.last_name }} {{ checkout.checkoutData.shipping_address.street }} {{ checkout.checkoutData.shipping_address.city }} {{ checkout.checkoutData.shipping_address.country }} {{ checkout.checkoutData.shipping_address.zip_code }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <a class="button-black-rounded"
                        style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ checkout.transactionsUrl }}">Manage payment</a>
                    </td>
                  </tr>
                </table>
              </p>
            </td>
          </tr>
          {% endfor %}
        </table>
      </td>
    </tr>`,
    description: 'Payment Removed Checkout Scheduled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Payment Removed Checkout Scheduled Notification',
    template_name: 'payment_removed_checkout_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '65ffff72-5468-4612-9388-1a202b18fd0c',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, connection successfully installed.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Connection successfully installed.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                New connection for your business has been successfully installed
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ checkoutUrl }}">Checkout payment</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Checkout Connection Installed Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Checkout Connection Installed Notification',
    template_name: 'checkout_connection_installed_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '189da1b4-ac33-4ee4-83ed-1d407b245a07',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several connections successfully installed.
            {% else %}
            connection successfully installed.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">      
                {% if data | length > 1 %}
                Several connections successfully installed.
                {% else %}
                Connection successfully installed.
                {% endif %}
              </h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                Several connections 
                {% else %}
                A connection 
                {% endif %} for your business has been successfully installed
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].checkoutUrl }}">Checkout payment</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Checkout Connection Installed Scheduled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Checkout Connection Installed Scheduled Notification',
    template_name: 'checkout_connection_installed_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'bc5537a4-1852-4a1f-9e88-a8b8ac709297',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, connection successfully uninstalled.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Connection successfully uninstalled.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                New connection for your business has been successfully uninstalled
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ checkoutUrl }}">Checkout payment</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Checkout Connection uninstalled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Checkout Connection uninstalled Notification',
    template_name: 'checkout_connection_uninstalled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '81c4878d-10f7-4e40-8042-d37032bc091b',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several connections successfully uninstalled.
            {% else %}
            connection successfully uninstalled.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">      
                {% if data | length > 1 %}
                Several connections successfully uninstalled.
                {% else %}
                Connection successfully uninstalled.
                {% endif %}
              </h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                Several connections 
                {% else %}
                A connection 
                {% endif %} for your business has been successfully uninstalled
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].checkoutUrl }}">Checkout payment</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Checkout Connection Unnstalled Scheduled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Checkout Connection Unistalled Scheduled Notification',
    template_name: 'checkout_connection_uninstalled_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '9af67638-bce1-4555-ae46-93c8240811af',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, channel has been activated.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Channel has been activated.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                New channel for your business has been successfully activated.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ checkoutUrl }}">Checkout channel</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Channnel Set Activated Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Channnel Set Activated Notification',
    template_name: 'channel_set_activated_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'a2b960f7-b17a-49e8-a4c5-84490d6756bf',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
            {% if data | length > 1 %}
            several channel has been activated.
            {% else %}
            Channel has been activated.
            {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever checkout</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">      
                {% if data | length > 1 %}
                Several channel has been activated.
                {% else %}
                Channel has been activated.
                {% endif %}
              </h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                Several channel 
                {% else %}
                A channel 
                {% endif %} for your business has been successfully activated.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ data[0].checkoutUrl }}">Checkout channel</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Channnel Set Activated Scheduled Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Channnel Set Activated Scheduled Notification',
    template_name: 'channel_set_activated_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
];
