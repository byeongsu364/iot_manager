require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SensorData = require("./models/SensorData");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONT_ORIGIN = process.env.FRONT_ORIGIN;

// ✅ 미들웨어
app.use(express.json());
app.use(
    cors({
        origin: FRONT_ORIGIN,
        credentials: true,
    })
);

// ✅ MongoDB 연결
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ 센서 데이터 수신 (ESP8266 → 서버)
app.post("/data", async (req, res) => {
    try {
        const newData = new SensorData(req.body);
        await newData.save();
        console.log("📦 Received & Saved:", req.body);
        res.status(200).json({ success: true, message: "Data saved" });
    } catch (err) {
        console.error("❌ Save Error:", err);
        res.status(500).json({ success: false });
    }
});

// ✅ 최신 데이터
app.get("/data/latest", async (req, res) => {
    try {
        const latest = await SensorData.findOne().sort({ createdAt: -1 });
        res.json(latest || {});
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch latest data" });
    }
});

// ✅ 전체 데이터 (최근 50개)
app.get("/data/all", async (req, res) => {
    try {
        const all = await SensorData.find().sort({ createdAt: -1 }).limit(50);
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch all data" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
