const mongoose = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect(
            process.env.MONGODB_URL,
        );
        console.log("Connected to database successfully");
    } catch (err) {
        console.log("Database error");
    }
}

module.exports = dbConnect;