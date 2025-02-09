Feature: Media stream feature
  Background:
    Background:
    Given I use DB fixture "business"    
    Given I use DB fixture "subscription.media"
    Given I use DB fixture "user.media"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "subscriptionMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "userMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "d74c23df-bfec-4341-b418-e579be0f58b7",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://example.com/free-1.png"
      },
      "response": {
        "status": 200,
        "data":"blob",
        "headers":{
          "content-type":"image/png"
        }
      }
    }
    """
  
  Scenario: Stream subscription media
     When I send a GET request to "/api/{{businessId}}/stream/subscription/{{subscriptionMediaId}}"
     Then print last response
     Then response code should be 200

  Scenario: Stream by user media 
    When I send a GET request to "/api/{{businessId}}/stream/media/{{userMediaId}}"
    Then print last response
    Then response code should be 200
