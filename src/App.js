import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './user/screens/Login';
import Home from './user/screens/Home';
import ProtectedRoute from './ProtectedRoute';
import ResidentManagement from './user/screens/ResidentManagement';
import AddResident from './user/screens/AddResident';
import BarangayProfiling from './user/screens/BarangayProfiling';
import LoginOption from './user/screens/LoginOption';
import RegisterResident from './user/screens/Resident/RegisterResident';
import ResidentLogin from './user/screens/Resident/ResidentLogin';
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

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginOption/>} />
      <Route path="/Resident/Login" element={<ResidentLogin/>}/>
      <Route path="/Admin/Login" element={<Login/>}/>
      <Route path="/Resident/Register" element={<RegisterResident/>} />
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
    </Routes>
   </BrowserRouter>
  );
}

export default App;
