const { verifyToken } = require('./auth.service');
const jwt = require('jsonwebtoken');

describe("verifyToken", () => {
    it("should return the decoded response , when verify function is able to decode the token", async () => {
        const jwtVerifyTokenSpy = jest.spyOn(jwt, "verify").mockImplementation(() => {
            return {
                name: "abc",
                email: "abc@gmail.com"
            }
        });
        const decodedToken = verifyToken("test-token");
        expect(jwtVerifyTokenSpy).toHaveBeenCalled();
        expect(decodedToken).toEqual(expect.objectContaining({ // toEqual have ability to match expect.objectContaining
            name: "abc",
            email: "abc@gmail.com"
        }))
    })
    it("should return error message , when verify function throws the error", () => {
        const jwtVerifyTokenSpy = jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error({
                message: "test error message"
            });
        });
            verifyToken("test-token");
            expect(jwtVerifyTokenSpy).toHaveBeenCalled();
            expect(jwt.verify).toThrow(new Error({ message: "test error message" }))
    })
})