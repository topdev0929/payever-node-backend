Feature: Mailer controller
  Background: 
    Given I remember as "businessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I remember as "businessIdTwo" following value:
      """
      "af94664f-087f-43f8-97bf-4d2205bedc76"
      """
    Given I use DB fixture "employee"


   Scenario: Mark invite mail as sent
    When I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "mailer.event.business.sent",
        "payload": {
          "to": "email@test.com",
          "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
          "templateName": "staff_invitation_new"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    And look for model "Employee" by following JSON and remember as "employee":
      """
      { "email": "email@test.com" }
      """
    And stored value "employee" should contain json:
      """
      { 
        "_id": "*",
        "email": "email@test.com",
        "positions": [
          {
            "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
            "status": 1,
            "positionType": "Admin",
            "inviteMailSent": true
          },
          {
            "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
            "status": 1,
            "positionType": "Admin"
          }
        ]
      }
      """

