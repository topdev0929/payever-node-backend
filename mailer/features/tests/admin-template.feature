Feature: Admin template
  Background:
    Given I use DB fixture "mail-server-config"
    Given I use DB fixture "admin-template"
    Given I remember as "templateId1" following value:
      """
      "template-id-1"
      """
    Given I remember as "templateId2" following value:
      """
      "template-id-2"
      """
    Given I remember as "templateId3" following value:
      """
      "template-id-3"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/templates"
    Then response status code should be 403

  Scenario: Get all templates
    When I send a GET request to "/api/admin/templates"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "{{templateId1}}"
          },
          {
            "_id": "{{templateId2}}"
          },
          {
            "_id": "{{templateId3}}"
          }
        ],
        "total": 3
      }
      """

  Scenario: Get template by id
    When I send a GET request to "/api/admin/templates/{{templateId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{templateId1}}",
        "attachments": [],
        "body": "body-1",
        "description": "Default layout en",
        "layout": null,
        "locale": "en",
        "section": "Email Template",
        "subject": "default layout en",
        "template_name": "default_layout_en",
        "template_type": "system",
        "use_layout": false
      }
      """

  Scenario: Get template body by id
    When I send a GET request to "/api/admin/templates/{{templateId1}}/body"
    Then print last response
    And the response status code should be 200
    And the response should be equal to "body-1"

  Scenario: Create new template
    When I send a POST request to "/api/admin/templates" with json:
      """
      {
        "attachments": [],
        "body": "body",
        "description": "description",
        "layout": "layout",
        "locale": "en",
        "section": "Email Template",
        "subject": "new subject",
        "template_name": "new_default_layout_en",
        "template_type": "system",
        "use_layout": true
      }
      """
    Then print last response
    And I store a response as "response"
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "attachments": [],
        "body": "body",
        "description": "description",
        "layout": "layout",
        "locale": "en",
        "section": "Email Template",
        "subject": "new subject",
        "template_name": "new_default_layout_en",
        "template_type": "system",
        "use_layout": true
      }
      """
    When I send a GET request to "/api/admin/templates/{{response._id}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "attachments": [],
        "body": "body",
        "description": "description",
        "layout": "layout",
        "locale": "en",
        "section": "Email Template",
        "subject": "new subject",
        "template_name": "new_default_layout_en",
        "template_type": "system",
        "use_layout": true
      }
      """

  Scenario: Update a template
    When I send a PATCH request to "/api/admin/templates/{{templateId1}}" with json:
      """
      {
        "attachments": [],
        "body": "body-changed",
        "description": "description-changed",
        "layout": "layout-changed",
        "locale": "en-changed",
        "section": "Email Template-changed",
        "subject": "default layout en-changed",
        "template_name": "default_layout_en-changed",
        "template_type": "system-changed",
        "use_layout": false
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{templateId1}}",
        "attachments": [],
        "body": "body-changed",
        "description": "description-changed",
        "layout": "layout-changed",
        "locale": "en-changed",
        "section": "Email Template-changed",
        "subject": "default layout en-changed",
        "template_name": "default_layout_en-changed",
        "template_type": "system-changed",
        "use_layout": false
      }
      """
    When I send a GET request to "/api/admin/templates/{{templateId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{templateId1}}",
        "attachments": [],
        "body": "body-changed",
        "description": "description-changed",
        "layout": "layout-changed",
        "locale": "en-changed",
        "section": "Email Template-changed",
        "subject": "default layout en-changed",
        "template_name": "default_layout_en-changed",
        "template_type": "system-changed",
        "use_layout": false
      }
      """

  Scenario: Delete domain
    When I send a DELETE request to "/api/admin/templates/{{templateId1}}"
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/admin/templates/{{templateId1}}"
    Then print last response
    And the response status code should be 404
