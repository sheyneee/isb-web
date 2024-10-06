import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './user/screens/Home';
import ProtectedRoute from './ProtectedRoute';
import ResidentManagement from './user/screens/ResidentManagement';
import AddResident from './user/screens/AddResident';
import BarangayProfiling from './user/screens/BarangayProfiling';
import LoginOption from './user/screens/LoginOption';
import RegisterResident from './user/screens/Resident/RegisterResident';
import ResidentHome from './user/screens/Resident/ResidentHome';
import ViewRequest from './component/ViewRequest';
import Announcements from './user/screens/Announcements';
import EvacuationMap from './user/screens/Resident/Map/EvacuationMap';
import ResidentDocRequest from './user/screens/Resident/ResidentDocRequest';
import DocumentRequest from './user/screens/DocumentRequest';
import OfficialsEvacuationMap from './user/screens/Map/OfficialsEvacuationMap';
import ResidentBarangayDirectory from './user/screens/Resident/ResidentBarangayDirectory';
import ResidentAnnouncementScreen from './user/screens/Resident/ResidentAnnouncementScreen';
import ResidentMessages from './user/screens/Resident/ResidentMessages';
import ResidentIncidentReport from './user/screens/Resident/ResidentIncidentReport';
import IncidentReport from './user/screens/IncidentReport';
import CreateBarangay from './user/techadmin/CreateBarangay';
import CreateAdminForm from './user/techadmin/CreateAdminForm';
import Messages from './user/screens/Messages';
import ResetPasswordInput from './user/forgotpassword/ResetPasswordInput';
import ForgotpassEmailInput from './user/forgotpassword/ForgotpassEmailInput';
import EnterSecurityCode from './user/forgotpassword/EnterSecurityCode';
import BarangayInformation from './user/screens/BarangayInformation';

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/Tech-Admin/Create-Barangay" element={<CreateBarangay/>} />
      <Route path="/Tech-Admin/Create-Captain-Account" element={<CreateAdminForm/>} />
      <Route path="/" element={<LoginOption/>} />
      <Route path="/Resident/Register" element={<RegisterResident/>} />

      {/* Route for Forgot Password Email Input */}
      <Route path="/forgot-password" element={<ForgotpassEmailInput />} />
      <Route path="/enter-security-code" element={<EnterSecurityCode />} />
      
      {/* Protected route for Reset Password Input with token check */}
      <Route 
        path="/reset-password" 
        element={
          <ProtectedRoute requiredRole="reset-password">
            <ResetPasswordInput />
          </ProtectedRoute>
        } 
      />

     {/* Routes for residents only */}
     <Route 
          path='/Resident/Home' 
          element={
            <ProtectedRoute requiredRole="resident">
              <ResidentHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Resident/EvacuationMap' 
          element={
            <ProtectedRoute requiredRole="resident">
              <EvacuationMap />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Resident/Messages' 
          element={
            <ProtectedRoute requiredRole="resident">
              <ResidentMessages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Resident/Document-Request' 
          element={
            <ProtectedRoute requiredRole="resident">
              <ResidentDocRequest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Resident/Announcements' 
          element={
            <ProtectedRoute requiredRole="resident">
              <ResidentAnnouncementScreen/>
            </ProtectedRoute>
          } 
        />
        <Route
        path='/Resident/BarangayOfficialsDirectory'
        element={
          <ProtectedRoute requiredRole="resident">
            <ResidentBarangayDirectory/>
          </ProtectedRoute>
        }
        />
        <Route
        path='/Resident/Incident-Report'
        element={
          <ProtectedRoute requiredRole="resident">
            <ResidentIncidentReport/>
          </ProtectedRoute>
        }
        />
       {/* Routes for admin only */}
      <Route 
          path='/home' 
          element={
            <ProtectedRoute requiredRole="admin">
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/AddResident' 
          element={
            <ProtectedRoute requiredRole="admin">
              <AddResident />
            </ProtectedRoute>
          } 
        />
        
          <Route 
          path='/Messages' 
          element={
            <ProtectedRoute requiredRole="admin">
              <Messages/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/ResidentManagement' 
          element={
            <ProtectedRoute requiredRole="admin">
              <ResidentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Announcement' 
          element={
            <ProtectedRoute requiredRole="admin">
              <Announcements />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Incident-Report' 
          element={
            <ProtectedRoute requiredRole="admin">
              <IncidentReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Document-Request' 
          element={
            <ProtectedRoute requiredRole="admin">
              <DocumentRequest />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/view-request/:residentID" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ViewRequest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/EvacuationMap' 
          element={
            <ProtectedRoute requiredRole="admin">
              <OfficialsEvacuationMap />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/BarangayProfiling' 
          element={
            <ProtectedRoute requiredRole="admin">
              <BarangayProfiling />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/Barangay-Information' 
          element={
            <ProtectedRoute requiredRole="admin">
              <BarangayInformation/>
            </ProtectedRoute>
          } 
        />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
