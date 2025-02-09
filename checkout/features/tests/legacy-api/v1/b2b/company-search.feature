Feature: Company search
  Scenario: Search company by name
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/company-search",
        "body": "{\"address\":{\"city\":\"test_city\",\"country\":\"DE\",\"phone\":\"123456\",\"streetName\":\"test_street\",\"streetNumber\":\"test_number\",\"zip\":\"test_zip\"},\"company\":{\"name\":\"Google\",\"type\":\"limited\"}}"
      },
      "response": {
        "status": 201,
        "body": [
          {
             "id": "81981372",
             "name": "Google Germany GmbH",
             "phoneNumber": "+49 40 80817",
             "legalFormCode": "GMBH",
             "companyStatus": "Active",
             "address": {
               "streetNumber": "19",
               "streetName": "ABC-Str.",
               "postCode": "20354",
               "city": "Hamburg",
               "stateCode": null,
               "countryCode": "DE",
               "type": "main"
             },
             "companyIdentifiers": [
               {
                 "idValue": "021598735",
                 "idTypeCode": "BWI",
                 "isPrincipal": false
               },
               {
                 "idValue": "HRB 86891 20355",
                 "idTypeCode": "COC",
                 "isPrincipal": false
               },
               {
                 "idValue": "2151130879",
                 "idTypeCode": "CREF",
                 "isPrincipal": false
               },
               {
                 "idValue": "330465266",
                 "idTypeCode": "DUN",
                 "isPrincipal": false
               },
               {
                 "idValue": "0102520346",
                 "idTypeCode": "HRM",
                 "isPrincipal": false
               },
               {
                 "idValue": "813741370",
                 "idTypeCode": "TVADE",
                 "isPrincipal": false
               }
             ]
           }
        ]
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/company-search/allianz"
    When I send a POST request to "/api/b2b/search" with json:
    """
    {
      "company": {
        "type": "limited",
        "name": "Google"
      },
      "address": {
        "city": "test_city",
        "phone": "123456",
        "street_name": "test_street",
        "street_number": "test_number",
        "zip": "test_zip",
        "country": "DE"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    [
     {
       "id": "81981372",
       "name": "Google Germany GmbH",
       "phoneNumber": "+49 40 80817",
       "legalFormCode": "GMBH",
       "companyStatus": "Active",
       "address": {
         "streetNumber": "19",
         "streetName": "ABC-Str.",
         "postCode": "20354",
         "city": "Hamburg",
         "stateCode": null,
         "countryCode": "DE",
         "type": "main"
       },
       "companyIdentifiers": [
         {
           "idValue": "021598735",
           "idTypeCode": "BWI",
           "isPrincipal": false
         },
         {
           "idValue": "HRB 86891 20355",
           "idTypeCode": "COC",
           "isPrincipal": false
         },
         {
           "idValue": "2151130879",
           "idTypeCode": "CREF",
           "isPrincipal": false
         },
         {
           "idValue": "330465266",
           "idTypeCode": "DUN",
           "isPrincipal": false
         },
         {
           "idValue": "0102520346",
           "idTypeCode": "HRM",
           "isPrincipal": false
         },
         {
           "idValue": "813741370",
           "idTypeCode": "TVADE",
           "isPrincipal": false
         }
       ]
     }
   ]
    """

  Scenario: Search company by ehId
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/company-search",
        "body": "{\"address\":{},\"company\":{\"externalId\":\"12345\"}}"
      },
      "response": {
        "status": 201,
        "body": {
             "id": "81981372",
             "name": "Google Germany GmbH",
             "phoneNumber": "+49 40 80817",
             "legalFormCode": "GMBH",
             "companyStatus": "Active",
             "address": {
               "streetNumber": "19",
               "streetName": "ABC-Str.",
               "postCode": "20354",
               "city": "Hamburg",
               "stateCode": null,
               "countryCode": "DE",
               "type": "main"
             },
             "companyIdentifiers": [
               {
                 "idValue": "021598735",
                 "idTypeCode": "BWI",
                 "isPrincipal": false
               },
               {
                 "idValue": "HRB 86891 20355",
                 "idTypeCode": "COC",
                 "isPrincipal": false
               },
               {
                 "idValue": "2151130879",
                 "idTypeCode": "CREF",
                 "isPrincipal": false
               },
               {
                 "idValue": "330465266",
                 "idTypeCode": "DUN",
                 "isPrincipal": false
               },
               {
                 "idValue": "0102520346",
                 "idTypeCode": "HRM",
                 "isPrincipal": false
               },
               {
                 "idValue": "813741370",
                 "idTypeCode": "TVADE",
                 "isPrincipal": false
               }
             ]
           }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/company-search/allianz"
    When I send a POST request to "/api/b2b/search" with json:
    """
    {
      "company": {
        "external_id": "12345"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
     {
       "id": "81981372",
       "name": "Google Germany GmbH",
       "phoneNumber": "+49 40 80817",
       "legalFormCode": "GMBH",
       "companyStatus": "Active",
       "address": {
         "streetNumber": "19",
         "streetName": "ABC-Str.",
         "postCode": "20354",
         "city": "Hamburg",
         "stateCode": null,
         "countryCode": "DE",
         "type": "main"
       },
       "companyIdentifiers": [
         {
           "idValue": "021598735",
           "idTypeCode": "BWI",
           "isPrincipal": false
         },
         {
           "idValue": "HRB 86891 20355",
           "idTypeCode": "COC",
           "isPrincipal": false
         },
         {
           "idValue": "2151130879",
           "idTypeCode": "CREF",
           "isPrincipal": false
         },
         {
           "idValue": "330465266",
           "idTypeCode": "DUN",
           "isPrincipal": false
         },
         {
           "idValue": "0102520346",
           "idTypeCode": "HRM",
           "isPrincipal": false
         },
         {
           "idValue": "813741370",
           "idTypeCode": "TVADE",
           "isPrincipal": false
         }
       ]
     }
    """

  Scenario: Search company by vat id
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/company-search",
        "body": "{\"address\":{\"country\":\"DE\"},\"company\":{\"vatId\":\"12345\"}}"
      },
      "response": {
        "status": 201,
        "body": {
             "id": "81981372",
             "name": "Google Germany GmbH",
             "phoneNumber": "+49 40 80817",
             "legalFormCode": "GMBH",
             "companyStatus": "Active",
             "address": {
               "streetNumber": "19",
               "streetName": "ABC-Str.",
               "postCode": "20354",
               "city": "Hamburg",
               "stateCode": null,
               "countryCode": "DE",
               "type": "main"
             },
             "companyIdentifiers": [
               {
                 "idValue": "021598735",
                 "idTypeCode": "BWI",
                 "isPrincipal": false
               },
               {
                 "idValue": "HRB 86891 20355",
                 "idTypeCode": "COC",
                 "isPrincipal": false
               },
               {
                 "idValue": "2151130879",
                 "idTypeCode": "CREF",
                 "isPrincipal": false
               },
               {
                 "idValue": "330465266",
                 "idTypeCode": "DUN",
                 "isPrincipal": false
               },
               {
                 "idValue": "0102520346",
                 "idTypeCode": "HRM",
                 "isPrincipal": false
               },
               {
                 "idValue": "813741370",
                 "idTypeCode": "TVADE",
                 "isPrincipal": false
               }
             ]
           }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/company-search/allianz"
    When I send a POST request to "/api/b2b/search" with json:
    """
    {
      "company": {
        "vat_id": "12345"
      },
      "address": {
        "country": "DE"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
     {
       "id": "81981372",
       "name": "Google Germany GmbH",
       "phoneNumber": "+49 40 80817",
       "legalFormCode": "GMBH",
       "companyStatus": "Active",
       "address": {
         "streetNumber": "19",
         "streetName": "ABC-Str.",
         "postCode": "20354",
         "city": "Hamburg",
         "stateCode": null,
         "countryCode": "DE",
         "type": "main"
       },
       "companyIdentifiers": [
         {
           "idValue": "021598735",
           "idTypeCode": "BWI",
           "isPrincipal": false
         },
         {
           "idValue": "HRB 86891 20355",
           "idTypeCode": "COC",
           "isPrincipal": false
         },
         {
           "idValue": "2151130879",
           "idTypeCode": "CREF",
           "isPrincipal": false
         },
         {
           "idValue": "330465266",
           "idTypeCode": "DUN",
           "isPrincipal": false
         },
         {
           "idValue": "0102520346",
           "idTypeCode": "HRM",
           "isPrincipal": false
         },
         {
           "idValue": "813741370",
           "idTypeCode": "TVADE",
           "isPrincipal": false
         }
       ]
     }
    """

  Scenario: Search company by registration id
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/company-search",
        "body": "{\"address\":{\"country\":\"DE\"},\"company\":{\"registrationId\":\"12345\"}}"
      },
      "response": {
        "status": 201,
        "body": {
             "id": "81981372",
             "name": "Google Germany GmbH",
             "phoneNumber": "+49 40 80817",
             "legalFormCode": "GMBH",
             "companyStatus": "Active",
             "address": {
               "streetNumber": "19",
               "streetName": "ABC-Str.",
               "postCode": "20354",
               "city": "Hamburg",
               "stateCode": null,
               "countryCode": "DE",
               "type": "main"
             },
             "companyIdentifiers": [
               {
                 "idValue": "021598735",
                 "idTypeCode": "BWI",
                 "isPrincipal": false
               },
               {
                 "idValue": "HRB 86891 20355",
                 "idTypeCode": "COC",
                 "isPrincipal": false
               },
               {
                 "idValue": "2151130879",
                 "idTypeCode": "CREF",
                 "isPrincipal": false
               },
               {
                 "idValue": "330465266",
                 "idTypeCode": "DUN",
                 "isPrincipal": false
               },
               {
                 "idValue": "0102520346",
                 "idTypeCode": "HRM",
                 "isPrincipal": false
               },
               {
                 "idValue": "813741370",
                 "idTypeCode": "TVADE",
                 "isPrincipal": false
               }
             ]
           }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/company-search/allianz"
    When I send a POST request to "/api/b2b/search" with json:
    """
    {
      "company": {
        "registration_id": "12345"
      },
      "address": {
        "country": "DE"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
     {
       "id": "81981372",
       "name": "Google Germany GmbH",
       "phoneNumber": "+49 40 80817",
       "legalFormCode": "GMBH",
       "companyStatus": "Active",
       "address": {
         "streetNumber": "19",
         "streetName": "ABC-Str.",
         "postCode": "20354",
         "city": "Hamburg",
         "stateCode": null,
         "countryCode": "DE",
         "type": "main"
       },
       "companyIdentifiers": [
         {
           "idValue": "021598735",
           "idTypeCode": "BWI",
           "isPrincipal": false
         },
         {
           "idValue": "HRB 86891 20355",
           "idTypeCode": "COC",
           "isPrincipal": false
         },
         {
           "idValue": "2151130879",
           "idTypeCode": "CREF",
           "isPrincipal": false
         },
         {
           "idValue": "330465266",
           "idTypeCode": "DUN",
           "isPrincipal": false
         },
         {
           "idValue": "0102520346",
           "idTypeCode": "HRM",
           "isPrincipal": false
         },
         {
           "idValue": "813741370",
           "idTypeCode": "TVADE",
           "isPrincipal": false
         }
       ]
     }
    """

  Scenario: Get company credit line
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/get-company-credit-line",
        "body": "{\"externalId\":\"12345\"}"
      },
      "response": {
        "status": 201,
        "body": {
             "buyerId": "81981372",
             "maximum": 1000,
             "maxInvoiceAmount": 5000,
             "currency": "EUR"
           }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/company-search/allianz"
    When I send a POST request to "/api/b2b/search/credit" with json:
    """
    {
      "company": {
        "external_id": "12345"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "buyerId": "81981372",
      "maximum": 1000,
      "maxInvoiceAmount": 5000,
      "currency": "EUR"
    }
    """

  Scenario: Search company by ehId with specific business id header
    Given I set header "x-payever-business" with value "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/company-search",
        "body": "{\"address\":{},\"company\":{\"externalId\":\"12345\"}}"
      },
      "response": {
        "status": 201,
        "body": {
             "id": "81981372",
             "name": "Google Germany GmbH",
             "phoneNumber": "+49 40 80817",
             "legalFormCode": "GMBH",
             "companyStatus": "Active",
             "address": {
               "streetNumber": "19",
               "streetName": "ABC-Str.",
               "postCode": "20354",
               "city": "Hamburg",
               "stateCode": null,
               "countryCode": "DE",
               "type": "main"
             },
             "companyIdentifiers": [
               {
                 "idValue": "021598735",
                 "idTypeCode": "BWI",
                 "isPrincipal": false
               },
               {
                 "idValue": "HRB 86891 20355",
                 "idTypeCode": "COC",
                 "isPrincipal": false
               },
               {
                 "idValue": "2151130879",
                 "idTypeCode": "CREF",
                 "isPrincipal": false
               },
               {
                 "idValue": "330465266",
                 "idTypeCode": "DUN",
                 "isPrincipal": false
               },
               {
                 "idValue": "0102520346",
                 "idTypeCode": "HRM",
                 "isPrincipal": false
               },
               {
                 "idValue": "813741370",
                 "idTypeCode": "TVADE",
                 "isPrincipal": false
               }
             ]
           }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/company-search/allianz"
    When I send a POST request to "/api/b2b/search" with json:
    """
    {
      "company": {
        "external_id": "12345"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
     {
       "id": "81981372",
       "name": "Google Germany GmbH",
       "phoneNumber": "+49 40 80817",
       "legalFormCode": "GMBH",
       "companyStatus": "Active",
       "address": {
         "streetNumber": "19",
         "streetName": "ABC-Str.",
         "postCode": "20354",
         "city": "Hamburg",
         "stateCode": null,
         "countryCode": "DE",
         "type": "main"
       },
       "companyIdentifiers": [
         {
           "idValue": "021598735",
           "idTypeCode": "BWI",
           "isPrincipal": false
         },
         {
           "idValue": "HRB 86891 20355",
           "idTypeCode": "COC",
           "isPrincipal": false
         },
         {
           "idValue": "2151130879",
           "idTypeCode": "CREF",
           "isPrincipal": false
         },
         {
           "idValue": "330465266",
           "idTypeCode": "DUN",
           "isPrincipal": false
         },
         {
           "idValue": "0102520346",
           "idTypeCode": "HRM",
           "isPrincipal": false
         },
         {
           "idValue": "813741370",
           "idTypeCode": "TVADE",
           "isPrincipal": false
         }
       ]
     }
    """

  Scenario: Search company by ehId with wrong business id is forbidden
    Given I set header "x-payever-business" with value "wrong_id"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
            }
          ]
        }
      ]
    }
    """
    And I use DB fixture "connection/checkout-connection/company-search/allianz"
    When I send a POST request to "/api/b2b/search" with json:
    """
    {
      "company": {
        "external_id": "12345"
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
     {
       "call": {
         "status": "failed",
         "type": "search",
         "id": "*",
         "created_at": "*",
         "message": "Forbidden"
       },
       "error": "An api error occurred",
       "error_description": "Forbidden"
     }
    """
