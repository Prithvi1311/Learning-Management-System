import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register'
import Course from './pages/course/course';
import Courses from './pages/course/Courses';
import Profile from './pages/profile/profile';
import Learnings from './pages/learning/learnings';
import Home from './pages/landing/Home';
import DUsers from './pages/dashBoard/DUsers';
import DCourses from './pages/dashBoard/DCourses';
import Assessment from './pages/assessment/Assessment';
import ErrorPage from './pages/error/ErrorPage';
import AddQuestions from './pages/dashBoard/AddQuestions';
import Performance from './pages/profile/Performance';
// import certificate from './pages/assessment/certificate';
import Forum from './pages/course/forum';
import AdminDashboard from './pages/dashBoard/AdminDashboard';
import InstructorDashboard from './pages/dashBoard/InstructorDashboard';
import CreateCourse from './pages/dashBoard/CreateCourse';
import ManageCourse from './pages/dashBoard/ManageCourse';
import PrivateRoute from './Components/common/PrivateRoute';
import TakeQuiz from './pages/course/TakeQuiz';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/' element={<Home />}></Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute roles={['ADMIN']} />}>
            <Route path='/admin' element={<AdminDashboard />}></Route>
            <Route path='/Dcourses' element={<DCourses />}></Route>
            <Route path='/Dusers' element={<DUsers />}></Route>
          </Route>

          {/* Instructor Routes */}
          <Route element={<PrivateRoute roles={['INSTRUCTOR']} />}>
            <Route path='/instructor' element={<InstructorDashboard />}></Route>
            <Route path='/create-course' element={<CreateCourse />} />
            <Route path='/manage-course/:id' element={<ManageCourse />} />
            <Route path='/addquestions/:id' element={<AddQuestions />} />
          </Route>

          {/* Student/Authenticated Routes */}
          <Route element={<PrivateRoute roles={['STUDENT', 'INSTRUCTOR', 'ADMIN']} />}>
            <Route path='/courses' element={<Courses />}></Route>
            <Route path='/course/:id' element={<Course />}></Route>
            <Route path='/course/:courseId/quiz' element={<TakeQuiz />}></Route>
            <Route path='/discussion/:id' element={<Forum />}></Route>
            {/* <Route path='/certificate/:courseId' element={<certificate />}></Route> */}
            <Route path='/assessment/:id' element={<Assessment />}></Route>
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/Learnings' element={<Learnings />}></Route>
            <Route path='/Performance' element={<Performance />} />
          </Route>

          {/* Fallback */}
          <Route path='*' element={<ErrorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
