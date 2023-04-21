const { mockRequest, mockResponse } = require("../test/testUtils/interceptor");
const db = require("../test/testUtils/db");
const ticketService = require("../service/ticket.service");
const {
    createTicket,
    getTicketById,
    getAllTicketes,
    getAllTicketByStatus,
    getMyAllAssignedTickets,
    updateTicketById,
} = require("./ticket.controller");

// beforeAll(async () => {
//     await db.connect();
// });

// afterAll(async () => {
//     await db.closeDatabase();
// });

// afterEach(async () => {
//     await db.clearDatabase();
// });


afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
});

// test('plays video', () => {
//   const isPlaying = video.play();

//   expect(spy).toHaveBeenCalled();
//   expect(isPlaying).toBe(true);
// });


describe("ticket Controllers", () => {
    it("should create a ticket in db", async () => {
        const CreateTicketServiceSpy = jest.spyOn(ticketService, 'createTicket').mockImplementation(() => {
            return {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            }
        }); // hence it will return the mock vale from spying in this 
        const req = mockRequest();
        const res = mockResponse();
        await createTicket(req, res);
        expect(CreateTicketServiceSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith(
            {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            }
        )
    })

    it("should return the error with status code 401", async () => {
        const createServiceSpy = jest.spyOn(ticketService, "createTicket").mockImplementation(() => {
            return {
                err: "Invalid Details"
            }
        })
        const req = mockRequest();
        const res = mockResponse();
        await createTicket(req, res);
        expect(createServiceSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.status(401).send).toHaveBeenCalledWith("Invalid Details")
    })

    it("should get a ticket with valid response from getTicketById ", async () => {
        const getOneTicketServiceSpy = jest.spyOn(ticketService, "getTicketById").mockImplementation(() => {
            return {
                title: "This is a real ticket",
                description: "This is the real ticket description",
                assignedTo: "bhaweshg0777@gmail.com",
                clientName: "adobe"
            }
        })

        const req = mockRequest();
        const res = mockResponse();
        await getTicketById(req, res);
        expect(getOneTicketServiceSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith(
            {
                title: "This is a real ticket",
                description: "This is the real ticket description",
                assignedTo: "bhaweshg0777@gmail.com",
                clientName: "adobe"
            }
        )
    })

    it("should return ticket error with invalid details from getTicketById ", async () => {
        const getOneTicketServiceSpy = jest.spyOn(ticketService, "getTicketById").mockImplementation(() => {
            return {
                error: "No ticket found Invalid Details",
            }
        })

        const res = mockResponse();
        const req = mockRequest();
        await getTicketById(req, res);
        expect(getOneTicketServiceSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith("No ticket found Invalid Details");
    })

    it("should return all the ticket from getAllTicketes ", async () => {
        const getAllTicketesSpy = jest.spyOn(ticketService, "getAllTicketes").mockImplementation(() => {
            return [{
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            },
            {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            },
            {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            }]
        })
        const res = mockResponse();
        const req = mockRequest();

        await getAllTicketes(req, res);
        expect(getAllTicketesSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith([{
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        },
        {
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        },
        {
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        }])
    })

    it("should return the error from getAllTicketes", async () => {
        const getAllTicketesSpy = jest.spyOn(ticketService, "getAllTicketes").mockImplementation(() => {
            return { err: "Invalid Details / No ticket Found" }
        })

        const res = mockResponse();
        const req = mockRequest();
        await getAllTicketes(req, res);
        expect(getAllTicketesSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith("Invalid Details / No ticket Found")
    })
    it("should return the ticket from by getAllTicketStatus", async () => {
        const getAllTicketByStatusSpy = jest.spyOn(ticketService, "getAllTicketByStatus").mockImplementation(() => {
            return [{
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            },
            {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            },
            {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            }]
        })
        const req = mockRequest();
        const res = mockResponse();

        await getAllTicketByStatus(req, res)
        expect(getAllTicketByStatusSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith([{
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        },
        {
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        },
        {
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        }])
    })
    it("should return the ticket error from getAllTicketStatus", async () => {
        const getAllTicketByStatusSpy = jest.spyOn(ticketService, "getAllTicketByStatus").mockImplementation(() => {
            return {
                err: "Invalid Information or no ticket for given status"
            }
        })
        const req = mockRequest();
        const res = mockResponse();

        await getAllTicketByStatus(req, res)
        expect(getAllTicketByStatusSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith("Invalid Information or no ticket for given status")
    })
    it("should return the ticket from getMyAllAssignedTickets", async () => {
        const getMyAllAssignedTicketsSpy = jest.spyOn(ticketService, "getMyAllAssignedTickets").mockImplementation(() => {
            return [{
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            },
            {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            },
            {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            }]
        })
        const res = mockResponse();
        const req = mockRequest();
        await getMyAllAssignedTickets(req, res);
        expect(getMyAllAssignedTicketsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith([{
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        },
        {
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        },
        {
            title: "ticket Title",
            description: "ticket decription",
            status: "ticket status",
            ticketPriority: "ticket Priority",
            assignee: "test123@gmail.com",
            assignedTo: "test123@gmail.com",
            clientName: "ticket clientName",
            createdBy: "ticket createdBy",
        }])
    })
    it("should return the ticket error from getMyAllAssignedTickets", async () => {
        const getMyAllAssignedTicketsSpy = jest.spyOn(ticketService, "getMyAllAssignedTickets").mockImplementation(() => {
            return {
                err: "Invalid crendential or no Ticket Assigned"
            }
        })

        const req = mockRequest()
        const res = mockResponse();

        await getMyAllAssignedTickets(req, res);
        expect(getMyAllAssignedTicketsSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(201).send).toHaveBeenCalledWith("Invalid crendential or no Ticket Assigned")
    })

    it("should give all the ticket with updated data from updateTicketyId ", async () => {
        const updateTicketyIdSpy = jest.spyOn(ticketService, "updateTicketById").mockImplementation(() => {
            return {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            }
        })
        const res = mockResponse();
        const req = mockRequest();

        await updateTicketById(req, res);
        expect(updateTicketyIdSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status(201).send).toHaveBeenCalledWith({
            message: "Successfull"
            , result: {
                title: "ticket Title",
                description: "ticket decription",
                status: "ticket status",
                ticketPriority: "ticket Priority",
                assignee: "test123@gmail.com",
                assignedTo: "test123@gmail.com",
                clientName: "ticket clientName",
                createdBy: "ticket createdBy",
            }
        })
    })
    it("should give error from updateTicket",async () => {
        const updateTicketyIdSpy = jest.spyOn(ticketService, "updateTicketById").mockImplementation(() => {
            return {
                error : "Invalid Crendentials"
            }
        })
        const res = mockResponse();
        const req = mockRequest();

        await updateTicketById(req, res);
        expect(updateTicketyIdSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status(401).send).toHaveBeenCalledWith({
            message: "Un-Successfull"
            , result: "Invalid Crendentials"
        })
    })
})