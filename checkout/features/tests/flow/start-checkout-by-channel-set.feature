Feature: Start checkout by ChannelSet
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
  Scenario: Start checkout by channel set
    Given I remember as "checkoutId" following value:
      """
      "04206b2a-a318-40e7-b031-32bbbd879c74"
      """
    Given I remember as "channelSetId" following value:
      """
      "006388b0-e536-4d71-b1f1-c21a6f1801e6"
      """
    Given I remember as "paymentMethod" following value:
      """
      "santander_installment_de"
      """
    Given I remember as "orderId" following value:
      """
      "some_order_id"
      """
    Given I remember as "payeverSession" following value:
      """
      "session_value"
      """
    Given I use DB fixture "flow/start-checkout/exists-channel-set"
    When I send a GET request to "/api/flow/channel-set/{{channelSetId}}"
    Then print last response
    And the response status code should be 302
    And the response header "location" should have value "*/pay/*?guest_token={{guestToken}}"
