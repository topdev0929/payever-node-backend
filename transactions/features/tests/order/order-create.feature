@order-create-v3
Feature: Order create v3
  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """

  Scenario: Create order
    Given I authenticate as a user with the following data:
    """
    {"email": "email@email.com","roles": [{"name": "oauth","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
    """
    When I send a POST request to "/api/v3/order" with json:
    """
    {
      "purchase": {
        "amount": 200,
        "currency": "EUR",
        "delivery_fee": 0,
        "down_payment": 0
      },
      "customer": {
        "birthdate": "1990-01-30",
        "phone": "+4912345678",
        "email": "test@test.com"
      },
      "cart": [
        {
          "brand": "Apple",
          "name": "Test Item",
          "identifier": "12345",
          "sku": "12345",
          "quantity": 1,
          "unit_price": 200,
          "tax_rate": 0,
          "total_amount": 200,
          "total_tax_amount": 0,
          "description": "test description",
          "image_url": "http://img.url",
          "product_url": "http://product.url",
          "category": "Electronics",
          "attributes": {
            "weight": 10,
            "dimensions": {
              "height": 5,
              "width": 15,
              "length": 10
            }
          }
        }
      ],
      "billing_address": {
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_number": "12",
        "salutation": "mr",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "organization_name": "Test",
        "street_line_2": "Test line 2",
        "street_name": "Test",
        "house_extension": "A"
      },
      "shipping_address": {
        "first_name": "Grün",
        "last_name": "Ampel",
        "street": "Test 12",
        "street_number": "12",
        "salutation": "mr",
        "zip": "38889",
        "country": "DE",
        "city": "Elbingerode (Harz)",
        "organization_name": "Test",
        "street_line_2": "Test line 2",
        "street_name": "Test",
        "house_extension": "A"
      },
      "reference": "as54a5sd45as4d"

    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "business_id": "36bf8981-8827-4c0c-a645-02d9fc6d72c8",
      "reference": "as54a5sd45as4d",
      "created_at": "*",
      "billing_address": {
        "city": "Elbingerode (Harz)",
        "country": "DE",
        "first_name": "Grün",
        "last_name": "Ampel",
        "salutation": "mr",
        "street": "Test 12",
        "street_number": "12",
        "street_name": "Test",
        "house_extension": "A",
        "zip": "38889",
        "organization_name": "Test"
      },
      "shipping_address": {
        "city": "Elbingerode (Harz)",
        "country": "DE",
        "first_name": "Grün",
        "last_name": "Ampel",
        "salutation": "mr",
        "street": "Test 12",
        "street_number": "12",
        "street_name": "Test",
        "house_extension": "A",
        "zip": "38889",
        "organization_name": "Test"
      },
      "purchase": {
        "amount": 200,
        "currency": "EUR",
        "delivery_fee": 0,
        "down_payment": 0
      },
      "customer": {
        "email": "test@test.com",
        "phone": "+4912345678",
        "birthdate": "1990-01-30T00:00:00.000Z"
      },
      "cart": [
       {
         "identifier": "12345",
         "name": "Test Item",
         "brand": "Apple",
         "quantity": 1,
         "sku": "12345",
         "unit_price": 200,
         "tax_rate": 0,
         "total_amount": 200,
         "total_tax_amount": 0,
         "description": "test description",
         "image_url": "http://img.url",
         "product_url": "http://product.url",
         "category": "Electronics",
         "attributes": {
           "weight": 10,
           "dimensions": {
             "height": 5,
             "width": 15,
             "length": 10
           }
         }
       }
      ]
    }
    """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
       {
         "name": "transactions.event.order.created",
         "payload": {
           "id": "*",
           "business_id": "36bf8981-8827-4c0c-a645-02d9fc6d72c8",
           "reference": "as54a5sd45as4d",
           "purchase": {
             "amount": 200,
             "currency": "EUR",
             "delivery_fee": 0,
             "down_payment": 0
           },
           "customer": {
             "email": "test@test.com",
             "phone": "+4912345678",
             "birthdate": "1990-01-30T00:00:00.000Z"
           },
           "cart": [
             {
               "identifier": "12345",
               "name": "Test Item",
               "brand": "Apple",
               "quantity": 1,
               "sku": "12345",
               "unit_price": 200,
               "tax_rate": 0,
               "total_amount": 200,
               "total_tax_amount": 0,
               "description": "test description",
               "image_url": "http://img.url",
               "product_url": "http://product.url",
               "category": "Electronics",
               "attributes": {
                 "weight": 10,
                 "dimensions": {
                   "height": 5,
                   "width": 15,
                   "length": 10
                 }
               }
             }
           ],
           "billing_address": {
             "salutation": "mr",
             "first_name": "Grün",
             "last_name": "Ampel",
             "street": "Test 12",
             "street_number": "12",
             "street_name": "Test",
             "house_extension": "A",
             "city": "Elbingerode (Harz)",
             "zip": "38889",
             "country": "DE",
             "organization_name": "Test"
           },
           "shipping_address": {
             "salutation": "mr",
             "first_name": "Grün",
             "last_name": "Ampel",
             "street": "Test 12",
             "street_number": "12",
             "street_name": "Test",
             "house_extension": "A",
             "city": "Elbingerode (Harz)",
             "zip": "38889",
             "country": "DE",
             "organization_name": "Test"
           },
           "created_at": "*",
           "updated_at": "*"
         }
       }
     ]
      """
    Then I get "id" from response and remember as "createdOrderId"
    Then I look for model "Order" with id "{{createdOrderId}}" and remember as "storedOrder"
    And print storage key "storedOrder"
    And model "Order" with id "{{createdOrderId}}" should contain json:
    """
    {
      "_id": "{{createdOrderId}}",
      "transactions": [],
      "purchase": {
        "amount": 200,
        "currency": "EUR",
        "delivery_fee": 0,
        "down_payment": 0
      },
      "customer": {
       "birthdate": "1990-01-30T00:00:00.000Z",
       "phone": "+4912345678",
       "email": "test@test.com"
      },
      "cart": [
       {
         "brand": "Apple",
         "name": "Test Item",
         "identifier": "12345",
         "sku": "12345",
         "quantity": 1,
         "unit_price": 200,
         "tax_rate": 0,
         "total_amount": 200,
         "total_tax_amount": 0,
         "description": "test description",
         "image_url": "http://img.url",
         "product_url": "http://product.url",
         "category": "Electronics",
         "attributes": {
           "weight": 10,
           "dimensions": {
             "height": 5,
             "width": 15,
             "length": 10
           }
         }
       }
      ],
      "billing_address": {
       "first_name": "Grün",
       "last_name": "Ampel",
       "street": "Test 12",
       "street_number": "12",
       "salutation": "mr",
       "zip": "38889",
       "country": "DE",
       "city": "Elbingerode (Harz)",
       "organization_name": "Test",
       "street_name": "Test",
       "house_extension": "A"
      },
      "shipping_address": {
       "first_name": "Grün",
       "last_name": "Ampel",
       "street": "Test 12",
       "street_number": "12",
       "salutation": "mr",
       "zip": "38889",
       "country": "DE",
       "city": "Elbingerode (Harz)",
       "organization_name": "Test",
       "street_name": "Test",
       "house_extension": "A"
      },
      "reference": "as54a5sd45as4d",
      "business_id": "36bf8981-8827-4c0c-a645-02d9fc6d72c8",
      "created_at": "*",
      "updated_at": "*",
      "__v": 0
      }
    """
