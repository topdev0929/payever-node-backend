@address
Feature: Address search
  Background:
    Given I remember as "tokenId" following value:
    """
    "f24b7a60-69bf-43bd-bc2e-3859390a0f0e"
    """
    Given I generate a guest token remember it as "guestHash"
    Given I generate an access token using the following data and remember it as "guestToken":
    """
    {
      "guestHash": "{{guestHash}}",
      "roles": [
        {
          "name": "guest",
          "permissions": []
        }
      ],
      "tokenId": "{{tokenId}}"
    }
    """

  Scenario: Address autocomplete
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        "params": {
          "input": "Hamburg",
          "key": "AIzaSyArxhX7-SOthRg5cPbtnJsEujGoMpXxnxY",
          "sessiontoken": "12345",
          "types": "address"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "predictions": [
              {
                  "description": "Hamburgo, Juárez, Mexico City, CDMX, Mexico",
                  "matched_substrings": [
                      {
                          "length": 7,
                          "offset": 0
                      }
                  ],
                  "place_id": "EixIYW1idXJnbywgSnXDoXJleiwgTWV4aWNvIENpdHksIENETVgsIE1leGljbyIuKiwKFAoSCdtCYHM2_9GFET28Jd6JjIe5EhQKEgkHBIpvNP_RhREvxwXtzs1y2Q",
                  "reference": "EixIYW1idXJnbywgSnXDoXJleiwgTWV4aWNvIENpdHksIENETVgsIE1leGljbyIuKiwKFAoSCdtCYHM2_9GFET28Jd6JjIe5EhQKEgkHBIpvNP_RhREvxwXtzs1y2Q",
                  "structured_formatting": {
                      "main_text": "Hamburgo",
                      "main_text_matched_substrings": [
                          {
                              "length": 7,
                              "offset": 0
                          }
                      ],
                      "secondary_text": "Juárez, Mexico City, CDMX, Mexico"
                  },
                  "terms": [
                      {
                          "offset": 0,
                          "value": "Hamburgo"
                      },
                      {
                          "offset": 10,
                          "value": "Juárez"
                      },
                      {
                          "offset": 18,
                          "value": "Mexico City"
                      },
                      {
                          "offset": 31,
                          "value": "CDMX"
                      },
                      {
                          "offset": 37,
                          "value": "Mexico"
                      }
                  ],
                  "types": [
                      "route",
                      "geocode"
                  ]
              },
              {
                  "description": "Hamburger Straße, Hamburg, Germany",
                  "matched_substrings": [
                      {
                          "length": 7,
                          "offset": 0
                      }
                  ],
                  "place_id": "EiNIYW1idXJnZXIgU3RyYcOfZSwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
                  "reference": "EiNIYW1idXJnZXIgU3RyYcOfZSwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
                  "structured_formatting": {
                      "main_text": "Hamburger Straße",
                      "main_text_matched_substrings": [
                          {
                              "length": 7,
                              "offset": 0
                          }
                      ],
                      "secondary_text": "Hamburg, Germany"
                  },
                  "terms": [
                      {
                          "offset": 0,
                          "value": "Hamburger Straße"
                      },
                      {
                          "offset": 18,
                          "value": "Hamburg"
                      },
                      {
                          "offset": 27,
                          "value": "Germany"
                      }
                  ],
                  "types": [
                      "route",
                      "geocode"
                  ]
              },
              {
                  "description": "Hamburger Berg, Hamburg, Germany",
                  "matched_substrings": [
                      {
                          "length": 7,
                          "offset": 0
                      }
                  ],
                  "place_id": "EiBIYW1idXJnZXIgQmVyZywgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWNFZgNuj7FHEY_6TJayR3iLEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
                  "reference": "EiBIYW1idXJnZXIgQmVyZywgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWNFZgNuj7FHEY_6TJayR3iLEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
                  "structured_formatting": {
                      "main_text": "Hamburger Berg",
                      "main_text_matched_substrings": [
                          {
                              "length": 7,
                              "offset": 0
                          }
                      ],
                      "secondary_text": "Hamburg, Germany"
                  },
                  "terms": [
                      {
                          "offset": 0,
                          "value": "Hamburger Berg"
                      },
                      {
                          "offset": 16,
                          "value": "Hamburg"
                      },
                      {
                          "offset": 25,
                          "value": "Germany"
                      }
                  ],
                  "types": [
                      "route",
                      "geocode"
                  ]
              },
              {
                  "description": "Hamburger Straße, Braunschweig, Germany",
                  "matched_substrings": [
                      {
                          "length": 7,
                          "offset": 0
                      }
                  ],
                  "place_id": "EihIYW1idXJnZXIgU3RyYcOfZSwgQnJhdW5zY2h3ZWlnLCBHZXJtYW55Ii4qLAoUChIJhRENk4X2r0cRYKhxWoBJqSgSFAoSCTtmAIrV9a9HEbA6rJRtrCUE",
                  "reference": "EihIYW1idXJnZXIgU3RyYcOfZSwgQnJhdW5zY2h3ZWlnLCBHZXJtYW55Ii4qLAoUChIJhRENk4X2r0cRYKhxWoBJqSgSFAoSCTtmAIrV9a9HEbA6rJRtrCUE",
                  "structured_formatting": {
                      "main_text": "Hamburger Straße",
                      "main_text_matched_substrings": [
                          {
                              "length": 7,
                              "offset": 0
                          }
                      ],
                      "secondary_text": "Braunschweig, Germany"
                  },
                  "terms": [
                      {
                          "offset": 0,
                          "value": "Hamburger Straße"
                      },
                      {
                          "offset": 18,
                          "value": "Braunschweig"
                      },
                      {
                          "offset": 32,
                          "value": "Germany"
                      }
                  ],
                  "types": [
                      "route",
                      "geocode"
                  ]
              },
              {
                  "description": "Hamburger Straße, Dresden, Germany",
                  "matched_substrings": [
                      {
                          "length": 7,
                          "offset": 0
                      }
                  ],
                  "place_id": "EiNIYW1idXJnZXIgU3RyYcOfZSwgRHJlc2RlbiwgR2VybWFueSIuKiwKFAoSCWGtwwCRzwlHEQ3pm4YS40HqEhQKEgmp1hoQKc8JRxGw_ohCy7EhBA",
                  "reference": "EiNIYW1idXJnZXIgU3RyYcOfZSwgRHJlc2RlbiwgR2VybWFueSIuKiwKFAoSCWGtwwCRzwlHEQ3pm4YS40HqEhQKEgmp1hoQKc8JRxGw_ohCy7EhBA",
                  "structured_formatting": {
                      "main_text": "Hamburger Straße",
                      "main_text_matched_substrings": [
                          {
                              "length": 7,
                              "offset": 0
                          }
                      ],
                      "secondary_text": "Dresden, Germany"
                  },
                  "terms": [
                      {
                          "offset": 0,
                          "value": "Hamburger Straße"
                      },
                      {
                          "offset": 18,
                          "value": "Dresden"
                      },
                      {
                          "offset": 27,
                          "value": "Germany"
                      }
                  ],
                  "types": [
                      "route",
                      "geocode"
                  ]
              }
          ],
          "status": "OK"
        }
      }
    }
    """
    When I send a GET request to "/api/flow/v1/address/search?q=Hamburg&sessionId=12345"
    And the response status code should be 200
    And print last response
    And the response should contain json:
    """
    [
     {
       "address": "Hamburgo, Juárez, Mexico City, CDMX, Mexico",
       "placeId": "EixIYW1idXJnbywgSnXDoXJleiwgTWV4aWNvIENpdHksIENETVgsIE1leGljbyIuKiwKFAoSCdtCYHM2_9GFET28Jd6JjIe5EhQKEgkHBIpvNP_RhREvxwXtzs1y2Q"
     },
     {
       "address": "Hamburger Straße, Hamburg, Germany",
       "placeId": "EiNIYW1idXJnZXIgU3RyYcOfZSwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA"
     },
     {
       "address": "Hamburger Berg, Hamburg, Germany",
       "placeId": "EiBIYW1idXJnZXIgQmVyZywgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWNFZgNuj7FHEY_6TJayR3iLEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA"
     },
     {
       "address": "Hamburger Straße, Braunschweig, Germany",
       "placeId": "EihIYW1idXJnZXIgU3RyYcOfZSwgQnJhdW5zY2h3ZWlnLCBHZXJtYW55Ii4qLAoUChIJhRENk4X2r0cRYKhxWoBJqSgSFAoSCTtmAIrV9a9HEbA6rJRtrCUE"
     },
     {
       "address": "Hamburger Straße, Dresden, Germany",
       "placeId": "EiNIYW1idXJnZXIgU3RyYcOfZSwgRHJlc2RlbiwgR2VybWFueSIuKiwKFAoSCWGtwwCRzwlHEQ3pm4YS40HqEhQKEgmp1hoQKc8JRxGw_ohCy7EhBA"
     }
    ]
    """

  Scenario: Get place details
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://maps.googleapis.com/maps/api/place/details/json",
        "params": {
          "key": "AIzaSyArxhX7-SOthRg5cPbtnJsEujGoMpXxnxY",
          "place_id": "EiNIYW1idXJnZXIgU3RyYcOfZSwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
          "sessiontoken": "12345"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "status": "OK",
          "result": {
             "address_components": [
               {
                 "long_name": "Hamburger Straße",
                 "short_name": "Hamburger Str.",
                 "types": [
                   "route"
                 ]
               },
               {
                 "long_name": "Hamburg-Nord",
                 "short_name": "Hamburg-Nord",
                 "types": [
                   "sublocality_level_1",
                   "sublocality",
                   "political"
                 ]
               },
               {
                 "long_name": "Hamburg",
                 "short_name": "Hamburg",
                 "types": [
                   "locality",
                   "political"
                 ]
               },
               {
                 "long_name": "Hamburg",
                 "short_name": "Hamburg",
                 "types": [
                   "administrative_area_level_3",
                   "political"
                 ]
               },
               {
                 "long_name": "Hamburg",
                 "short_name": "HH",
                 "types": [
                   "administrative_area_level_1",
                   "political"
                 ]
               },
               {
                 "long_name": "Germany",
                 "short_name": "DE",
                 "types": [
                   "country",
                   "political"
                 ]
               }
             ],
             "adr_address": "<span class=\"street-address\">Hamburger Str.</span>, <span class=\"locality\">Hamburg</span>, <span class=\"country-name\">Germany</span>",
             "formatted_address": "Hamburger Str., Hamburg, Germany",
             "geometry": {
               "location": {
                 "lat": 53.5745939,
                 "lng": 10.034466
               },
               "viewport": {
                 "northeast": {
                   "lat": 53.57594288029149,
                   "lng": 10.0358149802915
                 },
                 "southwest": {
                   "lat": 53.57324491970849,
                   "lng": 10.0331170197085
                 }
               }
             },
             "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
             "icon_background_color": "#7B9EB0",
             "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
             "name": "Hamburger Straße",
             "place_id": "EiBIYW1idXJnZXIgU3RyLiwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
             "reference": "EiBIYW1idXJnZXIgU3RyLiwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
             "types": [
               "route"
             ],
             "url": "https://maps.google.com/?q=Hamburger+Str.,+Hamburg,+Germany&ftid=0x47b18ecb149b4969:0x65ff03ff386caba0",
             "utc_offset": 120,
             "vicinity": "Hamburg-Nord"
           }
         }
      }
    }
    """
    When I send a GET request to "/api/flow/v1/address/details/EiNIYW1idXJnZXIgU3RyYcOfZSwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA?sessionId=12345"
    And the response status code should be 200
    And print last response
    And the response should contain json:
    """
    {
       "address_components": [
         {
           "long_name": "Hamburger Straße",
           "short_name": "Hamburger Str.",
           "types": [
             "route"
           ]
         },
         {
           "long_name": "Hamburg-Nord",
           "short_name": "Hamburg-Nord",
           "types": [
             "sublocality_level_1",
             "sublocality",
             "political"
           ]
         },
         {
           "long_name": "Hamburg",
           "short_name": "Hamburg",
           "types": [
             "locality",
             "political"
           ]
         },
         {
           "long_name": "Hamburg",
           "short_name": "Hamburg",
           "types": [
             "administrative_area_level_3",
             "political"
           ]
         },
         {
           "long_name": "Hamburg",
           "short_name": "HH",
           "types": [
             "administrative_area_level_1",
             "political"
           ]
         },
         {
           "long_name": "Germany",
           "short_name": "DE",
           "types": [
             "country",
             "political"
           ]
         }
       ],
       "adr_address": "<span class=\"street-address\">Hamburger Str.</span>, <span class=\"locality\">Hamburg</span>, <span class=\"country-name\">Germany</span>",
       "formatted_address": "Hamburger Str., Hamburg, Germany",
       "geometry": {
         "location": {
           "lat": 53.5745939,
           "lng": 10.034466
         },
         "viewport": {
           "northeast": {
             "lat": 53.57594288029149,
             "lng": 10.0358149802915
           },
           "southwest": {
             "lat": 53.57324491970849,
             "lng": 10.0331170197085
           }
         }
       },
       "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
       "icon_background_color": "#7B9EB0",
       "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
       "name": "Hamburger Straße",
       "place_id": "EiBIYW1idXJnZXIgU3RyLiwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
       "reference": "EiBIYW1idXJnZXIgU3RyLiwgSGFtYnVyZywgR2VybWFueSIuKiwKFAoSCWlJmxTLjrFHEaCrbDj_A_9lEhQKEgm5Exh-g2GxRxGgOtZ78j0mBA",
       "types": [
         "route"
       ],
       "url": "https://maps.google.com/?q=Hamburger+Str.,+Hamburg,+Germany&ftid=0x47b18ecb149b4969:0x65ff03ff386caba0",
       "utc_offset": 120,
       "vicinity": "Hamburg-Nord"
     }
    """
