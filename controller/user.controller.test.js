const userService = require("../service/user.service");
const { mockRequest, mockResponse } = require("../test/testUtils/interceptor");
const {
    getAllUsers,
    getUserByEmail,
    getUserByUserId,
    updateUserType
} = require("./user.controller");


describe("User Controllers", () => {
    it("should give all the user and their Information from getAllUser", async () => {
        const getAllUSerSpy = jest.spyOn(userService, "getAllUsers").mockImplementation(() => {
            return [
                {
                    userName: "Bhawesh Goyal",
                    email: "bhaveshg0777@gmail.com"
                },
                {
                    userName: "Bhawesh Goyal",
                    email: "bhaveshg0777@gmail.com"
                },
                {
                    userName: "Bhawesh Goyal",
                    email: "bhaveshg0777@gmail.com"
                },
            ]
        })

        const req = mockRequest();
        const res = mockResponse();

        await getAllUsers(req,res);
        expect(getAllUSerSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith({
            result :  [
                {
                    userName: "Bhawesh Goyal",
                    email: "bhaveshg0777@gmail.com"
                },
                {
                    userName: "Bhawesh Goyal",
                    email: "bhaveshg0777@gmail.com"
                },
                {
                    userName: "Bhawesh Goyal",
                    email: "bhaveshg0777@gmail.com"
                },
            ]
        })
    })

    it("should return an error from getAllUsers" ,async () => {
        const getAllUSerSpy = jest.spyOn(userService, "getAllUsers").mockImplementation(() => {
            return {
                err : "No users Exist"
            }
        })

        const req = mockRequest();
        const res = mockResponse();

        await getAllUsers(req,res);
        expect(getAllUSerSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith({
            result : "No users Exist"
        })
    })

    it("should get info about all the user from getUserByEmail" , async()=>{
        const getUserByEmailSpy = jest.spyOn(userService , "getUserByEmail").mockImplementation(() => {
            return  {
                userName: "Bhawesh Goyal",
                email: "bhaveshg0777@gmail.com"
            }
           
        })
        
        const res = mockResponse();
        const req = mockRequest();

        await getUserByEmail(req,res);
        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith({
            result : {
                userName: "Bhawesh Goyal",
                email: "bhaveshg0777@gmail.com"
            },
           
        })
    })

    it("should return err from getUserByEmail",async()=>{
        const getUserByEmailSpy = jest.spyOn(userService , "getUserByEmail").mockImplementation(() => {
            return {err : "No user Exist for this mail Id"}
        })
        
        const res = mockResponse();
        const req = mockRequest();

        await getUserByEmail(req,res);
        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith({
            result : "No user Exist for this mail Id"
        })
    })

    it("should give info of user from getUserByUserId " , async() => {
        const getUserByUserIdSpy = jest.spyOn(userService , "getUserByUserId").mockImplementation(() => {
            return {
                name : "Bhwesh Goyal",
                mailId : "bhaveshg0777@gmail.com"
            }
        })

        const res  = mockResponse();
        const req = mockRequest();

        await getUserByUserId(req,res);
        expect(getUserByUserIdSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith({
            result : {
                name : "Bhwesh Goyal",
                mailId : "bhaveshg0777@gmail.com"
            }
        })
    })

    it("should give error from getUserByUserId ", async() => {
        const getUserByUserIdSpy = jest.spyOn(userService , "getUserByUserId").mockImplementation(() => {
            return {
               err : "Wrong User ID or User not Exist"
            }
        })

        const res  = mockResponse();
        const req = mockRequest();

        await getUserByUserId(req,res);
        expect(getUserByUserIdSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith({
            result : "Wrong User ID or User not Exist"
        })
    })

    it("should update the data of user from updateUserType" , async() => {
        const updateUserTypeSpy = jest.spyOn(userService , "updateUserType").mockImplementation(() => {
            return {
                name : "Bhawesh Goyal",
                email : "Bhaveshg0777@gmail.com"
            }
        })
        const res = mockResponse();
        const req = mockRequest();

        await updateUserType(req,res);
        expect(updateUserTypeSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith({
            result : {
                name : "Bhawesh Goyal",
                email : "Bhaveshg0777@gmail.com"
            }
        })
    })

    it("should give error while updating information from updateUserType" , async() => {
        const updateUserTypeSpy = jest.spyOn(userService , "updateUserType").mockImplementation(() => {
            return {
                err :"Invalid User Type"
            }
        })
        const res = mockResponse();
        const req = mockRequest();

        await updateUserType(req,res);
        expect(updateUserTypeSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith({
            result : "Invalid User Type"
        })
    })
})