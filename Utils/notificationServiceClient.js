//Example POST method invocation
let Client = require("node-rest-client").Client;

let client = new Client();

// set content-type header and data as json in args parameter
let args = {
  data: {
    subject: "A notification from our own Notification service",
    content: "You have recived a new Notification from our own App",
    recepientEmails: [
      "bhaweshg0777@gmail.com",
      "bhaveshg0402@gmail.com",
      "bhawesh.kommunicate@gmail.com",
    ],
    requester: "bhaweshg0402@gmail.com",
    ticketId: "3",
  },
  headers: { "Content-Type": "application/json" },
};

client.post(
  "http://localhost:8080/notificationService/api/v1/notification",
  args,
  function (data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
  }
);

// exports.sendNotification = (
//   subject,
//   content,
//   recepientEmails,
//   requester,
//   ticketId
// ) => {
//   const reqBody = {
//     subject,
//     content,
//     recepientEmails,
//     requester,
//     ticketId,
//   };
//   const headers = { "Content-Type": "application/json" };

//   const args = {
//     data: reqBody,
//     headers: headers,
//   };
//   client.post(
//     "http://169.254.57.70/16:8080/notificationService/api/v1/notification",
//     args,
//     function (data, response) {
//       // parsed response body as js object
//       console.log(data);
//       // raw response
//       console.log(response);
//     }
//   );
// };
