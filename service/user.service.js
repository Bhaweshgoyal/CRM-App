const User = require("../models/user.model");
const userConstant = require("../Contants/user.constant");
const Ticket  = require("../models/ticket.model");
const getAllUsers = async () => {
  try {
    const response = await User.find();
    if (!response) {
      return "No users Exist";
    }
    return response;
  } catch (err) {
    return err;
  }
};
const getUserByEmail = async (data) => {
  try {
    let userInfo = await User.findOne({ email: data.email });
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

    return userInfo;
  } catch (err) {
    return err;
  }
};
const updateUserType = async (data) => {
  try {
    let result;
    if (
      !(Object.values(userConstant.userType).indexOf(data.update.userType) >= 0)
    ) {
      result = {
        error: "Invalid user type provided",
      };
      return result;
    }
    if (data.userId) {
      // update the user Status on basis of userId
      result = await User.findOneAndUpdate(
        { _id: data.userId },
        { userType: data.update.userType }
      );
    } else if (data.email) {
      result = await User.findOneAndUpdate(
        { email: data.email },
        { userType: data.update.userType }
      );
    } else {
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
    let userInfo = await getUserByEmail(data)
    if (userInfo && userInfo.userStatus == "approved") {
      return {
        email: userInfo,
      };
    } else {
      return {
        error: "Invalid User",
      };
    }
  } catch (err) {
    return err.message;
  }
};
const addNewTicketCreatedByUser = async (userEmail, ticketId) => {
  try {
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
    console.log(isvalidateTicketId)
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
const validateTicketId = async(ticketId) =>{
  try{
      console.log(ticketId)
      const response = await Ticket.findOne({_id: ticketId});
      if(response){
          return response;
      }
      else{
          return {
              error: "invalid ticket id"
          }
      }
  }
  catch(err){
      console.log(err + "ERROR IN VALIDATE TICKET OCCURING");
      return err.message;
  }
}

module.exports = {
  getUserByEmail,
  getAllUsers,
  getUserByUserId,
  updateUserType,
  isValidActiveUser,
  addNewTicketCreatedByUser,
  addTicketAssignedToUser,
  validateTicketId,
};
