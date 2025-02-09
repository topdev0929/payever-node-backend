Feature: Admin order
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
        Given I remember as "ORDER_ID_1" following value:
            """
            "oooooooo-oooo-oooo-oooo-ooooooooooo1"
            """
        Given I remember as "ORDER_ID_2" following value:
            """
            "oooooooo-oooo-oooo-oooo-ooooooooooo2"
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
        When I send a GET request to "/api/admin/orders"
        Then response status code should be 403

    Scenario: Get all orders
        Given I use DB fixture "order/admin-order"
        When I send a GET request to "/api/admin/orders"
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

    Scenario: Get all orders with filter
        Given I use DB fixture "order/admin-order"
        When I send a GET request to "/api/admin/orders?businessIds={{BUSINESS_ID_2}}&limit=1"
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

    Scenario: Get order by id
        Given I use DB fixture "order/admin-order"
        When I send a GET request to "/api/admin/orders/{{ORDER_ID_1}}"
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
                "_id": "{{ORDER_ID_1}}",
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """

    Scenario: Create an order
        Given I use DB fixture "order/admin-order"
        When I send a POST request to "/api/admin/orders" with json:
            """
            {
                "id": "flow-id",
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
            "flow":"flow-id",
            "businessId": "{{BUSINESS_ID_1}}",
            "status": "TEMPORARY"
            }
            """

        And store a response as "response"
        And model "Order" with id "{{response._id}}" should contain json:
            """
            {
                "flow": "flow-id",
                "businessId": "{{BUSINESS_ID_1}}",
                "status": "TEMPORARY"
            }
            """

    Scenario: Update an order
        Given I use DB fixture "order/admin-order"
        When I send a PATCH request to "/api/admin/orders/{{ORDER_ID_1}}" with json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """
        Then print last response
        Then response status code should be 200
        And the response should contain json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """

        And store a response as "response"
        And model "Order" with id "{{response._id}}" should contain json:
            """
            {
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """

    Scenario: Delete order
        Given I use DB fixture "order/admin-order"
        When I send a DELETE request to "/api/admin/orders/{{ORDER_ID_1}}"
        Then print last response
        And the response status code should be 200
        And model "Order" with id "{{ORDER_ID_1}}" should not contain json:
            """
            {
                "_id": "{{ORDER_ID_1}}"
            }
            """
