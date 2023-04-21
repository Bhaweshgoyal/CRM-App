const { mockRequest, mockResponse } = require("../test/testUtils/interceptor");
const db = require("../test/testUtils/db");
const { signUp, signIn } = require("./auth.controller");
// const {beforeAll , afterAll , afterEach} = require ('jest')

// we have to start using db                      / for this we beforeAll
//
// store                                           /
// store and Update    CLEAR DB we usr AfterEach   /
// store and find                                  /        we have midle for this to do this flow on each function
//     beforeEach and afterEach
//
//
// close the connection / Disconnect with server    /   for This we use AfterAll

beforeAll(async () => {
    await db.connect();
});

afterAll(async () => {
    await db.closeDatabase();
});

afterEach(async () => {
    await db.clearDatabase();
});

describe("signUp", () => {
    it("should sign up the user with valid user Details", async () => {
        const req = mockRequest();
        const res = mockResponse();

        req.body = {
            name: "test",
            email: "test123@gmail.com",
            password: "test@123",
            userType: "admin",
        };

        await signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "test",
                email: "test123@gmail.com",
                userType: "admin",
                userStatus: "approved",
            })
        );
    });
    it("should not sign up the user with invalid user details", async () => {
        const req = mockRequest();
        const res = mockResponse();

        req.body = {
            name: "test",
            email: "test123gmail.com",
            password: "test@123",
            userType: "admin",
        };

        await signUp(req, res);
        // expect(res.status).toHaveBeenCalledWith(403); 
        expect(res.status).not.toHaveBeenCalledWith(201);
        // expect(res.status(403).send).toHaveBeenCalledWith();
        expect(res.status(403).send).toHaveBeenCalledWith("User validation failed: email: Path `email` is invalid (test123gmail.com).");
    });
});
describe("signIn", () => {
    it("should sign in the user with valid user credentials", async () => {
        const req = mockRequest();
        const res = mockResponse();

        req.body = {
            name: "test",
            email: "test123@gmail.com",
            password: "test@123",
            userType: "admin",
        };

        await signUp(req, res);
        const req1 = mockResponse();
        const res1 = mockResponse();
        req1.body = {
            email: "test123@gmail.com",
            password: "test@123",
        };
        await signIn(req1, res1)
        expect(res1.status).toHaveBeenCalledWith(201)
        expect(res1.status(201).send).toHaveBeenCalledWith(expect.objectContaining({
             "message": "User Validated"
         }))
    })

    it("should not sign in the user with invalid user credentials", async () => {
        const req = mockRequest();
        const res = mockResponse();

        req.body = {
            name: "test",
            email: "test123@gmail.com",
            password: "test@123",
            userType: "admin",
        };

        await signUp(req, res);
        const req1 = mockResponse();
        const res1 = mockResponse();
        req1.body = {
            email: "test123@gmail.com",
            password: "test",            //here test password is wrong 
        };
        await signIn(req1, res1)
        expect(res1.status).toHaveBeenCalledWith(401)
        expect(res1.status(401).send).toHaveBeenCalledWith("Invalid Password")
    })
})