const userService = require("../service/user.service");

const getAllUsers = async (req, res) => {
  try {
    const usersInfo = await userService.getAllUsers();
  if(usersInfo.err){
    return res.status(401).send({
      result : usersInfo.err
    })
  }
  return  res.status(201).send({
      result: usersInfo,
    });
  
  } catch (err) {
   return res.status(501).send({
      result: err,
    });
  }
};

const getUserByEmail = async (req, res) => {
  try{
    let response = await userService.getUserByEmail(req.params);
    if (response.err) {
      return res.status(401).send({result: response.err});
    }
    return res.status(201).send({
      result: response,
    });
  }
  catch(err){

  }
  
 
};

const getUserByUserId = async (req, res) => {
  try {
    const response = await userService.getUserByUserId(req.params.userId);

    if(response.err){
      return res.status(401).send({
        result : response.err
      })
    }

    res.status(201).send({
      result: response,
    });
  } catch (err) {
    return res.status(500).send({
      result: err,
    });
  }
};
const updateUserType = async (req, res) => {
  try {
    console.log(req.body)
    const response = await userService.updateUserType(req.body);
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
module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserByUserId,
  updateUserType
};
