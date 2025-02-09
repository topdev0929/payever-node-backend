Feature: Admin inventory
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
        Given I remember as "SKU" following value:
            """
            "testSku"
            """
        Given I remember as "BUSINESS_ID_1" following value:
            """
            "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"
            """
        Given I remember as "BUSINESS_ID_2" following value:
            """
            "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"
            """
        Given I remember as "INVENTORY_ID_1" following value:
            """
            "iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii1"
            """
        Given I remember as "INVENTORY_ID_1" following value:
            """
            "iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii1"
            """
        Given I remember as "INVENTORY_LOCATION_ID_1" following value:
            """
            "11111111-1111-1111-1111-111111111111"
            """
        Given I remember as "INVENTORY_LOCATION_ID_2" following value:

            """

            "22222222-2222-2222-2222-222222222222"

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
        When I send a GET request to "/api/admin/inventories"
        Then response status code should be 403

    Scenario: Get all inventories
        Given I use DB fixture "inventory/admin-inventory"
        When I send a GET request to "/api/admin/inventories"
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
                "documents": [
                    {
                        "id": "*",
                        "businessId": "{{BUSINESS_ID_1}}"
                    },
                    {
                        "id": "*",
                        "businessId": "{{BUSINESS_ID_2}}"
                    }
                ]
            }
            """

    Scenario: Get all inventories with filter
        Given I use DB fixture "inventory/admin-inventory"
        When I send a GET request to "/api/admin/inventories?businessIds={{BUSINESS_ID_1}}&sku=testSku&skuLike=est&productIds=product-id"
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
                "documents": [
                    {
                        "id": "*",
                        "businessId": "{{BUSINESS_ID_1}}"
                    }
                ]
            }
            """
        And the response should not contain json:
            """
            {
                "documents": [
                    {
                        "id": "*",
                        "businessId": "{{BUSINESS_ID_2}}"
                    }
                ]
            }
            """

    Scenario: Get inventory by id
        Given I use DB fixture "inventory/admin-inventory"
        When I send a GET request to "/api/admin/inventories/{{INVENTORY_ID_1}}"
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
                "_id": "{{INVENTORY_ID_1}}",
                "businessId": "{{BUSINESS_ID_1}}",
                "sku": "testSku"
            }
            """

    Scenario: Create an inventory
        Given I use DB fixture "inventory/admin-inventory"
        When I send a POST request to "/api/admin/inventories" with json:
            """
            {
                "emailLowStock": false,
                "isNegativeStockAllowed": false,
                "isTrackable": true,
                "requireShipping": true,
                "sku": "prod1.6",
                "lowStock": 1,
                "barcode": "barcode",
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """
        Then print last response
        And response status code should be 200
        And the response should contain json:
            """
            {
                "emailLowStock": false,
                "isNegativeStockAllowed": false,
                "isTrackable": true,
                "requireShipping": true,
                "sku": "prod1.6",
                "lowStock": 1,
                "barcode": "barcode",
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """

        And store a response as "response"
        And model "Inventory" with id "{{response._id}}" should contain json:
            """
            {
                "emailLowStock": false,
                "isNegativeStockAllowed": false,
                "isTrackable": true,
                "requireShipping": true,
                "sku": "prod1.6",
                "lowStock": 1,
                "barcode": "barcode",
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """

    Scenario: Update an inventory
        Given I use DB fixture "inventory/admin-inventory"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}" with json:
            """
            {
                "emailLowStock": true,
                "isNegativeStockAllowed": true,
                "isTrackable": false,
                "requireShipping": false,
                "sku": "prod1.622",
                "lowStock": 22,
                "barcode": "barcode22",
                "businessId": "{{BUSINESS_ID_2}}"
            }
            """
        Then print last response
        Then response status code should be 200
        And the response should contain json:
            """
            {
                "emailLowStock": true,
                "isNegativeStockAllowed": true,
                "isTrackable": false,
                "requireShipping": false,
                "sku": "prod1.622",
                "lowStock": 22,
                "barcode": "barcode22",
                "businessId": "{{BUSINESS_ID_2}}"
            }
            """

        And store a response as "response"
        And model "Inventory" with id "{{response._id}}" should contain json:
            """
            {
                "emailLowStock": true,
                "isNegativeStockAllowed": true,
                "isTrackable": false,
                "requireShipping": false,
                "sku": "prod1.622",
                "lowStock": 22,
                "barcode": "barcode22",
                "businessId": "{{BUSINESS_ID_2}}"
            }
            """

    Scenario: Delete inventory
        Given I use DB fixture "inventory/admin-inventory"
        When I send a DELETE request to "/api/admin/inventories/{{INVENTORY_ID_1}}"
        Then print last response
        And the response status code should be 200
        And model "Inventory" with id "{{INVENTORY_ID_1}}" should not contain json:
            """
            {
                "_id": "{{INVENTORY_ID_1}}"
            }
            """

    Scenario: Add stock to inventory
        Given I use DB fixture "inventory/admin-modify-stock"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/add-stock" with json:
            """
            {
                "quantity": 99
            }
            """
        Then print last response
        And the response status code should be 200
        And look for model "Inventory" by following JSON and remember as "inventory":
            """
            {
                "sku": "{{SKU}}",
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """
        And stored value "inventory" should contain json:
            """
            {
                "stock": 119
            }
            """
        Then print RabbitMQ exchange "async_events" message list
        And RabbitMQ exchange "async_events" should contain following ordered messages:
            """
            [
                {
                    "name": "inventory.event.stock.added",
                    "payload": {
                        "business": {
                            "id": "{{BUSINESS_ID_1}}"
                        },
                        "quantity": 99,
                        "sku": "{{SKU}}",
                        "stock": 119
                    }
                }
            ]
            """

    Scenario: Subtract stock from inventory
        Given I use DB fixture "inventory/admin-modify-stock"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/subtract-stock" with json:
            """
            {
                "quantity": 9
            }
            """
        Then print last response
        And the response status code should be 200
        And look for model "Inventory" by following JSON and remember as "inventory":
            """
            {
                "sku": "{{SKU}}",
                "businessId": "{{BUSINESS_ID_1}}"
            }
            """
        And stored value "inventory" should contain json:
            """
            {
                "stock": 11
            }
            """
        Then print RabbitMQ exchange "async_events" message list
        And RabbitMQ exchange "async_events" should contain following ordered messages:
            """
            [
                {
                    "name": "inventory.event.stock.subtracted",
                    "payload": {
                        "business": {
                            "id": "{{BUSINESS_ID_1}}"
                        },
                        "quantity": 9,
                        "sku": "{{SKU}}",
                        "stock": 11
                    }
                }
            ]
            """

    Scenario: Add stock with location
        Given I use DB fixture "inventory/add-stock-with-location"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/add-stock" with json:
            """
            {
                "quantity": 99,
                "inventoryLocations": [
                    {
                        "locationId": "location_id_1",
                        "stock": 40
                    },
                    {
                        "locationId": "location_id_2",
                        "stock": 59
                    }
                ]
            }
            """
        Then print last response
        And the response status code should be 200

        And I look for model "InventoryLocation" by following JSON and remember as "inventoryLocation":
            """
            {
                "_id": "{{INVENTORY_LOCATION_ID_1}}"
            }
            """
        And print storage key "inventoryLocation"
        And stored value "inventoryLocation" should contain json:
            """
            {
                "stock": 40
            }
            """

    Scenario: Subtract stock with location
        Given I use DB fixture "inventory/subtract-stock-with-location"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/subtract-stock" with json:
            """
            {
                "quantity": 4,
                "inventoryLocations": [
                    {
                        "locationId": "location_id_1",
                        "stock": 4
                    }
                ]
            }
            """
        Then print last response
        And the response status code should be 200
        And I look for model "InventoryLocation" by following JSON and remember as "inventoryLocation":
            """
            {
                "_id": "{{INVENTORY_LOCATION_ID_1}}"
            }
            """
        And print storage key "inventoryLocation"
        And stored value "inventoryLocation" should contain json:
            """
            {
                "stock": 40
            }
            """

    Scenario: transfer stock from lone ocation to another
        Given I use DB fixture "inventory/transfer-stock-by-sku"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/transfer-stock" with json:
            """
            {
                "fromLocationId": "location_id_1",
                "toLocationId": "location_id_2",
                "quantity": 3
            }
            """
        Then print last response
        And the response status code should be 200
        And look for model "InventoryLocation" by following JSON and remember as "fromInventory":
            """
            {
                "locationId": "location_id_1"
            }
            """
        And stored value "fromInventory" should contain json:
            """
            {
                "stock": 12
            }
            """
        And look for model "InventoryLocation" by following JSON and remember as "toInventory":
            """
            {
                "locationId": "location_id_2"
            }
            """
        And stored value "toInventory" should contain json:
            """
            {
                "stock": 8
            }
            """

    Scenario: transfer stock from one location to new location
        Given I use DB fixture "inventory/transfer-stock-by-sku"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/transfer-stock" with json:
            """
            {
                "fromLocationId": "location_id_1",
                "toLocationId": "location_id_3",
                "quantity": 3
            }
            """
        Then print last response
        And the response status code should be 200
        And look for model "InventoryLocation" by following JSON and remember as "fromInventory":
            """
            {
                "locationId": "location_id_1"
            }
            """
        And stored value "fromInventory" should contain json:
            """
            {
                "stock": 12
            }
            """
        And look for model "InventoryLocation" by following JSON and remember as "toInventory":
            """
            {
                "locationId": "location_id_3"
            }
            """
        And stored value "toInventory" should contain json:
            """
            {
                "stock": 3
            }
            """

    Scenario: Add stock to paticular location
        Given I use DB fixture "inventory/add-stock-with-location"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/inventory-location/{{INVENTORY_LOCATION_ID_1}}/add-stock" with json:
            """
            {
                "quantity": 4
            }
            """
        Then print last response
        And the response status code should be 200
        And I look for model "InventoryLocation" by following JSON and remember as "inventoryLocation":
            """
            {
                "_id": "{{INVENTORY_LOCATION_ID_1}}"
            }
            """
        And print storage key "inventoryLocation"
        And stored value "inventoryLocation" should contain json:
            """
            {
                "stock": 4
            }
            """



    Scenario: Subtract stock from location
        Given I use DB fixture "inventory/subtract-stock-with-location"
        When I send a PATCH request to "/api/admin/inventories/{{INVENTORY_ID_1}}/inventory-location/{{INVENTORY_LOCATION_ID_1}}/subtract-stock" with json:
            """
            {
                "quantity": 4
            }
            """
        Then print last response
        And the response status code should be 200
        And I look for model "InventoryLocation" by following JSON and remember as "inventoryLocation":
            """
            {
                "_id": "{{INVENTORY_LOCATION_ID_1}}"
            }
            """
        And print storage key "inventoryLocation"
        And stored value "inventoryLocation" should contain json:
            """
            {
                "stock": 40
            }
            """




