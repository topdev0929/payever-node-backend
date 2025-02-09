Feature: Admin location
    Background: constants
        Given I authenticate as a user with the following data:
            """
            {
                "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
                "email": "admin@payever.de",
                "roles": [
                    {
                        "name": "admin"
                    }
                ]
            }
            """
        Given I remember as "BUSINESS_ID_1" following value:
            """
            "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"
            """
        Given I remember as "BUSINESS_ID_2" following value:
            """
            "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"
            """
        Given I remember as "LOCATION_ID_1" following value:
            """
            "llllllll-llll-llll-llll-lllllllllll1"
            """
        Given I remember as "LOCATION_ID_2" following value:
            """
            "llllllll-llll-llll-llll-lllllllllll1"
            """

    Scenario: Only admin users have access to admin endpoint
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
        When I send a GET request to "/api/admin/locations"
        Then response status code should be 403

    Scenario: Get all locations
        Given I use DB fixture "location/admin-location"
        When I send a GET request to "/api/admin/locations"
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
                "documents": [
                    {
                        "_id": "*",
                        "businessId": "{{BUSINESS_ID_1}}"
                    },
                    {
                        "_id": "*",
                        "businessId": "{{BUSINESS_ID_2}}"
                    }
                ]
            }
            """
    
    Scenario: Get all locations with filter
        Given I use DB fixture "location/admin-location"
        When I send a GET request to "/api/admin/locations?businessIds={{BUSINESS_ID_2}}&limit=1"
        Then print last response
        Then response status code should be 200
        And the response should contain json:
            """
            {
                "documents": [
                    {
                        "_id": "*",
                        "businessId": "{{BUSINESS_ID_2}}"
                    }
                ]
            }
            """

    Scenario: Get location by id
        Given I use DB fixture "location/admin-location"
        When I send a GET request to "/api/admin/locations/{{LOCATION_ID_1}}"
        Then print last response
        And response status code should be 200        
        And the response should contain json:
            """
            {
                "_id": "{{LOCATION_ID_1}}",
                "businessId": "{{BUSINESS_ID_1}}",
                "name": "name-1",
                "streetName": "street-1",
                "streetNumber": "1",
                "city": "city-1",
                "stateProvinceCode": "code",
                "zipCode": "123456",
                "countryCode": "+1"
            }
            """

    Scenario: Create a location
        Given I use DB fixture "location/admin-location"
        When I send a POST request to "/api/admin/locations" with json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}",
                "name": "name",
                "streetName": "street",
                "streetNumber": "1",
                "city": "city",
                "stateProvinceCode": "code",
                "zipCode": "123456",
                "countryCode": "+99"
            }
            """
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}",
                "name": "name",
                "streetName": "street",
                "streetNumber": "1",
                "city": "city",
                "stateProvinceCode": "code",
                "zipCode": "123456",
                "countryCode": "+99"
            }
            """

        And store a response as "response"
        And model "Location" with id "{{response._id}}" should contain json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}",
                "name": "name",
                "streetName": "street",
                "streetNumber": "1",
                "city": "city",
                "stateProvinceCode": "code",
                "zipCode": "123456",
                "countryCode": "+99"
            }
            """

    Scenario: Update a location
        Given I use DB fixture "location/admin-location"
        When I send a PATCH request to "/api/admin/locations/{{LOCATION_ID_1}}" with json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}",
                "name": "new-name",
                "streetName": "new-street",
                "streetNumber": "100",
                "city": "new-city",
                "stateProvinceCode": "new-code",
                "zipCode": "99999",
                "countryCode": "+99"
            }
            """
        Then print last response
        Then response status code should be 200
        And the response should contain json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}",
                "name": "new-name",
                "streetName": "new-street",
                "streetNumber": "100",
                "city": "new-city",
                "stateProvinceCode": "new-code",
                "zipCode": "99999",
                "countryCode": "+99"
            }
            """

        And store a response as "response"
        And model "Location" with id "{{response._id}}" should contain json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}",
                "name": "new-name",
                "streetName": "new-street",
                "streetNumber": "100",
                "city": "new-city",
                "stateProvinceCode": "new-code",
                "zipCode": "99999",
                "countryCode": "+99"
            }
            """

    Scenario: Delete location
        Given I use DB fixture "location/admin-location"
        When I send a DELETE request to "/api/admin/locations/{{LOCATION_ID_1}}"
        Then print last response
        And the response status code should be 200
        And model "Location" with id "{{LOCATION_ID_1}}" should not contain json:
            """
            {
                "_id": "{{LOCATION_ID_1}}"
            }
            """
