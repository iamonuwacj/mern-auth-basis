// import logo from './logo.svg';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import FloatingShape from './components/FloatingShape';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LoadingSpinner from './components/LoadingSpinner';
import EmailVerification from './pages/EmailVerification';
import { Toaster }from 'react-hot-toast'
import { useAuthStore } from './store/authStore';
import OtpInputWithValidation from './pages/EmailVerification';
import { useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';


const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore()

    if(isAuthenticated && user.isVerified ){
        return <Navigate to={"/"} replace/>
    }
    return children
}

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user} = useAuthStore()

    if(!isAuthenticated) {
        return <Navigate to={"/login"} replace/>
    }

    if(!user.isVerified) {
        return <Navigate to={"/verify-email"} replace/>
    }
    return children
}

function App() {

    const { isCheckingAuth, checkAuth } = useAuthStore()


    useEffect(() => {
        checkAuth()
    },[checkAuth])

    if (isCheckingAuth) return <LoadingSpinner />

    // console.log("isAuthenticated", isAuthenticated);
    // console.log("User", user);


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-500 via-green-500
            to-emerald-900 flex items-center justify-center relative overflow-hidden ">
            <FloatingShape
                color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}
            />
            <FloatingShape
                color="bg-emerald-500" size="w-64 h-64" top="70%" left="80%" delay={5}
            />
            <FloatingShape
                color="bg-lime-500" size="w-64 h-64" top="40%" left="-10%" delay={2}
            />
            <FloatingShape
                color="bg-blue-500" size="w-64 h-64" top="0%" right="10%" delay={8}
            />

            <Routes>
                <Route path='/' element={<ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>} />
                <Route path='/signup' element={<RedirectAuthenticatedUser>
                    <Signup />
                </RedirectAuthenticatedUser>} />
                <Route path='/login' element={<RedirectAuthenticatedUser>
                    <Login />
                </RedirectAuthenticatedUser>} />
                <Route path='/verify-email' element={<OtpInputWithValidation numberOfDigits={6}/>} />
                <Route path='/forgot-password' element={<RedirectAuthenticatedUser>
                    <ForgotPassword />
                </RedirectAuthenticatedUser>} />
                <Route
                    path='/reset-password/:token'
                    element={<RedirectAuthenticatedUser>
                        <ResetPasswordPage />
                    </RedirectAuthenticatedUser>}
                />

                <Route
                    path='*'
                    element={<Navigate 
                        to={"/"}
                        replace
                    />}
                />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;
