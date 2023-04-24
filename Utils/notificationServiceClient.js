let Client = require("node-rest-client").Client;
let client = new Client();

// set content-type header and data as json in args parameter
let notificationSerivceURL =
  "https://notification-service-ankb.onrender.com/notificationService/api/v1/notification";
exports.sendNotification = (
  subject,
  content,
  recepientEmails,
  requester,
  ticketId
) => {
  const reqBody = {
    subject,
    content,
    recepientEmails,
    requester,
    ticketId,
  };
  const headers = { "Content-Type": "application/json" };

  const args = {
    data: reqBody,
    headers: headers,
  };
  client.post(notificationSerivceURL, args, function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
  });
};
