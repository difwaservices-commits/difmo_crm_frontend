import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, clearError } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        try {
            await login(email, password);
            const from = location.state?.from?.pathname || '/employee-check-in-check-out';
            navigate(from, { replace: true });
        } catch (err) {
            console.error('[Login] Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-12">
                    <img src="/logo.png" alt="Difmo CRM" className="h-20 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Difmo CRM</h1>
                </div>

                {/* White Card Container */}
                <div className="bg-white rounded-t-[30px] shadow-lg p-8 w-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-base font-medium text-gray-900 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                                placeholder="Email address"
                                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-gray-500 hover:text-gray-700 text-sm">
                                Forgot password?
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Login'
                            )}
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-gray-400 text-sm mb-2">Don't have an account?</p>
                            <Link
                                to="/company-registration"
                                className="inline-block w-full py-3.5 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-center"
                            >
                                Activate Now
                            </Link>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-400 text-sm">App ver 1.0</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
