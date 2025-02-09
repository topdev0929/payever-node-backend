Feature: Storage Controller
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

  Scenario: Image uploading works fine
    Given I attach the file "ussr.png" to "file"

    When I send a POST request to "/api/storage/file" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "url": "*"
    }
    """

  Scenario: Try to upload a file - filetype could not be detected
    Given I attach the file "wrong.txt" to "file"

    When I send a POST request to "/api/storage/file" with form data:
    |||

    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
      "statusCode": 400,
      "message": "Document type is not correct"
    }
    """

  Scenario: Try to upload a file with invalid filetype
    Given I attach the file "wrong.png" to "file"

    When I send a POST request to "/api/storage/file" with form data:
    |||

    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
      "statusCode": 400,
      "message": "Document type is not correct"
    }
    """
