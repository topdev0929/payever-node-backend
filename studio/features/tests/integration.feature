Feature: User media features
  Background:
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "subscriptionMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "attributeId" following value:
      """
        "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d"
      """
    Given I remember as "attributeValue" following value:
      """
        "test1"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Get user subscription media
    Given I use DB fixture "dropbox-attribute"
    Given I use DB fixture "dropbox-subscription.media"
    Given I get file "features/data/es-mock-getSubscriptionMediaForBuilder.response.json" content and remember as "esMock" with placeholders
    And I mock Elasticsearch method "search" with:
      """
      {{esMock}}
      """
    Given I get file "features/data/integration-getSubscriptionMediaForBuilder.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/studio/integration/builder/subscription-media" with json:
    """
    {
      "contextId": "d74c23df-bfec-4341-b418-e579be0f58b7",
      "filter": [
        {
          "fieldCondition": "or",
          "value": [
            {
              "field": "name",
              "fieldCondition": "contains",
              "value": "video"
            },
            {
              "field": "name",
              "fieldCondition": "contains",
              "value": "image"
            }
          ]
        },
        {
          "fieldCondition": "and",
          "value": [
            {
              "field": "size",
              "fieldCondition": "contains",
              "value": "big"
            },
            {
              "field": "name",
              "fieldCondition": "contains",
              "value": "e"
            }
          ]
        }
      ],
      "pagination": {
        "order": [{"field": "name","direction": "desc"}],
        "offset": 0,
        "limit": 1
      }
    }
    """
    Then print last response
    Then the response should contain json:
    """
    {{response}}
    """

  Scenario: Get user subscription media
    Given I use DB fixture "user.media"
    Given I use DB fixture "user.album"
    Given I use DB fixture "attribute"
    Given I use DB fixture "user.attribute"
    Given I use DB fixture "user.attribute.group"
    Given I get file "features/data/integration-getUserMediaForBuilder.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/studio/integration/builder/user-media" with json:
    """
    {
      "businessId": "{{businessId}}",
      "filter": [
        {
          "field": "name",
          "fieldCondition": "contains",
          "value": "image"
        },
        {
          "field": "car",
          "fieldCondition": "contains",
          "value": "ford"
        }
      ],
      "pagination": {
        "order": [
          {
            "field": "name",
            "direction": "asc"
          }
        ],
        "offset": 0,
        "limit": 1
      }
    }
    """
    Then print last response
    Then the response should contain json:
    """
    {{response}}
    """
