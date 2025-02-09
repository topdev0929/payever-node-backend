@payment-mails
Feature: Payment mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send a payment mail
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "locale": "en",
          "template_name": "santander_payment_status_temporary_approved_merchant",
          "to": "all-business-emails",
          "cc": [],
          "business": {
            "uuid": "614cb154-0323-4df0-be89-85376b9de666",
            "slug": "614cb154-0323-4df0-be89-85376b9de666",
            "address": {
              "country": "DE",
              "first_name": "Aleksey",
              "last_name": "Egorov"
            },
            "user": {
              "email": "countzero1981@gmail.com",
              "first_name": "Aleksey",
              "last_name": "Egorov"
            },
            "contact_emails": []
          },
          "payment": {
            "id": "60c15cd3ebb1795fb2955c9f47515b20",
            "uuid": "5ffa0715-47c1-4be0-9f9c-cedccdf7ef4f",
            "amount": 3000,
            "total": 3000,
            "currency": "EUR",
            "reference": "arst",
            "customer_name": "Stub Shop_temporary_approved",
            "customer_email": "test@test.com",
            "specific_status": "STATUS_SANTANDER_SHOP_TEMPORARY_APPROVED",
            "status": "STATUS_IN_PROCESS",
            "address": {
              "country": "DE",
              "city": "Berlin",
              "zip_code": "10715",
              "street": "Berliner Straße 1",
              "salutation": "SALUTATION_MR",
              "first_name": "Stub",
              "last_name": "Shop_temporary_approved"
            },
            "fee": 0,
            "delivery_fee": 0,
            "payment_fee": 0,
            "down_payment": 0,
            "place": "new",
            "business_payment_option": {
              "accept_fee": true,
              "status": "enabled",
              "fixed_fee": 0,
              "variable_fee": 0,
              "payment_option": {
                "payment_method": "santander_installment"
              }
            },
            "created_at": "2019-08-26T15:56:18+00:00"
          },
          "payment_details": [],
          "payment_items": [],
          "variables": {
            "application": {
              "number": "STUB_APPLICATION_NO_1566834978"
            },
            "customer": {
              "name": "Aleksey Egorov",
              "email": "test@test.com"
            },
            "items": [
              {
                "uuid": "016f56bb-7d07-4b38-8871-f84707ffd297",
                "name": "iMac 21.5\" 4K 3.6 GHz Quad-Core i3 -  8GB - 1TB HDD // NEU",
                "price": 1323.35,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0,
                "thumbnail": "https://www.mactrade.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
                "url": "https://www.mactrade.de/imac-21-5-4k-3-6-ghz-quad-core-i3-8gb-1tb-hdd-neu.html"
              },
              {
                "uuid": "a7f53788-841d-4f01-951f-bcaf3ef1a288",
                "name": "Discount",
                "price": -150,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0
              }
            ],
            "merchant": {
              "name": "Aleksey Egorov"
            },
            "payment" : {
              "total": 3000,
              "currency": "EUR",
              "customer_name": "Customer Name",
              "address": {
                "fullAddress": "fullAddress"
              },
              "business": {
                "name": "business name"
              }
            }
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
      "subject": "Customer Customer Name - Application (€3,000.00) in process",
      "html":"*<p>Dear Sir or Madame,</p>\n<p>we are happy to inform you that the loan application (€3,000.00) for the customer Customer Name has been provisionally approved. </p><p> Your customer now still needs to verify his identity (via video or post office identification) and perhaps submit additonal documents to our partner bank. As soon as all required information and documents have arrived and our partner bank have given their final approval, we will send you another Email. </p><p> Please do not ship this order before you receive this email or see a coresponding status change in your shop system or payever account, as neither we nor our partner bank will cover your potential losses in case you ship before the final approval. </p><p> </p>\n<p><strong>Ordered at:</strong>\nTest Business</p>\n<p><strong>Customer Name:</strong> Customer Name</p>\n<p>\n<strong>Address:</strong>fullAddress</p>\n<p><strong>E-Mail-Address:</strong>\ntest@test.com</p>\n<p><strong>Santander Application No:</strong>\nSTUB_APPLICATION_NO_1566834978</p>\n\n<p><strong>Cart:</strong>\n1&times;&nbsp;iMac 21.5&quot; 4K 3.6 GHz Quad-Core i3 -  8GB - 1TB HDD // NEU\n, 1&times;&nbsp;Discount\n</p>*"
    }
    """

  Scenario: Send a payment mail when contract files upload
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "business": {
            "_id": "78e229c1-4b65-4c20-b3c4-19c547139b19",
            "active": true,
            "contactEmails": [
              "contact@gmail.com",
              "anothercontaact@gmail.com"
            ],
            "currency": "EUR",
            "defaultLanguage": "en",
            "name": "Stripe test",
            "themeSettings": {
              "theme": "default",
              "_id": "0f261bf4-3a46-444a-b3b6-acd34dea70c0",
              "createdAt": "2021-09-16T13:28:08.641Z",
              "updatedAt": "2021-09-16T13:28:08.641Z"
            }
          },
          "locale": "en",
          "template_name": "santander_contract_files_uploaded",
          "to": "service@payever.de",
          "variables": {
            "commercialExcerpt": {},
            "contractFiles": [],
            "files": [],
            "merchant": {
              "email": "contact@gmail.com",
              "hasCommercialExcerpt": false
            }
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "payever - Neuer Händler - contact@gmail.com",
      "html": "*<p>Sehr geehrte Damen und Herren,</p>\n<p>der untenstehende Händler interessiert sich für den Santander Ratenkredit, die nötigen Unterlagen sind der Email angefügt. Wir bitten um die Prüfung der Anlagen und eine entsprechende Rückmeldung. </p>\n<ol>\n    </ol>\n<p>Business: Stripe test</br>\nEmail: contact@gmail.com, anothercontaact@gmail.com</p>\n<p>Vielen Dank!</p>*"
    }
    """

  Scenario: Send a payment mail with attachment
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.payment.email",
        "payload": {
          "locale": "en",
          "template_name": "santander_payment_status_temporary_approved_merchant",
          "to": "all-business-emails",
          "cc": [],
          "business": {
            "uuid": "614cb154-0323-4df0-be89-85376b9de666",
            "slug": "614cb154-0323-4df0-be89-85376b9de666",
            "address": {
              "country": "DE",
              "first_name": "Aleksey",
              "last_name": "Egorov"
            },
            "user": {
              "email": "countzero1981@gmail.com",
              "first_name": "Aleksey",
              "last_name": "Egorov"
            },
            "contact_emails": []
          },
          "payment": {
            "id": "60c15cd3ebb1795fb2955c9f47515b20",
            "uuid": "5ffa0715-47c1-4be0-9f9c-cedccdf7ef4f",
            "amount": 3000,
            "total": 3000,
            "currency": "EUR",
            "reference": "arst",
            "customer_name": "Stub Shop_temporary_approved",
            "customer_email": "test@test.com",
            "specific_status": "STATUS_SANTANDER_SHOP_TEMPORARY_APPROVED",
            "status": "STATUS_IN_PROCESS",
            "address": {
              "country": "DE",
              "city": "Berlin",
              "zip_code": "10715",
              "street": "Berliner Straße 1",
              "salutation": "SALUTATION_MR",
              "first_name": "Stub",
              "last_name": "Shop_temporary_approved"
            },
            "fee": 0,
            "delivery_fee": 0,
            "payment_fee": 0,
            "down_payment": 0,
            "place": "new",
            "business_payment_option": {
              "accept_fee": true,
              "status": "enabled",
              "fixed_fee": 0,
              "variable_fee": 0,
              "payment_option": {
                "payment_method": "santander_installment"
              }
            },
            "created_at": "2019-08-26T15:56:18+00:00"
          },
          "payment_details": [],
          "payment_items": [],
          "variables": {
            "application": {
              "number": "STUB_APPLICATION_NO_1566834978"
            },
            "customer": {
              "name": "Aleksey Egorov",
              "email": "test@test.com"
            },
            "items": [
              {
                "uuid": "016f56bb-7d07-4b38-8871-f84707ffd297",
                "name": "iMac 21.5\" 4K 3.6 GHz Quad-Core i3 -  8GB - 1TB HDD // NEU",
                "price": 1323.35,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0,
                "thumbnail": "https://www.mactrade.de/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/images/catalog/product/placeholder/image.jpg",
                "url": "https://www.mactrade.de/imac-21-5-4k-3-6-ghz-quad-core-i3-8gb-1tb-hdd-neu.html"
              },
              {
                "uuid": "a7f53788-841d-4f01-951f-bcaf3ef1a288",
                "name": "Discount",
                "price": -150,
                "quantity": 1,
                "price_net": 0,
                "vat_rate": 0
              }
            ],
            "merchant": {
              "name": "Aleksey Egorov"
            },
            "payment" : {
              "total": 3000,
              "currency": "EUR",
              "customer_name": "Customer Name",
              "address": {
                "fullAddress": "fullAddress"
              },
              "business": {
                "name": "business name"
              }
            }
          },
          "attachments": [
            {
              "encoding": "base64",
              "content": "c3R1Yl91c2FnZV90ZXh0LCwscXdlcXdlLEFjY2VwdGVkLDEwLDIwMjMtMTItMTJUMTI6MDk6MzArMDA6MDAs",
              "filename": "Refund_8fef22d0-1624-4faa-91fc-efa1dcdfaa25.csv"
            }
          ],
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
      "attachments": [
        {
          "filename": "Refund_8fef22d0-1624-4faa-91fc-efa1dcdfaa25.csv",
          "cid": "Refund_8fef22d0-1624-4faa-91fc-efa1dcdfaa25.csv",
          "encoding": "base64"
        }
      ],
      "subject": "Customer Customer Name - Application (€3,000.00) in process",
      "html":"*<p>Dear Sir or Madame,</p>\n<p>we are happy to inform you that the loan application (€3,000.00) for the customer Customer Name has been provisionally approved. </p><p> Your customer now still needs to verify his identity (via video or post office identification) and perhaps submit additonal documents to our partner bank. As soon as all required information and documents have arrived and our partner bank have given their final approval, we will send you another Email. </p><p> Please do not ship this order before you receive this email or see a coresponding status change in your shop system or payever account, as neither we nor our partner bank will cover your potential losses in case you ship before the final approval. </p><p> </p>\n<p><strong>Ordered at:</strong>\nTest Business</p>\n<p><strong>Customer Name:</strong> Customer Name</p>\n<p>\n<strong>Address:</strong>fullAddress</p>\n<p><strong>E-Mail-Address:</strong>\ntest@test.com</p>\n<p><strong>Santander Application No:</strong>\nSTUB_APPLICATION_NO_1566834978</p>\n\n<p><strong>Cart:</strong>\n1&times;&nbsp;iMac 21.5&quot; 4K 3.6 GHz Quad-Core i3 -  8GB - 1TB HDD // NEU\n, 1&times;&nbsp;Discount\n</p>*"
    }
    """
