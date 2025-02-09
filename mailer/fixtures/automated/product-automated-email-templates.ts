import { headerTemplate } from './common-templates';

const section: string = 'Product Email';
const TEMPLATE_TYPE: string = 'system';

export const productAutomatedEmailTemplates: any[] = [
  {
    _id: 'a5a4a388-09b6-4ca6-bb49-33837a01aa27',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, it’s time to sell more.`) +
      `
    <tr class="card"
      style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
      <td>
        <table style="width:100%;border:0;">
          <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
              <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever product</p>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Add your first product and start selling.</h1>
            </td>
          </tr>
          <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
              <p
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                We saw that you’ve never added any product yet. Add your first product and start
                selling.</p>
            </td>
          </tr>
          <tr>
            <td>
              <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ productUrl }}">Add
                your first payever product</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    description: 'Add Product Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Add Product Notification',
    template_name: 'add_product_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: 'fa709570-de9b-423d-97df-6a6c6bfccb6c',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, please update your product.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever product</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Manage your image product.</h1>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <p
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                We find {{ productTitle }} product do not have any image yet. Please add image to your product.</p>
            </td>
            </tr>
            <tr>
            <td>
                <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ productUrl }}">Manage your product</a>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'Missing Image Product Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Missing Image Product Notification',
    template_name: 'missing_image_product_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
  {
    _id: '70585107-8694-4ece-96be-cc0a4276a91d',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, please update your product.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever product</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Manage your image product.</h1>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <p
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                We find some products do not have any image yet. Please add image to your products.</p>
            </td>
            </tr>
            {% for product in data %}
            <tr>
            <td>
                <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ product.productUrl }}">Manage {{ product.productTitle }}</a>
            </td>
            </tr>
            {% endfor %}
        </table>
        </td>
    </tr>`,
    description: 'Missing Image Product Notification by email',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Missing Images Product Notification',
    template_name: 'missing_image_product_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },


  {
    _id: 'db4f5a1a-5dcb-43e6-b65d-ab7b9e55c78f',
    body:
      headerTemplate(`Hi {{ owner.userAccount.firstName }}, please update your product.`) +
      `
    <tr class="card"
        style="display:flex;width:400px;padding:30px 18px;background-color:#fafafa;color:#000000;margin-bottom:10px;">
        <td>
        <table style="width:100%;border:0;">
            <tr>
            <td class="pb-1" style="padding-bottom: 14px;">
                <p style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;"
                class="small fw-500">payever product</p>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <h1
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:32px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                Manage your product stock.</h1>
            </td>
            </tr>
            <tr>
            <td class="pb-2" style="padding-bottom: 20px;">
                <p
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;max-width:85%;font-size:19px;font-weight:400;font-stretch:normal;font-style:normal;line-height:normal;letter-spacing:normal;color:#000000;">
                We find your product with sku {{ sku }} is low stock. Current stock is {{ stock }}.</p>
            </td>
            </tr>
            <tr>
            <td>
                <a class="button-black-rounded"
                style="margin:0;mso-line-height-rule:exactly;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-decoration:none;display:inline-block;font-size:16px;font-weight:500;font-stretch:normal;font-style:normal;line-height:normal;text-align:center;background-color:#000000;padding:16px 22px;border-radius:28px;color:#ffffff;" href="{{ productsUrl }}">Manage products</a>
            </td>
            </tr>
        </table>
        </td>
    </tr>`,
    description: 'Product is low stock',
    layout: `70b97850-5070-4b6a-8a7d-09be980dee8b`,
    section: section,
    subject: 'Product is low stock',
    template_name: 'product_low_stock_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: true,
  },
];
