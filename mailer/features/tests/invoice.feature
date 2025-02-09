Feature: Payment mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send an invoice mail
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "cc": [],
          "to": "test@test.de",
          "template_name": "order_invoice_template",
          "business": {
            "uuid": "614cb154-0323-4df0-be89-85376b9de666"
          },
          "payment": {
            "id": "cb7a6e42761a579fea53b2852f20f93a",
            "address": {
              "uuid": "2a660411-87a0-427d-a31c-5020c7ac12ba",
              "salutation": "SALUTATION_MR",
              "first_name": "Jan",
              "last_name": "Test",
              "email": "test@test.de",
              "country": "DE",
              "country_name": "Germany",
              "city": "Elmshorn",
              "zip_code": "25335",
              "street": "Schulstraße 6",
              "street_name": "Schulstraße",
              "street_number": "6",
              "phone": "+4917657960166"
            },
            "amount": 29.95,
            "created_at": "2019-09-06T10:17:42+00:00",
            "currency": "EUR",
            "reference": "1567764819.47265d7231537362c0.94465744",
            "total": 41.95,
            "vat_rate": 0,
            "delivery_fee": 10,
            "customer_email": "test@test.de",
            "customer_name": "Jan Test",
            "payment_option": {
              "payment_method": "paypal"
            }
          },
          "payment_items": [
            {
              "name": "Krawatte 100% Seide",
              "price": 29.95,
              "quantity": 1,
              "thumbnail": "https://payeverproduction.blob.core.windows.net/products/2455c5fe-3d52-42af-9baf-d5e1aa520c8c-19",
              "uuid": "cfb296c7-dfcb-4b16-9995-77b4babe791b",
              "vat_rate": 0,
              "options": [
                {
                  "name": "Color",
                  "value": "Green"
                },
                {
                  "name": "Size",
                  "value": "M"
                }
              ]
            }
          ]
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Test Business: Your order cb7a6e42761a579fea53b2852f20f93a"
    }
    """
