const {
  updateTicketyId,
  createTicket,
  getAllTicketes,
  getTicketById,
  getAllTicketByStatus,
  getMyAllAssignedTickets,
} = require("../controller/ticket.controller");
const {
  isUserAuthenticated,
  isAdmin,
} = require("../middleware/auth.validator");

const ticketRoute = (app) => {
  app.post("/crm/api/v1/ticket", isUserAuthenticated, createTicket);
  // we need to get all the tickets created by the current-user
  app.get(
    "/crm/api/v1/getMyAssignedTickets",
    isUserAuthenticated,
    getMyAllAssignedTickets
  );
  // we need all those tickts also which are assigned to the current-user

  // get all tickets
  app.get(
    "/crm/api/v1/Alltickets",
    isUserAuthenticated,
    isAdmin,
    getAllTicketes
  );

  // get all the tickets by status
  app.get(
    "/crm/api/v1/status/:status",
    isUserAuthenticated,
    isAdmin,
    getAllTicketByStatus
  );
  // get one tikcet by its id

  app.post("/crm/api/v1/ticket/:id", isUserAuthenticated, getTicketById);
// update the status of ticket by thier ID
  app.patch(
    "/crm/api/v1/ticket/updateTicketyId/:id",
    isUserAuthenticated,
    updateTicketyId
  );
};

module.exports = {
  ticketRoute,
};
