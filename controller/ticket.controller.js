const ticketService = require("../service/ticket.service");

const createTicket = async (req, res) => {
  try {
    const response = await ticketService.createTicket(req.body, req.user);
    if (response.err) {
      res.status(401).send({
        result: response.err,
      });
    } else {
      res.status(201).send({
        result: response,
      });
    }
  } catch (err) {
    res.status(500).send({
      result: err,
    });
  }
};
const getTicketById = async (req, res) => {
  try {
    // console.log("reached to controler of ticket");

    const response = await ticketService.getTicketById(req.params.id);
    if (response.error) {
      return res.status(401).json({
        result: response.error,
      });
    }

    return res.status(201).json({
      result: response,
    });
  } catch (err) {
    res.status(500).json({
      result: err,
    });
  }
};
const getAllTicketes = async (req, res) => {
  try {
    const response = await ticketService.getAllTicketes();
    if (response.err) {
      return res.status(401).json({
        result: response.err,
      });
    }
    return res.status(201).json({
      result: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({
      result: err,
    });
  }
};
const getAllTicketByStatus = async (req, res) => {
  try {
    const response = await ticketService.getAllTicketByStatus(req.params);
    if (response.err) {
      return res.status(401).json({
        result: response.err,
      });
    }
    return res.status(201).json({
      result: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({
      result: err,
    });
  }
};
const getMyAllAssignedTickets = async (req, res) => {
  try {
    const response = await ticketService.getMyAllAssignedTickets(req.user);
    if (response.err) {
      return res.status(401).json({
        result: response.err,
      });
    }
    return res.status(201).json({
      result: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({
      result: err,
    });
  }
};
const updateTicketyId = async (req, res) => {
  const response = await ticketService.updateTicketyId(
    req.params.id,
    req.body,
    req.user
  );
};
module.exports = {
  createTicket,
  getTicketById,
  getAllTicketes,
  getAllTicketByStatus,
  getMyAllAssignedTickets,
  updateTicketyId,
};
