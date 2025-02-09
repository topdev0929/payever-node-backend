Feature: Create flow by ApiCall with channel subtype
  Background:
    Given I generate a guest token remember it as "guestHash"
    Given I generate an access token using the following data and remember it as "guestToken":
    """
    {
      "guestHash": "{{guestHash}}",
      "roles": [
        {
          "name": "guest",
          "permissions": []
        }
      ],
      "tokenId": "{{tokenId}}"
    }
    """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://auth.devpayever.com/api/guest-token",
        "body": "{\"ipHash\":\"*\"}"
      },
      "response": {
        "status": 200,
        "body": {
          "accessToken": "{{guestToken}}"
        }
      }
    }
    """
    Given I remember as "checkoutId" following value:
      """
      "04206b2a-a318-40e7-b031-32bbbd879c74"
      """
    Given I remember as "channelSetId" following value:
      """
      "006388b0-e536-4d71-b1f1-c21a6f1801e6"
      """
    Given I remember as "apiCallId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    Given I remember as "paymentMethod" following value:
      """
      "santander"
      """
    Given I remember as "orderId" following value:
      """
      "some_order_id"
      """
    Given I use DB fixture "legacy-api/api-call/start-checkout/channel-subtype/channel-in-default-checkout"

  Scenario: Create flow for checkout
    When I send a POST request to "/api/flow/v1/api-call/{{apiCallId}}"
    Then print last response
    And the response status code should be 201
    And response should contain json:
    """
    {
      "id":"*",
      "amount": 1000,
      "currency": "EUR",
      "reference": "some_order_id",
      "total": 1000,
      "cart": [],
      "billingAddress": {},
      "deliveryFee": 0,
      "posMerchantMode": false,
      "forceLegacyCartStep": false,
      "forceLegacyUseInventory": false,
      "extra": {},
      "state": "IN_PROGRESS",
      "apiCall": {
       "id": "{{apiCallId}}",
       "birthDate": null,
       "billingAddress": {},
       "shippingAddress": {
         "email": null,
         "phone": null
       }
      },
      "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
      "businessName": "*",
      "channel": "magento",
      "channelSetId": "{{channelSetId}}",
      "channelSource": "v1.0.2",
      "channelType": "in_store",
      "checkoutId": "{{checkoutId}}",
      "paymentOptions": [],
      "guestToken":"{{guestToken}}"
    }
    """
