Feature: Business
  Scenario: Create business
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "employee-folder",
          []
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "userAccount": {
              "firstName": "firstname",
              "lastName": "lastname",
              "email": "email@test.com"
            }
          }
         ],
        "result": {}
      }
      """
    And I mock RPC request "users.rpc.business.created" to "users.rpc.business.created" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    Given I use DB fixture "countries"
    Given I authenticate as a user with the following data:
    """
    {
      "roles": [{
        "name": "user",
        "permissions": []
      }]
    }
    """
    When I send a POST request to "/business" with json:
    """
    {
      "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
      "email": "email@test.com",
      "firstName": "firstname",
      "lastName": "lastname",
      "name": "test business",
      "logo": "logo",
      "wallpaper": "wp",
      "active": true,
      "hidden": false,
      "currencyFormat": "DECIMAL_WITH_POINT",
      "companyAddress": {
        "country": "RU",
        "city": "Moscow",
        "street": "Some street",
        "zipCode": "123456"
      },
      "companyDetails": {
        "legalForm": "Legal Form",
        "phone": "999-8888-7777",
        "product": "Some Product",
        "industry": "Some Industry",
        "employeesRange": {
          "min": 100,
          "max": 200
        },
        "salesRange": {
          "min": 50,
          "max": 100
        },
        "status": "BUSINESS_STATUS_JUST_LOOKING"
      },
      "contactDetails": {
        "salutation": "test",
        "firstName": "test",
        "lastName": "test",
        "phone": "+12315135135",
        "fax": "+12315135135",
        "additionalPhone": "+12315135135"
      },
      "bankAccount": {
        "country": "DE",
        "city": "Hamburg",
        "bankName": "Some Bank",
        "bankCode": "SB",
        "swift": "test",
        "routingNumber": "1234",
        "accountNumber": "1234",
        "owner": "test",
        "bic": "bic",
        "iban": "test"
      },
      "taxes": {
        "companyRegisterNumber": "123",
        "taxId": "123",
        "taxNumber": "123",
        "turnoverTaxAct": false
      },
      "documents": {
        "commercialRegisterExcerptFilename": "test"
      },
      "contactEmails": [
        "test1@email.com"
      ],
      "cspAllowedHosts": [
        "host1"
      ]
    }
    """
    Then print last response
    Then I look for model "User" by following JSON and remember as "savedUser":
      """
      {
        "businesses": ["71bc1780-1a92-47ec-837a-69d68be8c014"]
      }
      """
    And stored value "savedUser" should contain json:
      """
      {
        "_id": "*",
        "businesses": ["71bc1780-1a92-47ec-837a-69d68be8c014"],
        "userAccount": {
          "email": "email@test.com",
          "firstName": "firstname",
          "language": "en",
          "lastName": "lastname",
          "_id": "*",
          "shippingAddresses": [],
          "hasUnfinishedBusinessRegistration": false
        }
      }
      """
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "_id": "71bc1780-1a92-47ec-837a-69d68be8c014",
      "name": "test business",
      "logo": "logo",
      "currency": "USD",
      "currencyFormat": "DECIMAL_WITH_POINT",
      "active": true,
      "hidden": false,
      "businessDetail": {
        "companyAddress": {
          "country": "RU",
          "city": "Moscow",
          "street": "Some street",
          "zipCode": "123456"
        },
        "companyDetails": {
          "legalForm": "Legal Form",
          "phone": "999-8888-7777",
          "product": "Some Product",
          "industry": "Some Industry",
          "employeesRange": {
            "min": 100,
            "max": 200
          },
          "salesRange": {
            "min": 50,
            "max": 100
          },
          "status": "BUSINESS_STATUS_JUST_LOOKING"
        },
        "contactDetails": {
          "salutation": "test",
          "firstName": "firstname",
          "lastName": "lastname",
          "phone": "+12315135135",
          "fax": "+12315135135",
          "additionalPhone": "+12315135135"
        },
        "bankAccount": {
          "country": "DE",
          "city": "Hamburg",
          "bankName": "Some Bank",
          "bankCode": "SB",
          "swift": "test",
          "routingNumber": "1234",
          "accountNumber": "1234",
          "owner": "test",
          "bic": "bic",
          "iban": "test"
        }
      },
      "taxes": {
        "companyRegisterNumber": "123",
        "taxId": "123",
        "taxNumber": "123",
        "turnoverTaxAct": false
      },
      "documents": {
        "commercialRegisterExcerptFilename": "test"
      },
      "contactEmails": [
        "test1@email.com"
      ],
      "cspAllowedHosts": [
        "host1"
      ]
    }
    """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.user.created",
        "payload": {
          "businesses": [],
          "_id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
          "userAccount": {
            "_id": "*",
            "email": "email@test.com",
            "firstName": "firstname",
            "lastName": "lastname",
            "shippingAddresses": []
          }
        }
      },
      {
        "name": "media.event.media.assigned",
        "payload": {
          "filename": "logo",
          "container": "images",
          "relatedEntity": {
            "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
            "type": "BusinessModel"
          }
        }
      },
      {
        "name": "media.event.media.assigned",
        "payload": {
          "filename": "test",
          "container": "miscellaneous",
          "relatedEntity": {
            "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
            "type": "BusinessModel"
          }
        }
      },
      {
        "name": "media.event.media.assigned",
        "payload": {
          "filename": "logo-thumbnail",
          "container": "images",
          "relatedEntity": {
            "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
            "type": "BusinessModel"
          }
        }
      },
      {
        "name": "media.event.media.assigned",
        "payload": {
          "filename": "test-thumbnail",
          "container": "miscellaneous",
          "relatedEntity": {
            "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
            "type": "BusinessModel"
          }
        }
      },
      {
        "name": "media.event.media.assigned",
        "payload": {
          "filename": "logo-blurred",
          "container": "images",
          "relatedEntity": {
            "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
            "type": "BusinessModel"
          }
        }
      },
      {
        "name": "media.event.media.assigned",
        "payload": {
          "filename": "test-blurred",
          "container": "miscellaneous",
          "relatedEntity": {
            "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
            "type": "BusinessModel"
          }
        }
      },
      {
        "name": "users.event.business.created",
        "payload": {
          "userAccountId": "08a3fac8-43ef-4998-99aa-cabc97a39261",
          "active": true,
          "hidden": false,
          "contactEmails": [
            "test1@email.com"
          ],
          "cspAllowedHosts": [
            "host1"
          ],
          "name": "test business",
          "logo": "logo",
          "companyAddress": {
            "country": "RU",
            "city": "Moscow",
            "street": "Some street",
            "zipCode": "123456",
            "_id": "*",
            "createdAt": "*",
            "updatedAt": "*"
          },
          "companyDetails": {
            "legalForm": "Legal Form",
            "phone": "999-8888-7777",
            "product": "Some Product",
            "industry": "Some Industry",
            "employeesRange": {
              "min": 100,
              "max": 200,
              "_id": "*"
            },
            "salesRange": {
              "min": 50,
              "max": 100,
              "_id": "*"
            },
            "status": "BUSINESS_STATUS_JUST_LOOKING"
          },
          "contactDetails": {
            "salutation": "test",
            "firstName": "firstname",
            "lastName": "lastname",
            "phone": "+12315135135",
            "fax": "+12315135135",
            "additionalPhone": "+12315135135"
          },
          "bankAccount": {
            "country": "DE",
            "city": "Hamburg",
            "bankName": "Some Bank",
            "bankCode": "SB",
            "swift": "test",
            "routingNumber": "1234",
            "accountNumber": "1234",
            "owner": "test",
            "bic": "bic",
            "iban": "test"
          },
          "taxes": {
            "companyRegisterNumber": "123",
            "taxId": "123",
            "taxNumber": "123",
            "turnoverTaxAct": false
          },
          "documents": {
            "commercialRegisterExcerptFilename": "test"
          },
          "_id": "*",
          "owner": "08a3fac8-43ef-4998-99aa-cabc97a39261",
          "currency": "USD",
          "currencyFormat": "DECIMAL_WITH_POINT",
          "createdAt": "*",
          "updatedAt": "*"
        }
      }
    ]
    """
    Then I look for model "BusinessActive" by following JSON and remember as "activeBusiness":
    """
    {
      "owner": "08a3fac8-43ef-4998-99aa-cabc97a39261"
    }
    """
    And stored value "activeBusiness" should contain json:
    """
    {
      "_id": "*",
      "owner": "08a3fac8-43ef-4998-99aa-cabc97a39261",
      "businessId": "71bc1780-1a92-47ec-837a-69d68be8c014"
    }
    """

  Scenario: Create business if user already exists
    Given I use DB fixture "users"
    Given I use DB fixture "countries"
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "employee-folder",
          []
         ],
        "result": {}
      }
      """
    And I mock RPC request "users.rpc.business.created" to "users.rpc.business.created" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
      "roles": [{ "name": "user", "permissions": []}]
    }
    """
    When I send a POST request to "/business" with json:
    """
    {
      "id": "71bc1780-1a92-47ec-837a-69d68be8c014",
      "name": "test business",
      "companyAddress": {
        "country": "RU",
        "city": "Moscow",
        "street": "Some street",
        "zipCode": "123456"
      },
      "companyDetails": {
        "legalForm": "Legal Form",
        "phone": "999-8888-7777",
        "product": "Some Product",
        "industry": "Some Industry",
        "employeesRange": {
          "min": 100,
          "max": 200
        },
        "salesRange": {
          "min": 50,
          "max": 100
        },
        "status": "BUSINESS_STATUS_GROWING_BUSINESS"
      }
    }
    """
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "_id": "71bc1780-1a92-47ec-837a-69d68be8c014",
      "owner": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
      "name": "test business",
      "businessDetail": {
        "companyAddress": {
          "country": "RU",
          "city": "Moscow",
          "street": "Some street",
          "zipCode": "123456"
        },
        "companyDetails": {
          "legalForm": "Legal Form",
          "phone": "999-8888-7777",
          "product": "Some Product",
          "industry": "Some Industry",
          "employeesRange": {
            "min": 100,
            "max": 200
          },
          "salesRange": {
            "min": 50,
            "max": 100
          },
          "status": "BUSINESS_STATUS_GROWING_BUSINESS"
        }
      }
    }
    """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "71bc1780-1a92-47ec-837a-69d68be8c014"
        }
      }
    ]
    """
    And model "User" with id "8a13bd00-90f1-11e9-9f67-7200004fe4c0" should contain json:
      """
      {
        "userAccount": {
          "hasUnfinishedBusinessRegistration": false
        }
      }
      """

  Scenario: check business default theme
    Given I use DB fixture "businesses"
    And I use DB fixture "users"
    And I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "merchant", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0"
    Then print last response
    Then response status code should be 200
    Then the response should contain json:
    """
      {
        "themeSettings": {
          "theme": "dark",
          "auto": false
        }
      }
    """
    

  Scenario: update business
    Given I use DB fixture "businesses"
    And I use DB fixture "users"
    And I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "merchant", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a PATCH request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0" with json:
    """
      {
        "name": "New name"
      }
    """
    Then print last response
    Then response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0"
        }
      }
    ]
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0"
    Then print last response
    Then response should contain json:
    """
    {
      "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
      "name": "New name"
    }
    """

  Scenario: update business theme
    Given I use DB fixture "businesses"
    And I use DB fixture "users"
    And I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "merchant", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a PATCH request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0" with json:
    """
      {
        "themeSettings": {
            "theme": "light",
            "auto": false
        },
        "currentWallpaper": {
            "auto": false
        }
      }
      """
    Then print last response
    Then response status code should be 200
    And response should contain json:
      """
      {
        "themeSettings": {
            "theme": "light",
            "auto": false
        },
        "currentWallpaper": {
            "auto": false
        }
      }
      """

  Scenario: update business theme to dark
    Given I use DB fixture "businesses"
    And I use DB fixture "users"
    And I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "merchant", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a PATCH request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0" with json:
    """
      {
        "themeSettings": {
            "theme": "dark",
            "auto": false
        },
        "currentWallpaper": {
            "auto": false
        }
      }
      """
    Then print last response
    Then response status code should be 200
    And response should contain json:
      """
      {
        "themeSettings": {
            "theme": "dark",
            "auto": false
        },
        "currentWallpaper": {
            "auto": false
        }
      }
      """

  Scenario: try to update business without permission
    Given I use DB fixture "businesses"
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "merchant", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a PATCH request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455" with json:
    """
      {
        "name": "New name"
      }
    """
    Then print last response
    Then response status code should be 403
  
  Scenario: try to update business with empty name
    Given I use DB fixture "businesses"
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "merchant", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a PATCH request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0" with json:
    """
      {
        "name": ""
      }
    """
    Then print last response
    Then response status code should be 400
    Then response should contain json:
    """
      {
        "errors": [
            {
                "target": {
                    "name": ""
                },
                "value": "",
                "property": "name",
                "children": [],
                "constraints": {
                    "isNotEmpty": "‘Business name’ field can`t be left empty."
                }
            }
        ],
        "message": "Validation failed",
        "statusCode": 400
      }
    """

  Scenario: Try to update a business with a non-unique business name
    Given I use DB fixture "businesses"
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
    """
    And I remember as "occupiedName" following value:
    """
      "test business 2"
    """
    When I send a PATCH request to "/business/fa8b1d32-8d5c-4839-9ea6-4af777098465" with json:
    """
      {
        "name": "{{occupiedName}}"
      }
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
      {
        "errors": [
          {
            "children": [],
            "constraints": {
              "unique": "forms.error.validator.name.not_unique"
            },
            "property": "name",
            "value": "test business 2"
          },
          {
            "children": [],
            "constraints": {
              "unique": "forms.error.validator.owner.not_unique"
            },
            "property": "owner"
          }
        ],
        "message": "Validation failed",
        "statusCode": 400
      }
    """

  Scenario: try to update business when user role is not merchant
    Given I use DB fixture "businesses"
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "user", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a PATCH request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0" with json:
    """
      {
        "name": "New name"
      }
    """
    Then print last response
    Then response status code should be 403

  Scenario: get businesses list for user
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "user", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a GET request to "/business"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "businesses": [
        {
          "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
          "logo": "logo",
          "name": "test business"
        }
      ],
      "total": 1
    }
    """

  Scenario: get businesses list for admin
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "admin", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}]
      }
    """
    When I send a GET request to "/business?admin=true&projection='_id'"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "businesses": [
        {
          "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
          "userId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
          "email": "email@test.com"
        },
        {
          "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455",
          "userId": "85547e38-dfe5-4282-b1ae-c5542267f39e",
          "email": "email@test.com"
        },
        {
          "_id": "fa8b1d32-8d5c-4839-9ea6-4af777098465",
          "userId": "85547e38-dfe5-4282-b1ae-c5542267f39e",
          "email": "email@test.com"
        }
      ],
      "total": 3
    }
    """

  Scenario: get businesses list for admin
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{ "name": "admin", "permissions": []}]
      }
    """
    When I send a GET request to "/business?admin=true&userIds=85547e38-dfe5-4282-b1ae-c5542267f39e"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "businesses": [
        {
          "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
        },
        {
          "_id": "fa8b1d32-8d5c-4839-9ea6-4af777098465"
        }
      ],
      "total": 2
    }
    """

  Scenario: get businesses info
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I use DB fixture "countries"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [
          {
            "name": "user",
            "permissions": []
          },
          { "name": "merchant", "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]}
        ]
      }
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
      {
        "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
        "name": "test business"
      }
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/detail"
    Then print last response
    And response should contain json:
    """
    {
      "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
      "companyAddress": {
        "country": "RU",
        "city": "Moscow",
        "street": "Some street",
        "zipCode": "123456"
      },
      "companyDetails": {
        "legalForm": "Legal Form",
        "phone": "999-8888-7777",
        "product": "Some Product",
        "industry": "Some Industry",
        "employeesRange": {
          "min": 100,
          "max": 200
        },
        "salesRange": {
          "min": 50,
          "max": 100
        },
        "status": "BUSINESS_STATUS_JUST_LOOKING"
      }
    }
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/documents"
    Then print last response
    And response should contain json:
    """
    {
      "_id": "*",
      "commercialRegisterExcerptFilename": "test",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/taxes"
    Then print last response
    And response should contain json:
    """
    {
      "_id": "*",
      "companyRegisterNumber": "123",
      "taxId": "123",
      "taxNumber": "123",
      "turnoverTaxAct": false,
      "createdAt": "*",
      "updatedAt": "*"
    }
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/theme"
    Then print last response
    And response should contain json:
    """
    {
      "theme": "dark",
      "_id": "*",
      "primaryColor": "test",
      "primaryTransparency": "test",
      "secondaryColor": "test",
      "secondaryTransparency": "test",
      "createdAt": "*",
      "updatedAt": "*"    }
    """
    When I send a GET request to "/business/88038e2a-90f9-11e9-a492-7200004fe4c0/info"
    Then print last response
    And response should contain json:
    """
    {
      "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
      "name": "test business",
      "themeSettings": {
        "theme": "dark",
        "_id": "*",
        "primaryColor": "test",
        "primaryTransparency": "test",
        "secondaryColor": "test",
        "secondaryTransparency": "test",
        "auto": false
      }
    }
    """

  Scenario: enable business
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
    """
    When I send a PATCH request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455/enable"
    Then print last response
    Then response status code should be 200
    When I send a GET request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
      {
        "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455",
        "active": true
      }
    """
    When I send a GET request to "/business/fa8b1d32-8d5c-4839-9ea6-4af777098465"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
      {
        "_id": "fa8b1d32-8d5c-4839-9ea6-4af777098465",
        "active": false
      }
    """

  Scenario: setup business -- onboarding
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
    """
    Given I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.business",
        "payload": {
          "userToken": {
            "id": "85547e38-dfe5-4282-b1ae-c5542267f39e"
          },
          "createBusinessDto": {
            "businessId":"6502b371-4cda-4f1d-af9c-f9c5c886c455"
          },
          "createUserDto": {}
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    When I send a GET request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
      {
        "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
      }
    """

  Scenario: enable business
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
    """
    Given I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "users.event.business.enabled",
        "payload": {
          "businessId":"6502b371-4cda-4f1d-af9c-f9c5c886c455",
          "userToken": {
            "id": "85547e38-dfe5-4282-b1ae-c5542267f39e"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    When I send a GET request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
      {
        "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455",
        "active": true
      }
    """
    When I send a GET request to "/business/fa8b1d32-8d5c-4839-9ea6-4af777098465"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
      {
        "_id": "fa8b1d32-8d5c-4839-9ea6-4af777098465",
        "active": false
      }
    """

  Scenario: delete business
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
    """
    When I send a DELETE request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then the response status code should be 200

    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
        }
      }
    ]
    """

    When I send a GET request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then print last response
    Then the response status code should be 404

  Scenario: Delete someone else's business
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}
          ]
        }]
      }
    """
    When I send a DELETE request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455"
    Then the response status code should be 403

  Scenario: Create business and add the traffic source
    Given I use DB fixture "countries"
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "employee-folder",
          []
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "_id": "*"
          }
         ],
        "result": {}
      }
      """
    And I mock RPC request "users.rpc.business.created" to "users.rpc.business.created" with:
      """
      {
        "requestPayload": { },
        "responsePayload": true
      }
      """
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "firstName": "firstname",
      "lastName": "lastname",
      "roles": [{
        "name": "user",
        "permissions": []
      }]
    }
    """
    When I send a POST request to "/business" with json:
    """
    {
      "id": "71bc1780-1a92-47ec-837a-69d68be8c016",
      "name": "test business with traffic source",
      "companyAddress": {
        "country": "RU",
        "city": "Moscow",
        "street": "Some street",
        "zipCode": "123456"
      },
      "companyDetails": {
        "legalForm": "Legal Form",
        "phone": "999-8888-7777",
        "product": "Some Product",
        "industry": "Some Industry",
        "employeesRange": {
          "min": 100,
          "max": 200
        },
        "salesRange": {
          "min": 50,
          "max": 100
        },
        "status": "BUSINESS_STATUS_JUST_LOOKING"
      },
      "trafficSource": {
          "source": "google",
          "medium": "referral",
          "campaign": "ads",
          "content": "content"
      }
    }
    """
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "_id": "71bc1780-1a92-47ec-837a-69d68be8c016",
      "name": "test business with traffic source"
    }
    """
    Then I look for model "TrafficSource" by following JSON and remember as "trafficSource":
    """
      {
        "businessId": "71bc1780-1a92-47ec-837a-69d68be8c016"
      }
    """
    And stored value "trafficSource" should contain json:
    """
      {
        "source": "google",
        "medium": "referral",
        "campaign": "ads",
        "content": "content",
        "businessId": "71bc1780-1a92-47ec-837a-69d68be8c016"
      }
    """
    When I send a GET request to "/business/71bc1780-1a92-47ec-837a-69d68be8c016/detail"
    Then print last response
    And response should contain json:
    """
    {
      "_id": "71bc1780-1a92-47ec-837a-69d68be8c016",
      "companyAddress": {
        "country": "RU",
        "city": "Moscow",
        "street": "Some street",
        "zipCode": "123456"
      }
    }
    """

  Scenario: Manipulate Email Settings
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "firstName": "firstname",
        "lastName": "lastname",
        "roles": [
          {
            "name": "merchant",
            "permissions": [{"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []}]
          }
        ]
      }
      """
    When I send a PATCH request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455/secrets/email-settings" with json:
      """
      {
        "description": "",
        "outgoingServerSettings": {
          "host": "localhost",
          "port": 1025,
          "username": "admin2",
          "password": "t0ps3cr3t",
          "secure": false
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      {
        "outgoingServerSettings": {
          "host": "localhost",
          "port": 1025,
          "secure": false,
          "password": null,
          "username": "admin2"
        },
        "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455",
        "description": "",
        "business": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
      }
      """
    When I send a GET request to "/business/6502b371-4cda-4f1d-af9c-f9c5c886c455/secrets/email-settings"
    Then print last response
    And response should contain json:
      """
      {
        "outgoingServerSettings": {
          "host": "localhost",
          "port": 1025,
          "secure": false,
          "password": null,
          "username": "admin2"
        },
        "_id": "6502b371-4cda-4f1d-af9c-f9c5c886c455",
        "description": "",
        "business": "6502b371-4cda-4f1d-af9c-f9c5c886c455"
      }
      """
