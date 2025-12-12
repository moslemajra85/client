import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            // Replace with your actual API endpoint
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            if (response.ok) {
                const data = await response.json()
                // Store token if needed
                if (data.token) {
                    localStorage.setItem('token', data.token)
                }
                // Navigate to home or dashboard page
                navigate('/')
            } else {
                const data = await response.json()
                setErrors(prev => ({
                    ...prev,
                    submit: data.message || 'Login failed'
                }))
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'An error occurred. Please try again.'
            }))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <div className="form-error">{errors.password}</div>}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="forgot-password-link">
                        <a href="/forgot-password">Forgot your password?</a>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && <div className="form-error" style={{ marginBottom: '16px' }}>{errors.submit}</div>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                    <p>Don't have an account? <a href="/register">Sign Up</a></p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage