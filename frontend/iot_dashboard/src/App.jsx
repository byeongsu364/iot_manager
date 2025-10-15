import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  // 3초마다 최신 데이터 GET
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/data/latest`);
        console.log("📡 서버 응답:", res.data); // ← 이 줄 꼭 추가!
        setData(res.data);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <h2>⏳ Loading sensor data...</h2>;

  return (
    <div className="container">
      <h1>📊 IoT 실시간 모니터링</h1>
      <div className="card">
        <p>🌡 <strong>온도:</strong> {data.temperature?.toFixed(1)}°C</p>
        <p>💧 <strong>습도:</strong> {data.humidity?.toFixed(1)}%</p>
        <p>🚶 <strong>IN:</strong> {data.inCount} / <strong>OUT:</strong> {data.outCount}</p>
        <p>👥 <strong>현재 인원:</strong> {data.people}</p>
        <p>💡 <strong>조명:</strong> {data.light}</p>
        <p className="time">
          🕒 {data?.createdAt ? new Date(data.createdAt).toLocaleString() : "데이터 없음"}
        </p>
      </div>
    </div>
  );
}

export default App;
