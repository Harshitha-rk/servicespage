import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Services from "./Services";
import ServiceDetail from "./ServiceDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Services />} />
        <Route path="/service-detail" element={<ServiceDetail />} />
      </Routes>
    </Router>
  );
}
