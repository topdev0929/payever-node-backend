Feature: Terminal management
  Background:
    Given I remember as "businessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """
    Given I remember as "terminalId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527305"
      """
    Given I remember as "terminalConfigId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527308"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": [
                  {
                    "microservice": "pos",
                    "create": true
                  },
                  {
                    "microservice": "pos",
                    "update": true
                  },
                  {
                    "microservice": "pos",
                    "delete": true
                  }
                ]
              }
            ]
          }
        ]
      }
      """

  Scenario: update Access Config of terminal
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    When I send a PATCH request to "/api/business/{{businessId}}/terminal/access/{{terminalId}}" with json:
    """
    {
      "internalDomain": "newdomain",
      "internalDomainPattern": "newpattern",
      "isLive": false,
      "isLocked": true
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "internalDomain": "newdomain",
        "internalDomainPattern": "newpattern",
        "isLive": false,
        "isLocked": true,
        "_id": "{{terminalConfigId}}"
      }
      """
