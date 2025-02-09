Feature: File Controller
  Background:
    Given I use DB fixture "mime-type"
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "fileId" following value:
      """
      "b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1"
      """
    Given I remember as "appId" following value:
      """
      "a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1"
      """
    Given I remember as "fileUrl" following value:
      """
      "http://test.com/file.csv"
      """

  Scenario: File uploading
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/file/business/{{businessId}}/message/application/{{appId}}" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "blobName":"*",
      "thumbnailBlobName":"*",
      "mimeType":"*",
      "fileSize":"*"
    }
    """
  Scenario: File uploading with compress file
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/file/business/{{businessId}}/message/application/{{appId}}?compress=true" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "blobName":"*",
      "thumbnailBlobName":"*",
      "compress":true,
      "mimeType":"*",
      "fileSize":"*"
    }
    """
  Scenario: File uploading without thumbnail generator
    Given I use DB fixture "exist-business"
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/file/business/{{businessId}}/message/application/{{appId}}?generateThumbnail=false" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should not contain json:
    """
    {      
      "thumbnailBlobName":"*",
      "mimeType":"*",
      "fileSize":"*"
    }
    """

  Scenario: File uploading via url
    Given I use DB fixture "exist-business"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "head",
          "url": "{{fileUrl}}"
        },
        "response": {
          "status": 200,
          "headers": {
            "content-type": "text/csv",
            "content-length": 9
          } 
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "{{fileUrl}}"
        },
        "response": {
          "status": 200,
          "headers": {
            "content-type": "text/csv",
            "content-length": 9
          },
          "body": "test-data"
        }
      }
      """
    When I send a POST request to "/api/file/business/{{businessId}}/message/application/{{appId}}/via-url" with json:
      """
      {
        "url": "{{fileUrl}}"
      }
      """

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "blobName":"*",
      "thumbnailBlobName":"*",
      "mimeType":"*",
      "fileSize":"*"
    }
    """

  Scenario: Get media items of application
    Given I use DB fixture "exist-business"
    Given I use DB fixture "media-item"
    When I send a GET request to "/api/file/business/{{businessId}}/message/{{appId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [{
      "_id": "10ff2c21-fb3c-420a-a331-e5d51e511fa1",
      "applicationId": "a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1",
      "container": "message",
      "name": "mediaItemName"
    }]
    """

  Scenario: Delete media items of application
    Given I use DB fixture "exist-business"
    Given I use DB fixture "media-item"
    When I send a DELETE request to "/api/file/business/{{businessId}}/message/application/{{appId}}"
    Then print last response
    And the response status code should be 204
