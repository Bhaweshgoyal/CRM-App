const { sendNotification } = require("../Utils/notificationServiceClient");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model")
const UserService = require("../service/user.service");
const createTicket = async (data, userData) => {
  // userData it is the data of assignee who is assigning the ticket as well as we can say a admin
  // and data is that data to whom ticket is assigned or going to assign
  try {
    const ValidateAssignedTo = data.assignedTo
      ? await UserService.isValidActiveUser({ email: data.assignedTo })
      : true;

    if (ValidateAssignedTo.error) {
      return {
        error: {
          assignedTo: ValidateAssignedTo.error,
        },
      };
    }
    const ticketObj = {
      title: data.title,
      description: data.description,
      status: data.status,
      ticketPriority: data.ticketPriority,
      assignee: userData.email,
      assignedTo: data.assignedTo,
      clientName: data.clientName,
      createdBy: userData.email,
    };
    const ticketResponse = await Ticket.create(ticketObj);
    if (!ticketResponse) {
      return {
        err: "Server Error Occures",
      };
    }
    const userResponse = await UserService.addNewTicketCreatedByUser(
      userData.email,
      ticketResponse._id
    );
    if (userResponse.error) {
      return {
        error: userResponse.error,
      };
    }
    if (data.assignedTo) {
      const response = await UserService.addTicketAssignedToUser(
        data.assignedTo,
        ticketResponse._id
      );
      if (response.error) {
        return {
          error: response.error,
        };
      }
    }
    const sendNotificationEmailObj = {
      subject: "A new Ticket created " + ticketResponse.title,
      content: "Ticket Desciption " + ticketResponse.description,
      recepientEmails: [ticketResponse.createdBy, ticketResponse.assignedTo],
      requester: ticketResponse.createdBy,
      ticketId: ticketResponse._id,
    };
    sendNotification(
      sendNotificationEmailObj.subject,
      sendNotificationEmailObj.content,
      sendNotificationEmailObj.recepientEmails,
      sendNotificationEmailObj.requester,
      sendNotificationEmailObj.ticketId
    );
    return ticketResponse;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

const getTicketById = async (id) => {
  try {
    // console.log("reached to service of ticket")

    const response = await Ticket.findOne({ _id: id });
    console.log(response);
    if (!response) {
      return {
        error: "Invalid Id Provided",
      };
    }
    return response;
  } catch (err) {
    return err.message;
  }
};
const getAllTicketes = async () => {
  try {
    const response = await Ticket.find();
    if (response.length === 0) {
      return {
        err: "No ticket are created ",
      };
    }
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
const getAllTicketByStatus = async (data) => {
  try {
    const response = await Ticket.find({
      status: data.status,
    });
    if (response.length === 0) {
      return {
        err: "Invalid Status provided",
      };
    }
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getMyAllAssignedTickets = async (userInfo) => {
  try {
    const validator = await UserService.isValidActiveUser(userInfo);
    if (!validator || validator.error) {
      return {
        error: "Invalid User",
      };
    }
    const tickets = [];
    for (const ticketId of userInfo.ticketsAssigned) {
      const ticket = await Ticket.findOne({
        _id: ticketId,
      });
      tickets.push(ticket);
    }
    return tickets;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
const updateTicketById = async (id, ticketInfo, currentUser) => {
  try {
    const validateTicket = await UserService.validateTicketId(id);
    if (!validateTicket || validateTicket.error) {
      return {
        error: "invalid ticket id",
      };
    }
    const filter = { _id: id };

    const update = ticketInfo;
    if (update.assignee && update.assignee != currentUser.email) {
      return {
        error: "assingnee is Invalid",
      };
    }

    if (update.assignedTo && UserService.isValidActiveUser(update.assignedTo)) {
      update.assignee = currentUser.email;
    } else {
      return {
        error: "Invlid assigneTo User",
      };
    }
    // previous Assigned to user
    await User.findOneAndUpdate(
      { email: validateTicket.assignedTo },
      {
        $pull: {
          ticketsAssigned: validateTicket._id,
        },
      }
    );
    // new asigned to User
    await User.findOneAndUpdate(
      { email: update.assignedTo },
      {
        $push: {
          ticketAssigned: validateTicket._id,
        },
      }
    );
    const response = await Ticket.findOneAndUpdate(filter, update, {
      new: true,
    });
    const sendNotificationEmailObj = {
      subject: "A new Ticket updated " + response.title,
      content: "Ticket Desciption " + response.description,
      recepientEmails: [response.createdBy, response.assignedTo],
      requester: response.createdBy,
      ticketId: response._id,
    };
    sendNotification(
      sendNotificationEmailObj.subject,
      sendNotificationEmailObj.content,
      sendNotificationEmailObj.recepientEmails,
      sendNotificationEmailObj.requester,
      sendNotificationEmailObj.ticketId
    );
    return response;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
module.exports = {
  createTicket,
  getTicketById,
  getAllTicketes,
  getAllTicketByStatus,
  getMyAllAssignedTickets,
  updateTicketById,
};
