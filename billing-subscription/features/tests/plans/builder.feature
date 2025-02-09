Feature: Get plans list
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId1" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "productId2" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "planId1" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "planId2" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "subscriptionplanId1" following value:
      """
        "dddddddd-1111-1111-1111-111111111111"
      """
    Given I remember as "subscriptionplanId2" following value:
      """
        "dddddddd-2222-2222-2222-222222222222"
      """
    Given I remember as "integrationName" following value:
      """
        "stripe"
      """
    Given I remember as "connectionId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
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
    And I mock Elasticsearch method "count" with:
      """
      {
        "arguments": [
          "subscription-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Received request for getting products plans
    Given I use DB fixture "plans/retrieve-plans-for-products"
    When I send a POST request to "/api/builder/subscription-plans" with json:
      """
      {
        "business": "{{businessId}}",
        "filter": "[]",
        "offset": 0,
        "limit": 1
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [
       {
         "billingPeriod": 1,
         "currency": "EUR",
         "id": "dddddddd-1111-1111-1111-111111111111",
         "interval": "month",
         "name": "Some Subscription Plan Name",
         "planType": "fixed",
         "products": [
           {
             "apps": [],
             "attributes": [],
             "channelSets": [],
             "collections": [],
             "images": [],
             "imagesUrl": [],
             "variantAttributes": [],
             "variants": [],
             "videos": [],
             "videosUrl": [],
             "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
             "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
             "image": "http://some-image-url.com/test.jpg",
             "price": 100,
             "title": "product",
             "categories": [],
             "createdAt": "*",
             "updatedAt": "*",
             "__v": 0,
             "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
           }
         ],
         "totalPrice": 100
       }
     ]
    """

  Scenario: Received request for getting products plans
    Given I use DB fixture "plans/retrieve-plans-for-products"
    When I send a POST request to "/api/builder/folder" with json:
      """
      {
        "business": "{{businessId}}",
        "filter": "[]",
        "offset": 0,
        "limit": 1
      }
      """
    Then print last response
