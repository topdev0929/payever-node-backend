@widgets-list
Feature: Widgets list
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "checkoutId" following value:
      """
        "2d873385-5c32-479c-a830-26de40bd4fd1"
      """
    And I use DB fixture "channel"

  Scenario: Get widgets list
    Given I use DB fixture "widgets-list"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/widgets"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [
          {
            "_id": "11111111-1111-1111-1111-111111111111"
          },
          {
            "_id": "22222222-2222-2222-2222-222222222222"
          },
          {
            "_id": "44444444-4444-4444-4444-444444444444"
          }
        ]
      """
    And the response should not contain json:
      """
        [
          {
            "business": "{{anotherBusinessId}}"
          }
        ]
      """

  Scenario: Get widget list by type
    Given I use DB fixture "widgets-list"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/widgets/type/dropdownCalculator"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "55555555-5555-5555-5555-555555555555",
          "amountLimits": {
            "min": 100,
            "max": 1000
          },
          "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          "channelSet": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          "checkoutId": "2d873385-5c32-479c-a830-26de40bd4fd1",
          "checkoutMode": "calculator",
          "checkoutPlacement": "rightSidebar",
          "isVisible": true,
          "maxWidth": 1000,
          "minWidth": 100,
          "payments": [
           {
             "amountLimits": {
               "max": 2000,
               "min": 10
             },
             "paymentMethod": "santander_installment",
             "isBNPL": false
           }
          ],
          "ratesOrder": "asc",
          "type": "dropdownCalculator"
        }
      ]
      """

  Scenario: Get widget by id
    Given I use DB fixture "widgets-list"
    When I send a GET request to "/api/business/{{businessId}}/widgets/55555555-5555-5555-5555-555555555555"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "55555555-5555-5555-5555-555555555555",
        "amountLimits": {
          "min": 100,
          "max": 1000
        },
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "channelSet": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "checkoutId": "2d873385-5c32-479c-a830-26de40bd4fd1",
        "checkoutMode": "calculator",
        "checkoutPlacement": "rightSidebar",
        "isVisible": true,
        "maxWidth": 1000,
        "minWidth": 100,
        "payments": [
         {
           "amountLimits": {
             "max": 2000,
             "min": 10
           },
           "paymentMethod": "santander_installment",
           "isBNPL": false
         }
        ],
        "ratesOrder": "asc",
        "type": "dropdownCalculator",
        "noticeUrl": "notice_url"
      }
      """
