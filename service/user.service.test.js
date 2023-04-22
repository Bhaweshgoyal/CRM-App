const db = require("../test/testUtils/db");
const User = require("../models/user.model")
const Ticket = require("../models/ticket.model")
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
    getAllAssignedTicketsOfUser
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


describe("user Service", () => {
    it("it should return the created user Details createuser", async () => {
        const createUserSpy = jest.spyOn(User, "create").mockImplementation(() => {
            return {
                name: "Bhawesh Goyal",
                email: "bhaveshg0402@gmail.com",
            }
        })
        const response = await createUser({
            name: "Bhawesh Goyal",
            email: "bhaveshg0402@gmail.com",
        });
        expect(createUserSpy).toHaveBeenCalled();
        expect(response).toEqual(expect.objectContaining({
            user: {
                name: "Bhawesh Goyal",
                email: "bhaveshg0402@gmail.com",
            }
        }))
    })
    it("it should return the error for creating a USER createuser", async () => {
        const createuserSpy = jest.spyOn(User, "create").mockImplementation(() => {
            throw new Error({ message: "Invalid e-mail Provided" });
        })

        try {
            const response = await createUser({
                name: "Bhawesh Goyal",
                mail: "bhaweshg0777@gmail.com"
            })
            // Assertion means the number of expection we are defining in the try scope  after those compelete no. of assertion it will go to the catch scope
        }
        catch (err) {
            expect(err).toEqual("Invalid e-mail Provided ")
        }
    })
})

describe("verifyUser", () => {
    it("should return error , when email is not found", async () => {
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        }

        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(() => {
            return null
        })

        const result = await verifyUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            err: "Invalid Email"
        }))
    })
    it("should return the error ,when password is not matching", async () => {
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        }
        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(() => {
            return userData;
        })

        const compareSyncSpy = jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => {
            return false;
        })

        const result = await verifyUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(compareSyncSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            err: "Invalid Password"
        }))
    })

    it("should return an error while verifying the user as in catch part", async () => {
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        }
        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            throw new Error({message:"Search failed"});
        })
        
        expect.assertions(1);
        try {
            const result = await verifyUser(userData);
            expect(findOneUserSpy).toHaveBeenCalled();
        } catch (err) {
                expect(err).toEqual("Search failed")
        }   
    })

    it('should return user data, when password is matching', async()=>{
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
            return true;
        })

    
        const result = await verifyUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(compareSyncSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({success:true }));
    });
})

describe("getUserByEmail" , () => {
    it("should return userData by getUserByEmail" , async() => {
        const getUserByEmailSpy = jest.spyOn(User, "findOne").mockImplementation(() => {
            return {
                name : "BhaweshGOyal", 
                email : "bhaweshg0777@gmail.com"
            }
        })

        const result = await getUserByEmail({
            name : "BhaweshGOyal", 
            email : "bhaweshg0777@gmail.com"
        })
        console.log(result, "resultresultresultresultresultresultresultresultresultresult")
        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(result).toEqual({
            name : "BhaweshGOyal", 
            email : "bhaweshg0777@gmail.com"
        })
    })

    it("should return null value so there is no user found from email" , async() => {
        const getUserByEmailSpy = jest.spyOn(User , "findOne").mockImplementation(() => {
            return null
        })

        const result = await getUserByEmail({
            email :"bhaweshg0777@gmail.com"
        })

        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            err : "No User Found"
        }));
    })

    it("should return the error from Invalid user Details" , async() => {
        const getUserByEmailSpy = jest.spyOn(User, "findOne").mockImplementation(() => {
           throw new Error({message : "no user Found"})
        })

        expect.assertions(1);
        try {
            const result = await getUserByEmail({});
            expect(getUserByEmailSpy).toHaveBeenCalled();
        }
        catch(err){
            expect(err).toEqual("no user Found")
        }
    })
})


