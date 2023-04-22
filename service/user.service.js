const User = require("../models/user.model");
const userConstant = require("../Contants/user.constant");
const Ticket = require("../models/ticket.model");
const bcrypt = require("bcrypt");
const getAllUsers = async () => {
  try {
    const response = await User.find();
    if (response.length == 0) {
      return { err: "No users Exist" };
    }
    return response;
  } catch (err) {
    return err.message;
  }
};
const getUserByEmail = async (data) => {
  try {
    let userInfo = await User.findOne({ email: data.email });
    if (!userInfo) {
      return {
        err: "No User Found",
      };
    }
    return userInfo;
  } catch (err) {
    return err.message;
  }
};
const getUserByUserId = async (userId) => {
  try {
    const userInfo = await User.findOne({
      _id: userId,
    });
    if (!userInfo) {
      return {
        err: "No user Found",
      };
    }
    return userInfo;
  } catch (err) {
    return err;
  }
};
const updateUserType = async (data) => {
  try {
    let result;
    if (!(Object.values(userConstant.userType).indexOf(data.update.userType) >= 0)) {
      result = {
        error: "invalid user type provided",
      };
      return result;
    }
    if (data.userId) {
      // update the user Status on basis of userId
      result = await User.findOneAndUpdate(
        { _id: data.userId },
        { userType: data.update.userType }
      );
    } 
    else if (data.email) {
      result = await User.findOneAndUpdate(
        { email: data.email },
        { userType: data.update.userType }
      );
    }
    else {
      // return error
      result = {
        error: "required fields are not provided to update user type",
      };
    }
    return result;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

const isValidActiveUser = async (data) => {
  try {
    let userInfo = await getUserByEmail(data);
    if (userInfo && userInfo.userStatus == "approved") {
      return {
        user: userInfo,
      };
    } 
    else {
      return {
        error: "Invalid User",
      };
    }
  } catch (err) {
    console.log(err)
    return err.message;
  }
};
const addNewTicketCreatedByUser = async (userEmail, ticketId) => {
  try {
    const validateTicket = await validateTicketId(ticketId);
    if(!validateTicket || validateTicket.error){
        return {
          error : validateTicket.error
        }
    }
    const response = await User.updateOne(
      { email: userEmail },
      { $push: { ticketsCreated: ticketId } }
    );
    return response;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

const addTicketAssignedToUser = async (userEmail, ticketId) => {
  try {
    const isvalidateTicketId = await validateTicketId(ticketId);
    console.log(isvalidateTicketId);
    if (!isvalidateTicketId || isvalidateTicketId.error) {
      return {
        error: isvalidateTicketId.error,
      };
    }
    const response = await User.updateOne(
      { email: userEmail },
      { $push: { ticketsAssigned: ticketId } }
    );
    return response;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
const getAllAssignedTicketsOfUser  = async(userInfo) =>{
  try{
      const validatedUser = await isValidActiveUser(userInfo);
     if(!validatedUser || validatedUser.error){
          return {
              error: "Invalid User"
          }
      }
      const tickets = [];
      for(const ticketId of userInfo.ticketsAssigned){
          const ticket =  await Ticket.findOne({_id: ticketId});
         tickets.push(ticket)
      }
      return tickets; 
  } catch(err){
      console.log(err);
      return err.message;
  }
}
const validateTicketId = async (ticketId) => {
  try {
    console.log(ticketId);
    const response = await Ticket.findOne({ _id: ticketId });
    if (response) {
      return response;
    } else {
      return {
        error: "invalid ticket id",
      };
    }
  } catch (err) {
    console.log(err + "ERROR IN VALIDATE TICKET OCCURING");
    return err.message;
  }
};
const createUser = async (data) => {
  const response = {};
  try {
    const userObj = {
      name: data.name,
      email: data.email,
      userType: data.userType,
      password: data.password,
      userStatus: data.userStatus,
    };
    const newUser = await User.create(userObj);
    response.user = newUser;
    return response;
  } catch (err) {
    response.err = err.message;
    return response;
  }
};

const verifyUser = async (data) => {
  const response = {};
  try {
    const userData = await User.findOne({ email: data.email });
    //   email is null like user does not exist
    if (!userData) {
      response.err = "Invalid Email";
    } else {
      const result = bcrypt.compareSync(data.password, userData.password);
      if (result) {
        response.success = true;
      } else {
        response.err = "Invalid Password";
      }
    }
    return response;
  } catch (err) {
    console.log({ error: err.message });
    response.err = err.message;
    return response;
  }
};

module.exports = {
  createUser,
  verifyUser,
  getUserByEmail,
  getAllUsers,
  getUserByUserId,
  updateUserType,
  isValidActiveUser,
  addNewTicketCreatedByUser,
  addTicketAssignedToUser,
  validateTicketId,
  getAllAssignedTicketsOfUser
};
