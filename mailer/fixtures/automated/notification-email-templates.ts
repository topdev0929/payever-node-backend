const section: string = 'Automated Email';
const TEMPLATE_TYPE: string = 'system';

export const notificationEmailTemplates: any[] = [
  {
    _id: '43a6e8c5-b2e2-4c2f-94dc-e89788de9cf8',
    body: `{{ data }}`,
    description: 'Notification by email',
    layout: null,
    section: section,
    subject: 'Plain',
    template_name: 'plain_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: false,
  },
  {
    _id: 'ca419361-508e-487c-af6b-b7f8ce2fe9de',
    body: `<p>Hello {{ owner.userAccount.firstName }},</p>
    <p>You need to add product added to your shop</p>
    {% for notif in data %}
      <p><a href="{{ notif.productUrl }}">{{ notif.productUrl }}</a></p>
    {% endfor %}
    `,
    description: 'Add Product Notification by email',
    layout: null,
    section: section,
    subject: 'Add Product Notification',
    template_name: 'add_product_scheduled_automated_email',
    template_type: TEMPLATE_TYPE,
    use_layout: false,
  },
];
