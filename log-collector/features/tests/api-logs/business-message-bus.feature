Feature: Payment flow bus message handling
  Background:
  Scenario: api log created event
    When I publish in RabbitMQ channel "async_events_log_collector" message with json:
      """
      {
        "name": "api.logs.event.called",
        "payload": {
          "request": {
            "body": null,
            "headers": {
              "user-agent": "Artillery (https://artillery.io)",
              "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiOTQ3OTI0YzItNzJhZC00OTU2LTg4YmUtMTFhNGU3MzAxNGIxIiwiZW1haWwiOiJhcnRpbGxlcnlAcGF5ZXZlci5kZSIsImZpcnN0TmFtZSI6ImFydGlsbGVyeSIsImxhc3ROYW1lIjoidGVzdCIsInJvbGVzIjpbeyJuYW1lIjoibWVyY2hhbnQiLCJwZXJtaXNzaW9ucyI6W10sImFwcGxpY2F0aW9ucyI6W119LHsicGVybWlzc2lvbnMiOlsiYWQ4NjcwOGQtODU1MS00Y2FmLTg5Y2ItMDExNDBmMDk3Y2JmIl0sIm5hbWUiOiJhZG1pbi1ubyIsImFwcGxpY2F0aW9ucyI6W119LHsicGVybWlzc2lvbnMiOltdLCJuYW1lIjoidXNlciIsImFwcGxpY2F0aW9ucyI6W119XSwidG9rZW5JZCI6IjAyOGNhZjhjLTA5NWEtNGQ2MS04YTY2LTM1YTI4YzQyODk4YyIsInRva2VuVHlwZSI6MCwiZ2VuZXJhbEFjY291bnQiOnRydWUsImNsaWVudElkIjpudWxsLCJoYXNoIjoiOWNjZjRjYzZlNWFlZjRkZWM2OGYzY2E1Y2Q3MzNiZmM3NjUyNTMyZWRiNjk4YzVmYWJjZWE3NWZiZGNmN2M0OSIsImlzT3duZXIiOnRydWUsInJlbW92ZVByZXZpb3VzVG9rZW5zIjpmYWxzZX0sImlhdCI6MTY3NzE0NjY3MiwiZXhwIjoxNjc4MDQ2NjcyfQ.vi2F4C3fuhppKPX1AVoWC6HgCoqsORiWk7tm0TZ_-i8",
              "accept": "*/*",
              "postman-token": "6093d19d-5eb5-4ee9-82b4-526c5977f4d5",
              "host": "localhost:3001",
              "accept-encoding": "gzip, deflate, br",
              "connection": "keep-alive"
            },
            "hostname": "localhost:3001",
            "id": "req-2",
            "ip": "127.0.0.1",
            "ips": [
              "127.0.0.1"
            ],
            "log": {},
            "method": "GET",
            "params": {},
            "protocol": "http",
            "query": {
              "status": "success",
              "pageSize": "100",
              "sort": "status",
              "page": "1"
            },
            "routerPath": "/api/notification",
            "url": "/api/notification?status=success&pageSize=100&sort=status&page=1"
          },
          "response": {
            "data": {
              "content": "this is test"
            },
            "headers": {
              "vary": "Origin",
              "access-control-allow-origin": "*"
            },
            "statusCode": 201
          },
          "responseTime": 1152,
          "serviceName": "payment-notifications-microservice"
        }
      }
      """
    And process messages from RabbitMQ "async_events_log_collector" channel
    Then I look for model "ApiLog" by following JSON and remember as "logData":
      """
      {
        "serviceName": "payment-notifications-microservice"
      }
      """
    And stored value "logData" should contain json:
      """
      {
        "serviceName": "payment-notifications-microservice",
        "response": {
          "data": {
            "content": "this is test"
          }
        }
      }
      """

