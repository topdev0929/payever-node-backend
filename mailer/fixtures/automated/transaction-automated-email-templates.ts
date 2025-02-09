import { headerTemplate } from '.';

const section: string = 'Transaction Email';
const TEMPLATE_TYPE: string = 'system';

export const transactionAutomatedEmailTemplates: any[] = [
  {
    _id: '9d407349-1686-4d00-a3d1-880b1db983cf',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, you just got new transaction.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever transaction</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                You just got new transaction with these details:</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                <table>
                  <tr>
                      <td>Amount</td>
                      <td>{{ amount }}</td>
                  </tr>
                  <tr>
                      <td>Name</td>
                      <td>{{ customer_name }}</td>
                  </tr>
                  <tr>
                      <td>Email</td>
                      <td>{{ customer_email }}</td>
                  </tr>
                  <tr>
                      <td>Items</td>
                      <td>
                      {% if items | length > 0 %}
                      <p>
                      {% for item in items %}
                      {{ item.quantity }}&times;&nbsp;{{ item.name }}
                      {% if not loop.last %}, {% endif %}
                      {% endfor %}
                      </p>
                      {% endif %}
                      </td>
                  </tr>
                </table>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ transactionUrl }}">Manage transaction</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'New Transaction Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'New Transaction Notification',
    template_name: 'new_transaction_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '2655be5f-0a29-4e7c-8e89-59bb8ab48ce6',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, 
              {% if data | length > 1 %}
              you just got several new transactions
              {% else %}
              you just got new transaction
              {% endif %}`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever transaction</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                {% if data | length > 1 %}
                You just got several new transactions with these details
                {% else %}
                You just got new transaction with this details
                {% endif %}
              </h1>
            </td>
          </tr>  
          {% for transaction in data %}
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">  
                <table>
                  <tr>
                      <td>Amount</td>
                      <td>{{ transaction.amount }}</td>
                  </tr>
                  <tr>
                      <td>Name</td>
                      <td>{{ transaction.customer_name }}</td>
                  </tr>
                  <tr>
                      <td>Email</td>
                      <td>{{ transaction.customer_email }}</td>
                  </tr>
                  <tr>
                      <td>Items</td>
                      <td>
                      {% if transaction.items | length > 0 %}
                      <p>
                      {% for item in transaction.items %}
                      {{ item.quantity }}&times;&nbsp;{{ item.name }}
                      {% if not loop.last %}, {% endif %}
                      {% endfor %}
                      </p>
                      {% endif %}
                      </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <a class="button-black-rounded"
              style="margin:0;mso-line-height-rule:exactly;font-family: HelveticaNeue, Helvetica, Arial, sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ transaction.transactionUrl }}">Manage transaction</a>
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
    description: 'New Transaction Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'New Transaction Notification',
    template_name: 'new_transaction_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
];