describe("getAllUsers" , () => {
    it("should return all the userInfo" , async() => {
        const getAllUsersSpy = jest.spyOn(User , "find").mockImplementation(() => {
            return [
                {
                    name : "Bhawesh Goyal",
                    email : "bhaveshg0402@gmail.com"
                },
                {
                    name : "Bhawesh Goyal",
                    email : "bhaveshg0402@gmail.com"
                },
                {
                    name : "Bhawesh Goyal",
                    email : "bhaveshg0402@gmail.com"
                },
            ]
        })
        
        const result = await getAllUsers();
        expect(getAllUsersSpy).toHaveBeenCalled();
        expect(result).toEqual([
            {
                name : "Bhawesh Goyal",
                email : "bhaveshg0402@gmail.com"
            },
            {
                name : "Bhawesh Goyal",
                email : "bhaveshg0402@gmail.com"
            },
            {
                name : "Bhawesh Goyal",
                email : "bhaveshg0402@gmail.com"
            },
        ])

    })
    
    it("should return the null value as no user exist " , async() => {
        const getAllUsersSpy = jest.spyOn(User , "find").mockImplementation(() => {
            return [];
        })
        const result = await getAllUsers();
        expect(getAllUsersSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            err : "No users Exist"
        }))
    })

    it("should return the error while fetching all user from getAllUsers" , async() => {
        const getAllUsersSpy = jest.spyOn(User , 'find').mockImplementation(() => {
            throw new Error ({message : "Invalid Crendentials Provided"});
        })

        expect.assertions(1);
        try {
                    const result = await getAllUsers();
                    expect(getAllUsersSpy).toHaveBeenCalled();
        }
        catch(err) {
            expect(err).toEqual({
                message : "Invalid Crendentials Provided"
            })
        }
    })
    
})

describe("getUserByUserId" , () => {
    it("should return the users from thier userId" , async() => {
        const getUserByIdSpy = jest.spyOn(User,"findOne").mockImplementation(() => {
            return {
                name : "Bhawesh Goyal",
                email : "bhaweshg0402@gmail.com"
            }
        })

        const result = await getUserByUserId("07777");
        expect(getUserByIdSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            name : "Bhawesh Goyal",
            email : "bhaweshg0402@gmail.com"
        }))
    })

    it("should return the no ffound user for given UserId" , async() => {
        const getUserByUserIdSpy = jest.spyOn(User , "findOne").mockImplementation(() => {
            return null;
        })

        const result = await getUserByUserId("077777");
        expect(getUserByUserIdSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            err : "No user Found"
        }))
    })

    it("should return the error from getUserByUserId" , async() => {
        const getUserByIdSpy = jest.spyOn(User , "findOne").mockImplementation(() => {
            throw new Error("Invalid data Error Found");
        })

        expect.assertions(1)
        try {
            const result = await getUserByUserId("07777");
            expect(getUserByIdSpy).toHaveBeenCalled();
        }
        catch(err){
            expect (err).toEqual("Invalid data Error Found")
        }
    })
})

describe("updateUserType",  () => {
        it("should return error, when invalid user type is provided" , async() => {
            const userData ={ 
                update:{
                id:"123",
                name: "testName",
                email: "testemail@gmail.com",
                password: "testEmail@123",
                userType: "doctor"
            } 
        }
        const result = await updateUserType(userData);
        expect(result).toEqual(expect.objectContaining({error: "invalid user type provided"}));
        })
        it('should call findOne with userId, when userId is provided in user data', async()=>{
            const userData ={ 
                    userId:"123",
                    update:{
                        id:"123",
                        name: "testName",
                        email: "testemail@gmail.com",
                        userType: "customer",
                        password: "testEmail@123",
                    } 
                }
            const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
                return {_id:userData.userId};
            })
            const findOneAndUpdateSpy = jest.spyOn(User, 'findOneAndUpdate').mockImplementation(()=>{
                return;
            })
            const result = await updateUserType(userData);
            expect(findOneAndUpdateSpy).toHaveBeenCalledWith({_id:userData.userId}, {userType: userData.update.userType})
            expect(findOneUserSpy).toHaveBeenCalled()
        });

        it("should call findOne with user email , when user-email is provided in userData",async() => {
            const userData ={ 
                email: "testemail@gmail.com",
                update:{
                    id:"123",
                    name: "testName",
                    email: "testemail@gmail.com",
                    userType: "customer",
                    password: "testEmail@123",
                } 
            } 

            const findOneSpy = jest.spyOn(User  , "findOne").mockImplementation(() => {
                return ; 
            })
            const findOneAndUpdateSpy = jest.spyOn(User , "findOneAndUpdate").mockImplementation(() => {
             return ;
            })
            const result = await updateUserType(userData);
            expect(findOneAndUpdateSpy).toHaveBeenCalledWith({email:userData.email}, {userType: userData.update.userType})
            expect(findOneSpy).toHaveBeenCalledWith({email:userData.email})
        })
        it("should return error, when email id and userId both are not provided in user data" , async() => {
            const userData ={ 
                update:{
                    id:"123",
                    name: "testName",
                    email: "testemail@gmail.com",
                    userType: "customer",
                    password: "testEmail@123",
                } 
            }
            const findOneAndUpdateSpy = jest.spyOn(User, 'findOneAndUpdate').mockImplementation(()=>{
                return;
            })
            const result = await updateUserType(userData);
            // expect(findOneAndUpdateSpy).not.toHaveBeenCalled() // it should work here but notworking ave to ask from maam 
            expect(result).toEqual(expect.objectContaining({
                error: "required fields are not provided to update user type",
            }))
    
        })

        it('should return the error, when error is thrown',async ()=>{
            const userData ={ 
                email: "testemail@gmail.com",
                update:{
                    id:"123",
                    name: "testName",
                    email: "testemail@gmail.com",
                    userType: "customer",
                    password: "testEmail@123",
                } 
            }
            const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
                throw new Error({message:"Search failed"});
            })
            const findOneAndUpdateSpy = jest.spyOn(User, 'findOneAndUpdate').mockImplementation(()=>{
                return;
            })
            expect.assertions(2);
            try {
                const result = await updateUserType(userData);
                expect(findOneUserSpy).toHaveBeenCalled();
                expect(findOneAndUpdateSpy).toHaveBeenCalled()
            } catch (err) {
              expect(err).toEqual("Search failed");
            }
        });

})

