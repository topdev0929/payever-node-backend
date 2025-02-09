Feature: Users controller
  Background:
    Given I remember as "userId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
      """

  Scenario: Get user account
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a GET request to "/user"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "_id": "{{userId}}",
          "email": "email@test.com",
          "firstName": "test",
          "hasUnfinishedBusinessRegistration": true,
          "language": "en",
          "lastName": "test",
          "logo": "test"
        }
      """

  Scenario: Get user account by id with admin token
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "admin@test.com",
        "roles": [{
          "name": "admin",
          "permissions": []
        }]
      }
      """
    When I send a GET request to "/user/{{userId}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "userAccount": {
            "language": "en",
            "salutation": "test",
            "firstName": "test",
            "lastName": "test",
            "phone": "test",
            "email": "email@test.com",
            "birthday": "2019-06-17T11:23:59.000Z",
            "createdAt": "2019-06-17T11:23:59.000Z",
            "logo": "test"
          },
          "businesses": [{
             "active": true,
             "hidden": false,
             "contactEmails": [
               "test1@email.com"
             ],
             "cspAllowedHosts": [
               "host1"
             ],
             "_id": "88038e2a-90f9-11e9-a492-7200004fe4c0",
             "name": "test business",
             "owner": "{{userId}}",
             "logo": "logo",
             "currentWallpaper": {
               "theme": "dark",
               "wallpaper": "wp"
             },
             "currency": "eur"
          }]
        }
      """

  Scenario: Get user information with missing credentials
    Given I am not authenticated
    When I send a GET request to "/user"
    Then the response status code should be 403

  Scenario: Get user information with invalid credentials
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@fake.com",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a GET request to "/user"
    Then the response status code should be 404

  Scenario: Create user
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "registrationOrigin": {
              "account": "merchant",
              "url": "https://commerceos.test.devpayever.com/entry/registration/business"
            }
          }
         ],
        "result": {}
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "5fad5396-9119-11e9-bbe3-7200004fe4c0",
        "firstName": "firstname",
        "lastName": "lastname",
        "email": "newuser@email.com",
        "roles": [{
          "name": "user",
          "permissions": []
        }]
      }
      """
    When I send a POST request to "/user" with json:
    """
      {
        "registrationOrigin": {
          "account": "merchant",
          "url": "https://commerceos.test.devpayever.com/entry/registration/business"
        }
      }
    """
    Then print last response
    Then response status code should be 201
    And the response should contain json:
    """
      {
        "firstName": "firstname",
        "language": "en",
        "lastName": "lastname",
        "email": "newuser@email.com",
        "registrationOrigin": {
          "account": "merchant",
          "url": "https://commerceos.test.devpayever.com/entry/registration/business"
        }
      }
    """
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
      [{
        "name": "users.event.user.created",
        "payload": {
          "_id": "5fad5396-9119-11e9-bbe3-7200004fe4c0",
          "userAccount": {
            "firstName": "firstname",
            "lastName": "lastname",
            "email": "newuser@email.com",
            "registrationOrigin": {
              "account": "merchant",
              "url": "https://commerceos.test.devpayever.com/entry/registration/business"
            }
          }
        }
      }]
    """

  Scenario: Create user with unfinished business registration
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "registrationOrigin": {
              "account": "merchant",
              "url": "https://commerceos.test.devpayever.com/entry/registration/business"
            }
          }
         ],
        "result": {}
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "5fad5396-9119-11e9-bbe3-7200004fe4c0",
        "firstName": "firstname",
        "lastName": "lastname",
        "email": "newuser@email.com",
        "roles": [{
          "name": "user",
          "permissions": []
        }]
      }
      """
    When I send a POST request to "/user" with json:
      """
      {
        "hasUnfinishedBusinessRegistration": true,
        "registrationOrigin": {
          "account": "merchant",
          "url": "https://commerceos.test.devpayever.com/entry/registration/business"
        }
      }
      """
    Then print last response
    Then response status code should be 201
    And the response should contain json:
    """
      {
        "firstName": "firstname",
        "language": "en",
        "lastName": "lastname",
        "email": "newuser@email.com"
      }
    """
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
      [{
        "name": "users.event.user.created",
        "payload": {
          "_id": "5fad5396-9119-11e9-bbe3-7200004fe4c0",
          "userAccount": {
            "firstName": "firstname",
            "lastName": "lastname",
            "email": "newuser@email.com",
            "hasUnfinishedBusinessRegistration": true,
            "registrationOrigin": {
              "account": "merchant",
              "url": "https://commerceos.test.devpayever.com/entry/registration/business"
            }
          }
        }
      }]
    """

  Scenario: user should not be able to change thier email
    Given I use DB fixture "users"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "_id": "{{userId}}"
          }
         ],
        "result": {}
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/user" with json:
    """
      {
        "email": "a.new.email@mailservice.co",
        "firstName": "new firstname"
      }
    """
    Then print last response
    Then the response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """"
      [
        {
          "name": "users.event.user_account.updated",
          "payload": {
            "language": "en",
            "salutation": "test",
            "firstName": "new firstname",
            "lastName": "test",
            "phone": "test",
            "email": "email@test.com",
            "birthday": "2019-06-17T11:23:59.000Z",
            "logo": "test"
          }
        }
      ]
    """

  Scenario: update user
    Given I use DB fixture "users"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "_id": "{{userId}}"
          }
         ],
        "result": {}
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/user" with json:
    """
      {
        "firstName": "newfirstname",
        "birthday": "2020-01-02T00:00:00.000Z"
      }
    """
    Then print last response
    Then the response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """"
      [
        {
          "name": "users.event.user_account.updated",
          "payload": {
            "language": "en",
            "salutation": "test",
            "firstName": "newfirstname",
            "lastName": "test",
            "phone": "test",
            "email": "email@test.com",
            "birthday": "2020-01-02T00:00:00.000Z",
            "logo": "test"
          }
        }
      ]
    """

  Scenario: update user with null birthday
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/user" with json:
    """
      {
        "birthday": null
      }
    """
    Then print last response
    Then the response status code should be 400

  Scenario: update user with empty firstName
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/user" with json:
    """
      {
        "firstName": ""
      }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
        {
          "errors": [
              {
                  "target": {
                      "firstName": ""
                  },
                  "value": "",
                  "property": "firstName",
                  "children": [],
                  "constraints": {
                      "isNotEmpty": "firstName should not be empty"
                  }
              }
            ],
          "message": "Validation failed",
          "statusCode": 400
        }
      """

  Scenario: update user with empty lastName
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/user" with json:
    """
      {
        "lastName": ""
      }
    """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
        {
          "errors": [
              {
                  "target": {
                      "lastName": ""
                  },
                  "value": "",
                  "property": "lastName",
                  "children": [],
                  "constraints": {
                      "isNotEmpty": "lastName should not be empty"
                  }
              }
          ],
          "message": "Validation failed",
          "statusCode": 400
        }
      """

  Scenario: set shipping addresses
    Given I use DB fixture "users"
    Given I use DB fixture "countries"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "_id":"{{userId}}"
          }
         ],
        "result": {}
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/user" with json:
    """
      {
        "shippingAddresses": [
          {
            "country": "DE",
            "city": "Hamburg",
            "street": "Some street",
            "apartment": "Some apt.",
            "zipCode": "123456"
          },
          {
            "country": "DE",
            "city": "Hamburg",
            "street": "Some other street",
            "apartment": "Some other apt.",
            "zipCode": "654321"
          }
        ]
      }
    """
    Then print last response
    Then the response status code should be 200

    When I send a GET request to "/user"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "*",
      "email": "email@test.com",
      "firstName": "test",
      "hasUnfinishedBusinessRegistration": true,
      "language": "en",
      "lastName": "test",
      "logo": "test"
    }
    """

    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """"
      [
        {
          "name": "users.event.user_account.updated",
          "payload": {
            "language": "en",
            "salutation": "test",
            "firstName": "test",
            "lastName": "test",
            "phone": "test",
            "email": "email@test.com",
            "birthday": "2019-06-17T11:23:59.000Z",
            "logo": "test",
            "shippingAddresses": [
              {
                "country": "DE",
                "city": "Hamburg",
                "street": "Some street",
                "apartment": "Some apt.",
                "zipCode": "123456"
              },
              {
                "country": "DE",
                "city": "Hamburg",
                "street": "Some other street",
                "apartment": "Some other apt.",
                "zipCode": "654321"
              }
            ]
          }
        }
      ]
    """

  Scenario: set shipping addresses with wrong country
    Given I use DB fixture "users"
    Given I use DB fixture "countries"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "{{userId}}",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/user" with json:
    """
      {
        "shippingAddresses": [
          {
            "country": "UNKNOWN COUNTRY",
            "city": "Hamburg",
            "street": "Some street",
            "apartment": "Some apt.",
            "zipCode": "123456"
          },
          {
            "country": "DE",
            "city": "Hamburg",
            "street": "Some other street",
            "apartment": "Some other apt.",
            "zipCode": "654321"
          }
        ]
      }
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
      "errors": [{
        "children": [{
           "children": [{
             "constraints": {
               "CountryCodeConstraint": "Code \"(UNKNOWN COUNTRY)\" is not valid country code"
             }
           }]
        }]
      }]
    }
    """

  Scenario: update user without credentials
    Given I am not authenticated
    When I send a PATCH request to "/user" with json:
    """
      {
        "firstName": "newfirstname"
      }
    """
    Then the response status code should be 403

  Scenario: add business and delete user
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "users",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{userId}}"
              }
            }
          }
         ],
        "result": {}
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "admin",
          "permissions": []
        }]
      }
      """

    When I send a PATCH request to "/user/{{userId}}/business/88038e2a-90f9-11e9-a492-7200004fe4c0"

    Then print last response
    And the response status code should be 200

    When I send a DELETE request to "/user/{{userId}}"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {"_id": "{{userId}}"}
    """
    And model "User" with id "{{userId}}" should not exist
