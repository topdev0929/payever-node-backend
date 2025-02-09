Feature: Contents
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "contentId1" following value:
      """
      "1d78b846-09d7-4e8b-b57b-2836fb6cd362"
      """
    Given I remember as "contentId2" following value:
      """
      "984742e6-e584-4ad5-af0b-395fb55eb92e"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_CONTACT_2}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I use DB fixture "business"

  Scenario: Find all content
    Given I use DB fixture "contents"
    When I send a GET request to "/api/business/{{businessId}}/contents"
    And the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "1d78b846-09d7-4e8b-b57b-2836fb6cd362",
        "businessId": null,
        "icon": "#sample-icon",
        "name": "Shop/Add",
        "url": "https://payever.com/shop/add"
      }, {
        "_id": "984742e6-e584-4ad5-af0b-395fb55eb92e",
        "businessId": "{{businessId}}",
        "icon": "#sample-icon",
        "name": "Shop/Edit",
        "url": "https://payever.com/shop/edit"
      }]
      """

  Scenario: Create content
    Given I use DB fixture "contents"
    When I send a POST request to "/api/business/{{businessId}}/contents" with json:
      """
      {
        "business": "{{businessId}}",
        "name": "Shop/Delete",
        "url": "https://payever.com/shop/delete"
      }
      """
    Then print last response
    Then response status code should be 201
    And I store a response as "response"
    And the response should contain json:
    """
    {
      "_id": "*",
      "businessId": "{{businessId}}",
      "name": "Shop/Delete",
      "url": "https://payever.com/shop/delete"
    }
    """

    Scenario: Update content
      Given I use DB fixture "contents"
      When I send a PATCH request to "/api/business/{{businessId}}/contents/{{contentId2}}" with json:
        """
        {
          "name": "Shop/Delete"
        }
        """
      Then print last response
      Then response status code should be 200
      And I store a response as "response"
      And the response should contain json:
      """
      {
        "_id": "{{contentId2}}",
        "businessId": "{{businessId}}",
        "name": "Shop/Delete",
        "url": "https://payever.com/shop/edit"
      }
      """

    Scenario: Delete bot message
      Given I use DB fixture "contents"
      When I send a DELETE request to "/api/business/{{businessId}}/contents/{{contentId2}}"
      Then print last response
      Then response status code should be 200