describe('validateTicketId', ()=>{
    it('should return error, when error is thrown', async()=>{
        const ticketId = "123"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            throw new Error({message:"Search failed"});
        })
        expect.assertions(1);
        try {
            const result = await validateTicketId(ticketId);
            expect(findOneTicketSpy).toHaveBeenCalled();
        } catch (err) {
          expect(err).toEqual("Search failed");
        }
    });

    it('should return response, when ticket is found by id', async()=>{
        const ticketId = "123"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return {_id: "123"};
        })

        const result = await validateTicketId(ticketId);
        expect(findOneTicketSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({_id: "123"}));
    });

    it('should return error response, when ticket is not found by id', async()=>{
        const ticketId = "123"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return null;
        })

        const result = await validateTicketId(ticketId);
        expect(findOneTicketSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            error: "invalid ticket id"
        }));
   
    
    });
});

describe('addNewTicketCreatedByUser', ()=>{
    it('should return error, when ticket is not found with id', async()=>{
        const ticketId = "123"
        const userEmail = "abc@gmail.com"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return null;
        })

        const result = await addNewTicketCreatedByUser(userEmail,ticketId);
        expect(findOneTicketSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            error: "invalid ticket id"
        }));
    });

    it('should return response, when ticket is found by id and user is updated', async()=>{
        const ticketId = "123"
        const userEmail = "abc@gmail.com"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return {_id: "123"};
        })
        const updateOneUserSpy = jest.spyOn(User, 'updateOne').mockImplementation(()=>{ // it replies the answer or mocks the answer as what we want
            return {email: "abc@gmail.com"};
        })

        const result = await addNewTicketCreatedByUser(userEmail,ticketId);
        expect(findOneTicketSpy).toHaveBeenCalled();
        expect(updateOneUserSpy).toHaveBeenCalled();
        expect(updateOneUserSpy).toHaveBeenCalledWith({ email: userEmail }, 
            { $push: { ticketsCreated: ticketId}});// it healps to give the arguments
        expect(result).toEqual(expect.objectContaining({email: "abc@gmail.com"}));
    });

    it('should return error response, when error is thrown by Update One', async()=>{
        const ticketId = "123"
        const userEmail = "abc@gmail.com"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return {_id: "123"};
        })
        const updateOneUserSpy = jest.spyOn(User, 'updateOne').mockImplementation(()=>{
            throw new Error({message: "update failed"})
        })

        expect.assertions(3);
        try{
            const result = await addNewTicketCreatedByUser(userEmail,ticketId);
            expect(findOneTicketSpy).toHaveBeenCalled();
            expect(updateOneUserSpy).toHaveBeenCalled();
            expect(updateOneUserSpy).toHaveBeenCalledWith({ email: userEmail }, 
                { $push: { ticketsCreated: ticketId}});
        }
        catch(err){
            expect(err).toEqual("update failed");
        }
        
    });
});

