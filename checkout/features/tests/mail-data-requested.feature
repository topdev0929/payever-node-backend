Feature: mail bus API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """

  Scenario: Updating name and currency of existing business
    Given I use DB fixture "business/business-bus-message/business.removed/existing-business"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "mailer-report.event.report-data.requested",
        "payload": {
          "businessIds": ["{{businessId}}"]
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
      """
      [
          {
             "name": "checkout.event.report-data.prepared",
             "payload": [
               {
                 "business": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
                 "checkoutStat": {
                   "channels": [],
                   "checkout": [
                     {
                       "settings": {
                         "cspAllowedHosts": [],
                         "testingMode": false,
                         "languages": [
                           {
                             "active": false,
                             "isDefault": false,
                             "code": "de",
                             "name": "Deutsch",
                             "_id": "*"
                           },
                           {
                             "active": true,
                             "isDefault": true,
                             "code": "en",
                             "name": "English",
                             "_id": "*"
                           }
                         ],
                         "styles": {
                           "businessHeaderBorderColor": "#ffff",
                           "buttonFill": true,
                           "active": true
                         }
                       },
                       "default": true,
                       "connections": [],
                       "_id": "*",
                       "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
                       "name": "Checkout",
                       "sections": [
                      {
                        "code": "order",
                        "enabled": true,
                        "order": 0,
                        "_id": "*"
                      },
                      {
                        "code": "address",
                        "enabled": true,
                        "order": 1,
                        "_id": "*"
                      },
                      {
                        "code": "choosePayment",
                        "enabled": true,
                        "order": 2,
                        "_id": "*"
                      },
                      {
                        "options": {
                          "skipButton": false
                        },
                        "code": "ocr",
                        "enabled": true,
                        "order": 3,
                        "_id": "*"
                      },
                      {
                        "code": "payment",
                        "enabled": true,
                        "order": 4,
                        "_id": "*"
                      },
                      {
                        "code": "user",
                        "enabled": false,
                        "order": 5,
                        "_id": "*"
                      }
                    ]
                     }
                   ],
                   "paymentOptions": [
                     {
                       "installed": true,
                       "_id": "*",
                       "enabled": false,
                       "business": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
                       "integration": "49fe6119-cd82-43eb-acc9-2e09422feab8"
                     }
                   ]
                 },
                 "posPaymentOptions": [
                   {
                     "icon": "#icon-payment-option-santander",
                     "title": "integrations.payments.santander_installment.title"
                   },
                   {
                     "icon": "#icon-payment-option-santander",
                     "title": "integrations.payments.santander_factoring_de.title"
                   }
                 ]
               }
             ]
           }
      ]
      """
