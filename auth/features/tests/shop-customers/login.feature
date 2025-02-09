# Todo: Shop login not implemented

#Feature: login
#  Scenario: login as a shop customer
#    Given I use DB fixture "customers/users"
#    And I remember as "channelSetId" following value:
#    """
#    "48e2751b-9baa-41ea-b1da-235c3a629a8a"
#    """
#
#    When I send a POST request to "/api/login" with json:
#    """
#    {
#      "email": "user1@payever.de",
#      "plainPassword": "123456789",
#      "channelSetId": "{{channelSetId}}"
#    }
#    """
#
#    Then print last response
#    And the response status code should be 200
#    And the response should contain json:
#    """
#    {
#      "accessToken": "*",
#     "refreshToken": "*"
#   }
#   """
#
#  Scenario: shop login failure - channelSetId isn't set
#   Given I use DB fixture "customers/users"
#   And I remember as "channelSetId" following value:
#    """
#    "48e2751b-9baa-41ea-b1da-235c3a629a8a"
#    """
#
#    When I send a POST request to "/api/login" with json:
#    """
#    {
#      "email": "user1@payever.de",
#      "plainPassword": "123456789"
#    }
#    """
#
#    Then print last response
#    And the response status code should be 401