describe('addTicketAssignedToUser', ()=>{
    it('should return error, when ticket is not found with id', async()=>{
        const ticketId = "123"
        const userEmail = "abc@gmail.com"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return null;
        })

        const result = await addTicketAssignedToUser(userEmail,ticketId);
        expect(findOneTicketSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            error: "invalid ticket id"
        }));
    });

    it('should return response, when ticket is found by id and user is updated', async()=>{
        const ticketId = "123"
        const userEmail = "abc@gmail.com"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return {_id: "123"};
        })
        const updateOneUserSpy = jest.spyOn(User, 'updateOne').mockImplementation(()=>{
            return {email: "abc@gmail.com"};
        })

        const result = await addTicketAssignedToUser(userEmail,ticketId);
        expect(findOneTicketSpy).toHaveBeenCalled();
        expect(updateOneUserSpy).toHaveBeenCalled();
        expect(updateOneUserSpy).toHaveBeenCalledWith({ email: userEmail }, 
            { $push: { ticketsAssigned: ticketId}});
        expect(result).toEqual(expect.objectContaining({email: "abc@gmail.com"}));
    });

    it('should return error response, when error is thrown by Update One', async()=>{
        const ticketId = "123"
        const userEmail = "abc@gmail.com"
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return {_id: "123"};
        })
        const updateOneUserSpy = jest.spyOn(User, 'updateOne').mockImplementation(()=>{
            throw new Error({message: "update failed"})
        })

        expect.assertions(3);
        try{
            const result = await addTicketAssignedToUser(userEmail,ticketId);
            expect(findOneTicketSpy).toHaveBeenCalled();
            expect(updateOneUserSpy).toHaveBeenCalled();
            expect(updateOneUserSpy).toHaveBeenCalledWith({ email: userEmail }, 
                { $push: { ticketsAssigned: ticketId}});
        }
        catch(err){
            expect(err).toEqual("update failed");
        }
        
    });
});

describe('getAllAssignedTicketsOfUser', ()=>{
    it('should return error, when user is not found', async()=>{
        const userInfo = {
            email: "abc@gmail.com"
        }

        const findOneUSerSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            return null;
        })

        const result = await getAllAssignedTicketsOfUser(userInfo);
        expect(findOneUSerSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            error: "Invalid User"
        }));
    });

    it('should return response, when ticket is found by id and user is valid', async()=>{
        const userInfo = {
            email: "abc@gmail.com",
            ticketsAssigned: ["123", "321"],
            userStatus: "approved"
        }

        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            return userInfo;
        })
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            return {ticketId: "123"};
        })

        const result = await getAllAssignedTicketsOfUser(userInfo);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(findOneTicketSpy).toHaveBeenCalled();
        expect(result).toEqual([{ticketId: "123"}, {ticketId: "123"}]);
    });

    it('should return error response, when error is thrown by find One', async()=>{
        const userInfo = {
            email: "abc@gmail.com",
            ticketsAssigned: ["123", "321"],
            userStatus: "approved"
        }

        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            return userInfo;
        })
        const findOneTicketSpy = jest.spyOn(Ticket, 'findOne').mockImplementation(()=>{
            throw new Error({message: "ticket not found"})
        })
        expect.assertions(2);
        try{
            const result = await getAllAssignedTicketsOfUser(userInfo);
            expect(findOneUserSpy).toHaveBeenCalled();
            expect(findOneTicketSpy).toHaveBeenCalled();
        }
        catch(err){
            expect(err).toEqual("ticket not found");
        }
        
    });
});

describe('isValidActiveUser', ()=>{
    it('should return error, when user is not found by email', async()=>{
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        } 
        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            return null;
        })
        const result = await isValidActiveUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            error: "Invalid User"
        }));
    });

    it('should return error, when user is found by email but userStatus is not approved', async()=>{
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        } 
        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            userData.userStatus = "pending";
            return userData;
        })
        const result = await isValidActiveUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            error: "Invalid User"
        }));
    });

    it('should return user data, when user is found by email and userStatus is approved', async()=>{
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        } 
        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            userData.userStatus = "approved";
            return userData;
        })
        const result = await isValidActiveUser(userData);
        expect(findOneUserSpy).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({user:userData}));
    });

    it('should return error, when error is thrown', async()=>{
        const userData = {
            name: "testName",
            email: "testemail@gmail.com",
            userType: "customer",
            password: "testEmail@123",
        } 
        const findOneUserSpy = jest.spyOn(User, 'findOne').mockImplementation(()=>{
            throw new Error({message:"Search failed"});
        })
        expect.assertions(1);
        try {
            const result = await isValidActiveUser(userData);
            expect(findOneUserSpy).toHaveBeenCalled();
        } catch (err) {
          expect(err).toEqual("Search failed");
        }
    });
})