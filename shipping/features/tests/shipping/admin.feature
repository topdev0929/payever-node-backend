Feature: shipping admin
  Background:
    Given I remember as "boxId" following value:
      """
      "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622"
      """
    Given I remember as "originId" following value:
      """
      "0acf9a70-db1d-4af9-8be3-4d97d671cf14"
      """
    Given I remember as "zoneId" following value:
      """
      "8bbdb36a-8850-442f-8cb2-a59cd59dfd57"
      """
    Given I remember as "integrationId" following value:
      """
      "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
      """
    Given I remember as "settingId" following value:
      """
      "f59850e6-a027-4338-b9ba-979e07037023"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """

  Scenario: Get shipping box
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/admin/shipping-box"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "isDefault": true,
          "_id": "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }]
      """

  Scenario: Create shipping box
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/admin/shipping-box" with json:
      """
        {
          "isDefault": false,
          "_id": "test",
          "dimensionUnit": "cm",
          "weightUnit": "kg"
        }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "isDefault": false,
          "_id": "test",
          "dimensionUnit": "cm",
          "weightUnit": "kg",
          "createdBy": "admin"
        }
      """

  Scenario: Update shipping box by id
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/admin/shipping-box/{{boxId}}" with json:
      """
        {
          "isDefault": false
        }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Delete shipping box by id
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/admin/shipping-box/{{boxId}}"
    Then print last response
    And the response status code should be 200

  Scenario: Create shipping origin
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/admin/shipping-origin" with json:
      """
        {
          "_id": "test",
          "isDefault": true,
          "streetName": "Street name",
          "streetNumber": "111",
          "city": "city",
          "zipCode": "11111",
          "countryCode": "CO"
        }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "_id": "test",
          "isDefault": true,
          "streetName": "Street name",
          "streetNumber": "111",
          "city": "city",
          "zipCode": "11111",
          "countryCode": "CO",
          "createdBy": "admin"
        }
      """

  Scenario: Get shipping origin
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/admin/shipping-origin"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "_id": "{{originId}}",
          "isDefault": true,
          "streetName": "Street name",
          "streetNumber": "111",
          "city": "city",
          "zipCode": "11111",
          "countryCode": "CO"
        }]
      """

  Scenario: Update shipping origin by id
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/admin/shipping-origin/{{originId}}" with json:
      """
        {
          "isDefault": false
        }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Delete shipping origin by id
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/admin/shipping-origin/{{originId}}"
    Then print last response
    And the response status code should be 200

  Scenario: Create shipping zone
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/admin/shipping-zone" with json:
      """
        {
          "_id": "test",
          "countryCodes": ["CO"],
          "deliveryTimeDays": 10,
          "rates": ["{{integrationId}}"]
        }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "_id": "test",
          "countryCodes": ["CO"],
          "deliveryTimeDays": 10,
          "rates": ["{{integrationId}}"],
          "createdBy": "admin"
        }
      """

  Scenario: Get shipping zones
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/admin/shipping-zone"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "_id": "{{zoneId}}",
          "countryCodes": ["CO"],
          "deliveryTimeDays": 10,
          "rates": ["{{integrationId}}"]
        }]
      """

  Scenario: Update shipping zone by id
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/admin/shipping-zone/{{zoneId}}" with json:
      """
        {
          "deliveryTimeDays": 20
        }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Delete shipping zone by id
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/admin/shipping-zone/{{zoneId}}"
    Then print last response
    And the response status code should be 200

  Scenario: Get shipping setting
    Given I use DB fixture "shipping/shipping"
    When I send a GET request to "/api/admin/shipping-setting"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [
           {
             "boxes": [
               {
                 "createdBy": "admin",
                 "isDefault": true,
                 "_id": "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622",
                 "dimensionUnit": "cm",
                 "weightUnit": "kg",
                 "integration": "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
               }
             ],
             "createdBy": "admin",
             "isDefault": false,
             "origins": [
               {
                 "createdBy": "admin",
                 "isDefault": true,
                 "streetName": "Street name",
                 "streetNumber": "111",
                 "city": "city",
                 "zipCode": "11111",
                 "countryCode": "CO"
               }
             ],
             "products": [],
             "zones": [],
             "_id": "f59850e6-a027-4338-b9ba-979e07037023"
           }
         ]
      """

  Scenario: create shipping setting
    Given I use DB fixture "shipping/shipping"
    When I send a POST request to "/api/admin/shipping-setting" with json:
    """
    {
      "boxes": ["f59850e6-a027-4338-b9ba-979e07037024"],
      "zones": ["f59850e6-a027-4338-b9ba-979e07037026"],
      "origins": ["f59850e6-a027-4338-b9ba-979e07037003"]
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "boxes": "*",
          "_id": "*",
          "zones": "*",
          "origins": "*"
        }
      """

  Scenario: update shipping setting
    Given I use DB fixture "shipping/shipping"
    When I send a PUT request to "/api/admin/shipping-setting/{{settingId}}" with json:
    """
    {
      "boxes": ["f59850e6-a027-4338-b9ba-979e07037024"],
      "zones": ["f59850e6-a027-4338-b9ba-979e07037026"],
      "origins": ["f59850e6-a027-4338-b9ba-979e07037003"]
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "boxes": "*",
          "_id": "{{settingId}}",
          "zones": "*",
          "origins": "*"
        }
      """

  Scenario: delete shipping setting
    Given I use DB fixture "shipping/shipping"
    When I send a DELETE request to "/api/admin/shipping-setting/{{settingId}}"
    Then print last response
    And the response status code should be 200
    Then model "ShippingSetting" with id "{{settingId}}" should not contain json:
      """
      {
        "_id": "{{settingId}}"
      }
      """
