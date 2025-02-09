Feature: Appointment Network
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "appointmentBrandingId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac"
      """
    Given I remember as "appointmentBrandingId2" following value:
      """
        "ssssssss-ssss-ssss-ssss-ssssssssssss"
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

  Scenario: Create new appointment network
    Given I use DB fixture "appointment-network"
    When I send a POST request to "/api/business/{{businessId}}/appointment-network" with json:
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
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "AppointmentNetwork" with id "{{response._id}}" should contain json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """

  Scenario: get appointment network by id with access config
    Given I use DB fixture "appointment-network"
    When I send a GET request to "/api/business/{{businessId}}/appointment-network/{{appointmentBrandingId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{appointmentBrandingId}}",
        "accessConfig": {
          "isLive": true
        }
      }
    """

  Scenario: get appointment networks
    Given I use DB fixture "appointment-network"
    When I send a GET request to "/api/business/{{businessId}}/appointment-network"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [{
        "business": "{{businessId}}",
        "favicon": "*",
        "logo": "*",
        "name": "*",
        "_id": "*"
      }]
    """

  Scenario: delete appointment networks
    Given I use DB fixture "appointment-network"
    When I send a DELETE request to "/api/business/{{businessId}}/appointment-network/{{appointmentBrandingId}}"
    Then print last response
    And the response status code should be 200
    And model "AppointmentNetwork" with id "{{appointmentBrandingId}}" should not contain json:
      """
      {
        "business": "{{businessId}}"
      }
      """

  Scenario: Update appointment network
    Given I use DB fixture "appointment-network"
    When I send a PATCH request to "/api/business/{{businessId}}/appointment-network/{{appointmentBrandingId}}" with json:
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
        "_id": "{{appointmentBrandingId}}"
      }
    """
    And store a response as "response"
    And model "AppointmentNetwork" with id "{{appointmentBrandingId}}" should contain json:
      """
      {
        "favicon": "favicon",
        "logo": "logo",
        "name": "name"
      }
      """

  Scenario: Set/get default
    Given I use DB fixture "appointment-network"
    When I send a PATCH request to "/api/business/{{businessId}}/appointment-network/{{appointmentBrandingId}}/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "*",
        "name": "Test Branding",
        "business": "{{businessId}}"
      }
    """

    When I send a GET request to "/api/business/{{businessId}}/appointment-network/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{appointmentBrandingId}}"
      }
      """

  Scenario: Check network name with valid value
    Given I use DB fixture "appointment-network"
    When I send a GET request to "/api/business/{{businessId}}/appointment-network/isValidName?name=test"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": true
      }
      """


  Scenario: Check network name with occupied name
    Given I use DB fixture "appointment-network"
    And I remember as "occupiedName" following value:
      """
      "Test Branding"
      """
    When I send a GET request to "/api/business/{{businessId}}/appointment-network/isValidName?name={{occupiedName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": false
      }
      """
