Feature: Storage Controller
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "imageId" following value:
      """
      "b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1"
      """

  Scenario: Image uploading works fine
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/image/business/{{businessId}}/builder" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "blobName":"*",
      "brightnessGradation":"*",
      "thumbnail":"*"
    }
    """

  Scenario: Image uploading works fine
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/image/business/{{businessId}}/builder/{{imageId}}" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "blobName":"{{imageId}}",
      "brightnessGradation":"*",
      "thumbnail":"*"
    }
    """

  Scenario: Image uploading works fine on setting
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/image/business/{{businessId}}/setting/images" with form data:
      |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "blobName":"*",
      "brightnessGradation":"*",
      "thumbnail":"*"
    }
    """


  Scenario: Image uploading with skipGradient false
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/image/business/{{businessId}}/cdn/social?skipResize=false&skipGradient=false" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "blobName":"social/*-ussr.png",
        "brightnessGradation": "default",
        "thumbnail": "social/*-ussr.png-thumbnail"  
      }
      """

  Scenario: Image uploading with skipGradient true
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/image/business/{{businessId}}/cdn/social?skipResize=true&skipGradient=true" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "blobName":"social/ussr",
        "brightnessGradation": null,
        "thumbnail": null
      }
      """

  Scenario: Image uploading non allowed on setting
    Given I use DB fixture "exist-business"
    Given I attach the file "example.gif" to "file"
    When I send a POST request to "/api/image/business/{{businessId}}/setting/images" with form data:
      |||

    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
      "message": "Document type is not correct",
      "receivedMimeType": {
        "ext": "gif",
        "mime": "image/gif"
      },
      "statusCode": 400
    }
    """

  Scenario: Try to upload a file - filetype could not be detected
    Given I attach the file "wrong.txt" to "file"

    When I send a POST request to "/api/image/business/{{businessId}}/builder" with form data:
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

    When I send a POST request to "/api/image/business/{{businessId}}/builder" with form data:
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
