const mongoose = require("mongoose");
const { Schema } = mongoose;
const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ticketPriority: {
    type: Number,
    required: true,
    default: 4,
    enum: [1, 2, 3, 4, 5],
  },
  status: {
    type: String,
    required: true,
    default: "Open",
    enum: ["Open", "InProgress", "Resolved", "onHold", "Cancelled"],
  },
  createdBy: {
    type: String,
    required: true,
  },
  clientName : {
    type : String , 
    required : true
  },
  assignee: {
    type: String,
  },
  assignedTo: {
    type: String,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
