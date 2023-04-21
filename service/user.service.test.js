const db = require("../test/testUtils/db");
const User = require("../models/user.model")
const {
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
} = require("./user.service");
const bcrypt = require("bcrypt");
beforeAll(async () => {
    await db.connect();
});

afterAll(async () => {
    await db.closeDatabase();
});

afterEach(async () => {
    await db.clearDatabase();
});


describe("user Service" , () => {
    it("it should return the created user Details createuser" , async() => {
        const createUserSpy = jest.spyOn(User , "create").mockImplementation(() => {
            return {
                name :"Bhawesh Goyal" , 
                email : "bhaveshg0402@gmail.com" , 
            }
        })
        const response =  await createUser({
            name :"Bhawesh Goyal" , 
            email : "bhaveshg0402@gmail.com" , 
        });
        expect(createUserSpy).toHaveBeenCalled();
        expect(response).toEqual(expect.objectContaining({
            user : {
                name :"Bhawesh Goyal" , 
                email : "bhaveshg0402@gmail.com" , 
            }
        }))
    })
    it("it should return the error for creating a USER createuser" , async() => {
        const createuserSpy = jest.spyOn(User , "create").mockImplementation(() => {
            throw new Error({message : "Invalid e-mail Provided"});
        })

      try{
        const response = await createUser({
            name : "Bhawesh Goyal",
            mail : "bhaweshg0777@gmail.com"
        })
        // Assertion means the number of expection we are defining in the try scope  after those compelete no. of assertion it will go to the catch scope
      }
      catch(err) {
        expect(err).toEqual("Invalid e-mail Provided ")
      }
    })
})

describe("verifyUser" , () => {
    it("should return error , when email is not found" , async() => {
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        }

        const findOneUserSpy = jest.spyOn(User , 'findOne').mockImplementation(() => {
            return null
        })

        const result = await verifyUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            err : "Invalid Email"
        }))
    })
    it("should return the error ,when password is not matching" ,async() => {
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        }
        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            return userData;
        })

        const compareSyncSpy = jest.spyOn(bcrypt, 'compareSync').mockImplementation(()=>{
            return false;
        })

        const result = await verifyUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(compareSyncSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            err : "Invalid Password"
        }))
    })
})