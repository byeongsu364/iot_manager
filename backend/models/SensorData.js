const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
    {
        temperature: Number,
        humidity: Number,
        inCount: Number,
        outCount: Number,
        people: Number,
        light: String,
    },
    { timestamps: true } // 자동으로 createdAt, updatedAt 추가
);

module.exports = mongoose.model("SensorData", sensorDataSchema);
