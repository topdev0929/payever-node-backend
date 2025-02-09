Feature: File Controller, sanitize xss codes
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

  Scenario: File uploading
    Given I use DB fixture "exist-business"
    Given I attach the file "sample-xss.svg.txt" to "file"
    When I send a POST request to "/api/file/business/{{businessId}}/message/application/{{appId}}" with form data:
    |||

    Then print last response
    And I get "blobName" from response and remember as "blob"
    Then print storage key "blob"
    Then I read blob with id "{{blob}}" as string and remember as "uploaded-content"
    And the response status code should be 201
    And stored value "uploaded-content" should be equal to:
    """
    <svg><g></g></svg>
    """


