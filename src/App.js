import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./Home/AppHome.css";
import QRPage from "./Home/QRPage";
import RegistrationForm from "./Home/RegistrationForm";
import RegistrationForm2 from "./Home/RegistrationForm2";
import MemberList from "./Home/MemberList";
import MemberShipType from "./Home/MemberShipType";
import SystemManagement from "./Home/SystemManagement";

import AdminPanel from "./Admin/AdminPanel";
import DashBoard from "./Admin/DashBoard";
import Dashboard1 from "./Admin/Dashboard1";
import Profile from "./Admin/Profile";
import MemberPaymentManager from "./Home/MemberPaymentManager";
import PaymentView from "./Home/PaymentView";
import Attendance from "./Home/Attendance";
import Login from "./Home/Login";
import AttendanceManagement from "./Home/AttendanceManagement";

import AttendanceAssis from "./Assistant/AttendanceAssis";
import MemberPaymentManagerAssis from "./Assistant/MemberPaymentManagerAssis";
import RegistrationFormAssis from "./Assistant/RegistrationFormAssis";
import MemberListAssis from "./Assistant/MemberListAssis";

function App() {
  return (
    <Router>
      <div style={{ padding: "10px", fontFamily: "Arial" }}>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/service/registration" element={<RegistrationForm />} />
          <Route path="/service/registration-member" element={<RegistrationForm2 />} />
          <Route path="/service/attendance" element={<Attendance />} />
            <Route path="/service/system" element={<SystemManagement/>} />
          <Route path="/service/payment" element={<MemberPaymentManager />} />
          <Route path="/service/membership-type-management" element={<MemberShipType />} />
          <Route path="/service/income-management" element={<PaymentView />} />
          <Route path="/service/QR-code" element={<QRPage />} />
          <Route path="/service/members-list" element={<MemberList />} />
          <Route path="/service/attendance-management" element={<AttendanceManagement />} />

          <Route path="/assis/members-list" element={<MemberListAssis />} />
          <Route path="/assis/payment" element={<MemberPaymentManagerAssis />} />
          <Route path="/assis/attendance" element={<AttendanceAssis />} />
          <Route path="/assis/registration" element={<RegistrationFormAssis />} />


          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/dashboard-admin" element={<Dashboard1 />} />
          <Route path="/login" element={<login />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
