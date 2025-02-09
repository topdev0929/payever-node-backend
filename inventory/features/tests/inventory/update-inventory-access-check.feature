Feature: Update inventory access check

Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "inventorySku" following value:
      """
      "testSku"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": [
                        {
                            "create": true,
                            "delete": false,
                            "microservice": "products",
                            "read": true,
                            "update": false
                        }
                ]
              }
            ]
          }
        ]
      }
      """

Scenario: Update inventory by sku, user with create product permission
    Given I use DB fixture "inventory/update-inventory-by-sku"
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}" with json:
      """
      {
        "sku": "{{inventorySku}}",
        "barcode": "updated_barcode",
        "isTrackable": false,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 200
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{inventorySku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "barcode": "updated_barcode",
        "isTrackable": false,
        "isNegativeStockAllowed": true
      }
      """