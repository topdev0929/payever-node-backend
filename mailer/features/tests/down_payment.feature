Feature: Payment mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send an invoice mail (no BOTH accountNumber or iban - this should fail!)
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "bank-accounts"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "locale": "business",
          "template_name": "santander_invoice_downpayment_customer",
          "to": "test@test.com",
          "business": {
            "uuid": "46fd0097-0b6e-46ba-8272-2f0770fc4c14",
            "slug": "mactrade-ii",
            "address": {
              "country": "DE",
              "city": "Regensburg",
              "zip_code": "93053",
              "street": "2f, Bajuwarenstr.",
              "phone": "09417853220",
              "salutation": "SALUTATION_MR",
              "first_name": "-",
              "last_name": ""
            },
            "user": {
              "email": "test@test.com",
              "first_name": "test",
              "last_name": "test"
            },
            "contact_emails": []
          },
          "payment": {
            "id": "f5982eafcb87164f64f52f4a8d31359f",
            "uuid": "d185020b-1cf4-4996-9be1-0025eab9aa87",
            "amount": 2110.05,
            "total": 2127.04,
            "currency": "EUR",
            "reference": "1845841991",
            "customer_name": "Customer Customer",
            "customer_email": "customer@customer.com",
            "specific_status": "STATUS_SANTANDER_APPROVED",
            "status": "STATUS_ACCEPTED",
            "address": {
              "country": "DE",
              "city": "Customer City",
              "zip_code": "22851",
              "street": "Unknown Road",
              "phone": "9999999",
              "salutation": "SALUTATION_MR",
              "first_name": "Customer",
              "last_name": "Customer"
            },
            "fee": 16.99,
            "delivery_fee": 16.99,
            "payment_fee": 0,
            "down_payment": 550,
            "place": "accepted",
            "business_payment_option": {
              "accept_fee": false,
              "status": "enabled",
              "fixed_fee": 0,
              "variable_fee": 0,
              "options": [],
              "payment_option": {
                "payment_method": "santander_installment"
              }
            },
            "created_at": "2019-08-24T08:20:52+00:00"
          },
          "payment_details": [],
          "payment_items": [
            {
              "uuid": "21ee9ff0-50f2-4c0d-b5d0-e9613598e39a",
              "name": "MacBook Pro 15.4\" Touch-Bar 2.6 GHz 6-Core i7 - 256 GB SSD - Spacegrau // NEU ",
              "price": 2260.05,
              "quantity": 1,
              "price_net": 0,
              "vat_rate": 0,
              "thumbnail": "https://www.test.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
              "url": "https://www.test.de/macbook-pro-15-4-touch-bar-2-6-ghz-6-core-i7-256-gb-ssd-spacegrau-neu.html"
            },
            {
              "uuid": "d7445154-d360-4816-8921-349519f479a1",
              "name": "Discount",
              "price": -150,
              "quantity": 1,
              "price_net": 0,
              "vat_rate": 0
            }
          ],
          "variables": {
            "customer": {
              "name": "Customer Customer"
            },
            "application": {
              "number": "3500510221190824102000"
            },
            "items": [
              {
                "uuid": "21ee9ff0-50f2-4c0d-b5d0-e9613598e39a",
                "name": "MacBook Pro 15.4\" Touch-Bar 2.6 GHz 6-Core i7 - 256 GB SSD - Spacegrau // NEU ",
                "price": 2260.05,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0,
                "thumbnail": "https://www.test.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
                "url": "https://www.test.de/macbook-pro-15-4-touch-bar-2-6-ghz-6-core-i7-256-gb-ssd-spacegrau-neu.html"
              },
              {
                "uuid": "d7445154-d360-4816-8921-349519f479a1",
                "name": "Discount",
                "price": -150,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0
              }
            ]
          },
          "should_actually_send_email": true
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should not be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Ihre Anzahlung bei Test Business"
    }
    """

  Scenario: Send a payment mail
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "locale": "business",
          "template_name": "santander_downpayment_status_approved",
          "to": "all-business-emails",
          "business": {
            "uuid": "614cb154-0323-4df0-be89-85376b9de666",
            "slug": "mactrade-ii",
            "address": {
              "country": "DE",
              "city": "Regensburg",
              "zip_code": "93053",
              "street": "2f, Bajuwarenstr.",
              "phone": "09417853220",
              "salutation": "SALUTATION_MR",
              "first_name": "-",
              "last_name": ""
            },
            "user": {
              "email": "test@test.com",
              "first_name": "test",
              "last_name": "test"
            },
            "contact_emails": []
          },
          "payment": {
            "id": "f5982eafcb87164f64f52f4a8d31359f",
            "uuid": "d185020b-1cf4-4996-9be1-0025eab9aa87",
            "amount": 2110.05,
            "total": 2127.04,
            "currency": "EUR",
            "reference": "1845841991",
            "customer_name": "Customer Customer",
            "customer_email": "customer@customer.com",
            "specific_status": "STATUS_SANTANDER_APPROVED",
            "status": "STATUS_ACCEPTED",
            "address": {
              "country": "DE",
              "city": "Customer City",
              "zip_code": "22851",
              "street": "Unknown Road",
              "phone": "9999999",
              "salutation": "SALUTATION_MR",
              "first_name": "Customer",
              "last_name": "Customer"
            },
            "fee": 16.99,
            "delivery_fee": 16.99,
            "payment_fee": 0,
            "down_payment": 550,
            "place": "accepted",
            "business_payment_option": {
              "accept_fee": false,
              "status": "enabled",
              "fixed_fee": 0,
              "variable_fee": 0,
              "options": [],
              "payment_option": {
                "payment_method": "santander_installment"
              }
            },
            "created_at": "2019-08-24T08:20:52+00:00"
          },
          "payment_details": [],
          "payment_items": [
            {
              "uuid": "21ee9ff0-50f2-4c0d-b5d0-e9613598e39a",
              "name": "MacBook Pro 15.4\" Touch-Bar 2.6 GHz 6-Core i7 - 256 GB SSD - Spacegrau // NEU ",
              "price": 2260.05,
              "quantity": 1,
              "price_net": 0,
              "vat_rate": 0,
              "thumbnail": "https://www.test.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
              "url": "https://www.test.de/macbook-pro-15-4-touch-bar-2-6-ghz-6-core-i7-256-gb-ssd-spacegrau-neu.html"
            },
            {
              "uuid": "d7445154-d360-4816-8921-349519f479a1",
              "name": "Discount",
              "price": -150,
              "quantity": 1,
              "price_net": 0,
              "vat_rate": 0
            }
          ],
          "variables": {
            "customer": {
              "name": "Customer Customer"
            },
            "application": {
              "number": "3500510221190824102000"
            },
            "items": [
              {
                "uuid": "21ee9ff0-50f2-4c0d-b5d0-e9613598e39a",
                "name": "MacBook Pro 15.4\" Touch-Bar 2.6 GHz 6-Core i7 - 256 GB SSD - Spacegrau // NEU ",
                "price": 2260.05,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0,
                "thumbnail": "https://www.test.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
                "url": "https://www.test.de/macbook-pro-15-4-touch-bar-2-6-ghz-6-core-i7-256-gb-ssd-spacegrau-neu.html"
              },
              {
                "uuid": "d7445154-d360-4816-8921-349519f479a1",
                "name": "Discount",
                "price": -150,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0
              }
            ]
          },
          "reference": "1845841991",
          "should_actually_send_email": true
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Customer Customer Customer - application (€2,127.04) approved",
      "html":"*<p>Dear Sir or Madame,</p>\n      <p>our partner bank has received and approved the complete application of the  customer Customer Customer.\n      Please check your bank account to see if you have already  received the downpayment of this customer - if you haven't, we strongly recommend to not ship the order until you do find a payment with reference 1845841991 in your account, as you would otherwise incur the risk of not receiving the downpayment (neither payever nor its partner bank will cover for this loss).\n      Please remeber to update the status of the order accordingly after you shipped it, either via your shop system or in your payever account (click on &ldquo;sent&rdquo). After that, our partner bank will transfer the respective amount to your bank account within a few business days.</p>\n      </p>*"
    }
    """

  Scenario: Send an invoice downpayment mail (no either accountNumber or iban)
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "bank-accounts"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "locale": "business",
          "template_name": "santander_invoice_downpayment_customer",
          "to": "test@test.com",
          "business": {
            "uuid": "3bc2d7f7-cea6-4986-9b46-26a3011225a7",
            "slug": "mactrade-ii",
            "address": {
              "country": "DE",
              "city": "Regensburg",
              "zip_code": "93053",
              "street": "2f, Bajuwarenstr.",
              "phone": "09417853220",
              "salutation": "SALUTATION_MR",
              "first_name": "-",
              "last_name": ""
            },
            "user": {
              "email": "test@test.com",
              "first_name": "test",
              "last_name": "test"
            },
            "contact_emails": []
          },
          "payment": {
            "id": "f5982eafcb87164f64f52f4a8d31359f",
            "uuid": "d185020b-1cf4-4996-9be1-0025eab9aa87",
            "amount": 2110.05,
            "total": 2127.04,
            "currency": "EUR",
            "reference": "1845841991",
            "customer_name": "Customer Customer",
            "customer_email": "customer@customer.com",
            "specific_status": "STATUS_SANTANDER_APPROVED",
            "status": "STATUS_ACCEPTED",
            "address": {
              "country": "DE",
              "city": "Customer City",
              "zip_code": "22851",
              "street": "Unknown Road",
              "phone": "9999999",
              "salutation": "SALUTATION_MR",
              "first_name": "Customer",
              "last_name": "Customer"
            },
            "fee": 16.99,
            "delivery_fee": 16.99,
            "payment_fee": 0,
            "down_payment": 550,
            "place": "accepted",
            "business_payment_option": {
              "accept_fee": false,
              "status": "enabled",
              "fixed_fee": 0,
              "variable_fee": 0,
              "options": [],
              "payment_option": {
                "payment_method": "santander_installment"
              }
            },
            "created_at": "2019-08-24T08:20:52+00:00"
          },
          "payment_details": [],
          "payment_items": [
            {
              "uuid": "21ee9ff0-50f2-4c0d-b5d0-e9613598e39a",
              "name": "MacBook Pro 15.4\" Touch-Bar 2.6 GHz 6-Core i7 - 256 GB SSD - Spacegrau // NEU ",
              "price": 2260.05,
              "quantity": 1,
              "price_net": 0,
              "vat_rate": 0,
              "thumbnail": "https://www.test.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
              "url": "https://www.test.de/macbook-pro-15-4-touch-bar-2-6-ghz-6-core-i7-256-gb-ssd-spacegrau-neu.html"
            },
            {
              "uuid": "d7445154-d360-4816-8921-349519f479a1",
              "name": "Discount",
              "price": -150,
              "quantity": 1,
              "price_net": 0,
              "vat_rate": 0
            }
          ],
          "variables": {
            "customer": {
              "name": "Customer Customer"
            },
            "application": {
              "number": "3500510221190824102000"
            },
            "items": [
              {
                "uuid": "21ee9ff0-50f2-4c0d-b5d0-e9613598e39a",
                "name": "MacBook Pro 15.4\" Touch-Bar 2.6 GHz 6-Core i7 - 256 GB SSD - Spacegrau // NEU ",
                "price": 2260.05,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0,
                "thumbnail": "https://www.test.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
                "url": "https://www.test.de/macbook-pro-15-4-touch-bar-2-6-ghz-6-core-i7-256-gb-ssd-spacegrau-neu.html"
              },
              {
                "uuid": "d7445154-d360-4816-8921-349519f479a1",
                "name": "Discount",
                "price": -150,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0
              }
            ]
          },
          "should_actually_send_email": true
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Ihre Anzahlung bei Test Business"
    }
    """
