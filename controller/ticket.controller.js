const ticketService = require("../service/ticket.service");

const createTicket = async (req, res) => {
  try {
    const response = await ticketService.createTicket(req.body, req.user);
    if (response.err) {
      res.status(401).send(response.err);
    } else {
      res.status(201).send(
        response,
      );
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
      return res.status(401).send(
        response.error,
      );
    }

    return res.status(201).send(
     response,
    );
  } catch (err) {
    res.status(500).send({
      result: err,
    });
  }
};
const getAllTicketes = async (req, res) => {
  try {
    const response = await ticketService.getAllTicketes();
    if (response.err) {
      return res.status(401).send(
       response.err,
      );
    }
    return res.status(201).send(
     response
    );
  } catch (err) {
    console.log(err);
    return res.status(501).send({
      result: err,
    });
  }
};
const getAllTicketByStatus = async (req, res) => {
  try {
    const response = await ticketService.getAllTicketByStatus(req.params);
    if (response.err) {
      return res.status(401).send(
       response.err,
      );
    }
    return res.status(201).send(
       response,
    );
  } catch (err) {
    console.log(err);
    return res.status(501).send({
      result: err,
    });
  }
};
const getMyAllAssignedTickets = async (req, res) => {
  try {
    const response = await ticketService.getMyAllAssignedTickets(req.user);
    if (response.err) {
      return res.status(401).send(response.err);
    }
    return res.status(201).send(response);
  } catch (err) {
    console.log(err);
    return res.status(501).send({
      result: err,
    });
  }
};
const updateTicketById = async (req, res) => {
    try{
      const response = await ticketService.updateTicketById(
        req.params.id,
        req.body,
        req.user                      
      );

      if(response.error){
        return res.status(401).send({
          message : "Un-Successfull" , 
          result : response.error
        })
      }else{
        return res.status(201).send({
          message : "Successfull" ,
          result  : response
        })
      }
    }
    catch(err) { 
      console.log(err);
      return res.status(501).send({
        message : "Internal Server Error"  , 
        err : err
      })
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
