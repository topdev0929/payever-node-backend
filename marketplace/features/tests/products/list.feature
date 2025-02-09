Feature: List products
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I authenticate as a user with the following data:
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

  Scenario: Get product list
    Given I use DB fixture "products/get-product-list"
    When I send a GET request to "/api/business/{{businessId}}/products?page=1&perPage=5"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "perPage": 5,
        "total": 10,
        "list": [
          {
            "id": "00000000-0000-0000-0000-000000000000",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "11111111-1111-1111-1111-111111111111",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "22222222-2222-2222-2222-222222222222",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "33333333-3333-3333-3333-333333333333",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "44444444-4444-4444-4444-444444444444",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          }
        ],
        "page": 1
      }
      """

  Scenario: Get product list, check pagination
    Given I use DB fixture "products/get-product-list"
    When I send a GET request to "/api/business/{{businessId}}/products?page=2&perPage=5"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "perPage": 5,
        "total": 10,
        "list": [
          {
            "id": "55555555-5555-5555-5555-555555555555",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "66666666-6666-6666-6666-666666666666",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "77777777-7777-7777-7777-777777777777",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "88888888-8888-8888-8888-888888888888",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          },
          {
            "id": "99999999-9999-9999-9999-999999999999",
            "business": {
              "id": "{{businessId}}"
            },
            "channelSet": {
              "id": "*"
            }
          }
        ],
        "page": 2
      }
      """
