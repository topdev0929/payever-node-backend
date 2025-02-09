@order-bus-message
Feature: Process orders from rabbit events
  Scenario: Create order from rabbit event
    Given I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "transactions.event.order.created",
      "payload": {
         "id": "5a688ce2-efc0-4883-8560-7c1a786bff34",
         "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
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
         "created_at": "2022-04-15T07:32:32+00:00",
         "updated_at": "2022-04-15T07:32:32+00:00"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then I look for model "Order" by following JSON and remember as "createdOrder":
    """
    {
      "_id": "5a688ce2-efc0-4883-8560-7c1a786bff34"
    }
    """
    Then print storage key "createdOrder"
    Then model "Order" with id "{{createdOrder._id}}" should contain json:
    """
    {
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
       "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
       "created_at": "2022-04-15T07:32:32.000Z",
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
       "purchase": {
         "amount": 200,
         "currency": "EUR",
         "delivery_fee": 0,
         "down_payment": 0
       },
       "reference": "as54a5sd45as4d",
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
       "updated_at": "2022-04-15T07:32:32.000Z"
    }
    """
