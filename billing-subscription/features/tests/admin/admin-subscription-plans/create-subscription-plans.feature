Feature: Admin create subscription plans
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "categoryId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {"name":"admin","permissions":[]},
          {"name": "merchant","permissions": []}
        ]
      }
      """

    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "subscription-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "subscription-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Create subscription for all products and subscribers by default
    Given I use DB fixture "subscription-plans/create-subscription-plan"
    When I send a POST request to "/api/admin/subscription-plans" with json:
      """
      {
        "businessId":"{{businessId}}",
        "name": "Some subscription plan",
        "interval": "month",
        "billingPeriod": 1
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {         
         "billingPeriod": 1,
         "interval": "month",
         "name": "Some subscription plan",
         "appliesTo": "ALL_PRODUCTS",
         "subscribersEligibility": "EVERYONE"
      }
    """

  Scenario: Create subscription for specific products
    Given I use DB fixture "subscription-plans/create-subscription-plan"
    When I send a POST request to "/api/admin/subscription-plans" with json:
      """
      {
        "businessId":"{{businessId}}",
        "name": "Some subscription plan",
        "interval": "month",
        "billingPeriod": 1,
        "appliesTo": "SPECIFIC_PRODUCTS",
        "products": [
          {
            "_id": "{{productId}}",
            "image": "someImageUrl",
            "price": 123,
            "title": "some title"
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "billingPeriod": 1,
        "interval": "month",
        "name": "Some subscription plan",
        "appliesTo": "SPECIFIC_PRODUCTS",
        "products": [{ "_id": "{{productId}}" }]
      }
    """
    Then I look for model "Product" by following JSON and remember as "savedProduct":
      """
      {
        "_id": "{{productId}}"
      }
      """
    And stored value "savedProduct" should contain json:
      """
      {
        "_id": "{{productId}}",
        "image": "someImageUrl",
        "price": 123,
        "title": "some title"
      }
      """

  Scenario: Create subscription for specific categories
    Given I use DB fixture "subscription-plans/create-subscription-plan"
    When I send a POST request to "/api/admin/subscription-plans" with json:
      """
      {
        "businessId":"{{businessId}}",
        "name": "Some subscription plan",
        "interval": "month",
        "billingPeriod": 1,
        "appliesTo": "SPECIFIC_CATEGORIES",
        "categories": [
          {
            "_id": "{{categoryId}}",
            "businessId": "{{businessId}}",
            "slug": "123",
            "title": "some title"
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "billingPeriod": 1,
        "interval": "month",
        "name": "Some subscription plan",
        "appliesTo": "SPECIFIC_CATEGORIES",
        "categories": ["{{categoryId}}"]
      }
    """
    Then I look for model "Category" by following JSON and remember as "savedCategory":
      """
      {
        "_id": "{{categoryId}}"
      }
      """
    And stored value "savedCategory" should contain json:
      """
      {
        "_id": "{{categoryId}}",
        "businessId": "{{businessId}}",
        "slug": "123",
        "title": "some title"
      }
      """

  Scenario: Should thorw error when creating with wrong interval
    Given I use DB fixture "subscription-plans/create-subscription-plan"
    When I send a POST request to "/api/admin/subscription-plans" with json:
      """
      {
        "businessId":"{{businessId}}",
        "name": "Some subscription plan",
        "interval": "WEEK",
        "billingPeriod": 1,
        "products": ["{{productId}}"]
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
      {
        "message": [
          {
            "constraints": {
              "isEnum": "interval must be a valid enum value"
            }
          }
        ]
      }
    """

  Scenario: Create subscription for specific subscribers
    Given I use DB fixture "subscription-plans/create-subscription-plan"
    When I send a POST request to "/api/admin/subscription-plans" with json:
      """
      {
        "businessId":"{{businessId}}",
        "name": "Some subscription plan",
        "interval": "month",
        "billingPeriod": 1,
        "subscribersEligibility": "SPECIFIC_SUBSCRIBERS",
        "subscribers": [{
          "_id": "test-1",
          "name": "test",
          "image": "image",
          "email": "test@gmail.com",
          "companyName": "company",
          "city": "city",
          "country": "country"
        }]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "billingPeriod": 1,
        "interval": "month",
        "name": "Some subscription plan",
        "subscribersEligibility": "SPECIFIC_SUBSCRIBERS",
        "subscribers": [{ "_id": "test-1" }]
      }
    """
    Then I look for model "PlanCustomer" by following JSON and remember as "savedPlanCustomer":
      """
      {
        "_id": "test-1"
      }
      """
    And stored value "savedPlanCustomer" should contain json:
      """
      {
        "_id": "test-1",
        "name": "test",
        "image": "image"
      }
      """

  Scenario: Create subscription for specific subscribers groups
    Given I use DB fixture "subscription-plans/create-subscription-plan"
    When I send a POST request to "/api/admin/subscription-plans" with json:
      """
      {
        "businessId":"{{businessId}}",
        "name": "Some subscription plan",
        "interval": "month",
        "billingPeriod": 1,
        "subscribersEligibility": "SPECIFIC_GROUPS_OF_SUBSCRIBERS",
        "subscribersGroups": [{
          "_id": "test-1",
          "name": "test",
          "subscribers": ["test1", "test2"]
        }]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "billingPeriod": 1,
        "interval": "month",
        "name": "Some subscription plan",
        "subscribersEligibility": "SPECIFIC_GROUPS_OF_SUBSCRIBERS",
        "subscribersGroups": ["test-1"]
      }
    """
    Then I look for model "SubscribersGroup" by following JSON and remember as "savedSubscribersGroup":
      """
      {
        "_id": "test-1"
      }
      """
    And stored value "savedSubscribersGroup" should contain json:
      """
      {
        "_id": "test-1",
        "name": "test",
        "subscribers": ["test1", "test2"]
      }
      """