@payment-create-email
Feature: Payment channel type email
  Background:
    Given I use DB fixture "legacy-api/payment-create/channel-set-and-channel-email"

  Scenario: Create payment
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
            }
          ]
        }
      ]
    }
    """
    When I send a POST request to "/api/v2/payment" with json:
    """
    {
      "channel": {
        "name": "api",
        "type": "email"
      },
      "amount": 1000,
      "fee": 10,
      "order_id": "sa45s454as399912343211",
      "currency": "EUR",
      "payment_method": "santander_installment",
      "billing_address": {
        "country": "DE",
        "city": "Vøyenenga",
        "zip": "13132",
        "street": "sdfd",
        "first_name": "weew",
        "last_name": "weew"
      },
      "phone": "90212048",
      "email": "sdsd@sdds.eu",
      "customer_redirect_url": "https://payever.de/customer-redirect",
      "success_url": "https://payever.de/success",
      "cancel_url": "https://payever.de/cancel",
      "failure_url": "https://payever.de/failure",
      "cart": [
        {
          "name": "Apple AirPods",
          "sku": "888462858519",
          "price": 1000,
          "priceNetto": 1000.00,
          "vatRate": 0.00,
          "quantity": 1,
          "identifier": "12345",
          "description": "",
          "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
          "url": "https://eplehuset.no/apple-airpods"
        }
      ]
    }
    """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "payever.event.user.email",
          "payload": {
            "locale": "en",
            "subject": "Payment of 1000 to Business*",
            "templateName": "checkout.finalize_payment",
            "to": "sdsd@sdds.eu",
            "variables": {
              "businessName": "Business*",
              "orderId": "*"
            }
          }
        }
      ]
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "new",
        "type": "create",
        "id": "*",
        "created_at": "*",
        "payment_method": "santander_installment",
        "channel": "api",
        "channel_type": "email",
        "amount": 1000,
        "fee": 10,
        "cart": [
          {
            "name": "Apple AirPods",
            "sku": "888462858519",
            "price": 1000,
            "price_netto": 1000,
            "vat_rate": 0,
            "quantity": 1,
            "identifier": "12345",
            "description": "",
            "thumbnail": "https://eplehuset.no/static/version1524729916/webapi_rest/_view/nb_NO/Magento_Catalog/images/product/placeholder/.jpg",
            "url": "https://eplehuset.no/apple-airpods"
          }
        ],
        "order_id": "sa45s454as399912343211",
        "currency": "EUR",
        "first_name": "weew",
        "last_name": "weew",
        "street": "sdfd",
        "zip": "13132",
        "country": "DE",
        "city": "Vøyenenga",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "success_url": "https://payever.de/success",
        "failure_url": "https://payever.de/failure",
        "cancel_url": "https://payever.de/cancel",
        "customer_redirect_url": "https://payever.de/customer-redirect",
        "skip_handle_payment_fee": true,
        "api_version": "v2"
      }
    }
    """
    And the response should not contain json:
    """
    {
      "redirect_url": "https://checkout-wrapper-frontend.devpayever.com/pay/api-call/*?channelSetId=006388b0-e536-4d71-b1f1-c21a6f1801e6"
    }
    """
