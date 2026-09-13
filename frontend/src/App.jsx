import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Draw from "./pages/Draw";
import Result from "./pages/Result";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route  path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/draw" element={<Draw />} />
        <Route path="/reset-password" element={<ResetPassword />}
/>
<Route path="/result" element={<Result />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
