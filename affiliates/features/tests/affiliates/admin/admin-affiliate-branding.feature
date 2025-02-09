Feature: Admin affiliate branding
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "affiliateBrandingId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac"
      """
    Given I remember as "affiliateBrandingId2" following value:
      """
        "ssssssss-ssss-ssss-ssss-ssssssssssss"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name":"admin",
            "permissions":[]
          }
        ]
      }
      """

  Scenario: Create new affiliate branding
    Given I use DB fixture "affiliate-branding"
    When I send a POST request to "/api/admin/affiliate-brandings" with json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name",
        "businessId": "{{businessId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "favicon": "favicon",
        "logo": "logo",
        "name": "name",
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "AffiliateBranding" with id "{{response._id}}" should contain json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """

  Scenario: get affiliate branding by id with access config
    Given I use DB fixture "affiliate-branding"
    When I send a GET request to "/api/admin/affiliate-brandings/{{affiliateBrandingId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{affiliateBrandingId}}",
        "accessConfig": {
          "isLive": true
        }
      }
    """

  Scenario: get affiliate brandings
    Given I use DB fixture "affiliate-branding"
    When I send a GET request to "/api/admin/affiliate-brandings?limit=1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "business": "{{businessId}}",
            "favicon": "*",
            "logo": "*",
            "name": "*",
            "_id": "*"
          }
        ]
      }
      """

  Scenario: delete affiliate brandings
    Given I use DB fixture "affiliate-branding"
    When I send a DELETE request to "/api/admin/affiliate-brandings/{{affiliateBrandingId}}"
    Then print last response
    And the response status code should be 200
    And model "AffiliateBranding" with id "{{affiliateBrandingId}}" should not contain json:
      """
      {
        "business": "{{businessId}}"
      }
      """

  Scenario: Update affiliate branding
    Given I use DB fixture "affiliate-branding"
    When I send a PATCH request to "/api/admin/affiliate-brandings/{{affiliateBrandingId}}" with json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "favicon": "favicon",
        "logo": "logo",
        "name": "name",
        "_id": "{{affiliateBrandingId}}"
      }
    """
    And store a response as "response"
    And model "AffiliateBranding" with id "{{affiliateBrandingId}}" should contain json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """

  Scenario: Check branding name with valid value
    Given I use DB fixture "affiliate-branding"
    When I send a GET request to "/api/admin/affiliate-brandings/business/{{businessId}}/isValidName?name=test"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": true
      }
      """

  Scenario: Check branding name with occupied name
    Given I use DB fixture "affiliate-branding"
    And I remember as "occupiedName" following value:
      """
      "Test Branding"
      """
    When I send a GET request to "/api/admin/affiliate-brandings/business/{{businessId}}/isValidName?name={{occupiedName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": false
      }
      """

  Scenario: Try to check name without param
    When I send a GET request to "/api/admin/affiliate-brandings/business/{{businessId}}/isValidName"
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": [
          "name must be a string"
        ]
      }
      """
