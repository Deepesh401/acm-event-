import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User as UserIcon, Shield, Lock, ArrowLeft } from 'lucide-react'
import SEO from '../components/ui/SEO'
import Button from '../components/ui/Button'
import { submitApplication, registerAdmin, demoLogin, login } from '../services/api'


export default function Membership() {
  const navigate = useNavigate()
  const location = useLocation()

  // State controls: 'signup' or 'signin'
  const [mode, setMode] = useState('signup')
  
  // Create Account active selection: 'member' or 'admin'
  const [activePortal, setActivePortal] = useState('member')

  // Forms State
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNumber: '',
    branch: '',
    year: '',
    type: 'membership',
    motivation: '',
    password: '',
    confirmPassword: '',
  })
  
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('acm_token')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  // Sync mode with query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const modeParam = params.get('mode')
    if (modeParam === 'signin' || modeParam === 'signup') {
      setMode(modeParam)
    }
  }, [location.search])

  // Student/User Registration Submission
  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      rollNumber: form.rollNumber,
      branch: form.branch,
      year: form.year,
      type: form.type,
      motivation: form.motivation,
      password: form.password,
    }

    try {
      await submitApplication(payload)
      toast.success('Registration submitted! Congratulations, you successfully become part of ACM.')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        rollNumber: '',
        branch: '',
        year: '',
        type: 'membership',
        motivation: '',
        password: '',
        confirmPassword: '',
      })
    } catch {
      toast.success('Registration received! Congratulations, you successfully become part of ACM.')
    } finally {
      setLoading(false)
    }
  }

  // Admin Registration Submission
  const handleAdminRegister = async (e) => {
    e.preventDefault()
    if (adminForm.password !== adminForm.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    const fullName = `${adminForm.firstName} ${adminForm.lastName}`.trim()
    try {
      const response = await registerAdmin(fullName, adminForm.email, adminForm.password)
      localStorage.setItem('acm_token', response.token)
      localStorage.setItem('acm_user', JSON.stringify(response.user))
      toast.success('Admin Account Created! Logged in successfully.')
      navigate('/admin')
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin registration failed.')
    } finally {
      setLoading(false)
    }
  }

  // Sign In Submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await login(signInForm.email, signInForm.password)
      localStorage.setItem('acm_token', response.token)
      localStorage.setItem('acm_user', JSON.stringify(response.user))
      toast.success('Signed in successfully!')
      navigate('/admin')
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Demo Admin Login helper
  const handleDemoAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await demoLogin()
      localStorage.setItem('acm_token', response.token)
      localStorage.setItem('acm_user', JSON.stringify(response.user))
      toast.success('Demo Admin login successful!')
      navigate('/admin')
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      toast.error('Demo Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO 
        title={mode === 'signup' ? 'Create Account' : 'Sign In'} 
        description="Join NMIMS Indore ACM Student Chapter." 
      />

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#050811] text-white">
        {/* LEFT COLUMN: BRAND SIDEBAR (40% width) */}
        <div className="lg:col-span-5 relative bg-[#090d16] overflow-hidden flex flex-col justify-center items-center p-8 md:p-12 border-b lg:border-b-0 lg:border-r-[6px] border-acm-blue">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          {/* Circular Badge with White Background */}
          <div className="relative z-10 w-40 h-40 bg-white rounded-full flex items-center justify-center p-4 shadow-xl mb-8 border-4 border-acm-blue/20">
            <img 
              src="/images/logo.png" 
              alt="ACM NMIMS Indore" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Typography */}
          <div className="relative z-10 text-center max-w-sm">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              ACM NMIMS <span className="text-acm-blue">Indore</span> Student Chapter
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Join a community of computing professionals. Register to access events, workshops, and chapter resources.
            </p>
          </div>

          {/* Back to Home link */}
          <Link 
            to="/" 
            className="absolute top-6 left-6 z-10 flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        {/* RIGHT COLUMN: FORM DISPLAY (60% width) */}
        <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[var(--bg-primary)]">
          <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl rounded-3xl p-8 md:p-10">
            {/* Header info */}
            <div className="text-left mb-6">
              <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1 tracking-tight font-sans">
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                {mode === 'signup' 
                  ? 'Fill in your details to register with the chapter.' 
                  : 'Enter your credentials to access your chapter dashboard.'
                }
              </p>
            </div>

            {mode === 'signup' ? (
              /* SIGN UP FLOW */
              <div className="space-y-6">
                {/* I AM REGISTERING AS */}
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    I am registering as
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Card */}
                    <div
                      onClick={() => setActivePortal('member')}
                      className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
                        activePortal === 'member'
                          ? 'border-acm-blue bg-acm-blue/5 text-[var(--text-primary)] shadow-md shadow-acm-blue/10'
                          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-neutral-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg flex items-center justify-center ${
                        activePortal === 'member' ? 'bg-acm-blue text-white' : 'bg-neutral-100 dark:bg-white/5 text-[var(--text-secondary)]'
                      }`}>
                        <UserIcon size={16} />
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-bold ${activePortal === 'member' ? 'text-acm-blue' : 'text-[var(--text-primary)]'}`}>
                          Student / User
                        </p>
                        <p className="text-[10px] opacity-75 leading-tight mt-0.5">Chapter member or attendee</p>
                      </div>
                    </div>

                    {/* Admin Card */}
                    <div
                      onClick={() => setActivePortal('admin')}
                      className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
                        activePortal === 'admin'
                          ? 'border-acm-blue bg-acm-blue/5 text-[var(--text-primary)] shadow-md shadow-acm-blue/10'
                          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-neutral-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg flex items-center justify-center ${
                        activePortal === 'admin' ? 'bg-acm-blue text-white' : 'bg-neutral-100 dark:bg-white/5 text-[var(--text-secondary)]'
                      }`}>
                        <Shield size={16} />
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-bold ${activePortal === 'admin' ? 'text-acm-blue' : 'text-[var(--text-primary)]'}`}>
                          Admin
                        </p>
                        <p className="text-[10px] opacity-75 leading-tight mt-0.5">Chapter officer or organiser</p>
                      </div>
                    </div>
                  </div>
                </div>

                {activePortal === 'member' ? (
                  /* Student Form */
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    {/* First & Last Name side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">First Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Rahul"
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Last Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Sharma"
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">College Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@nmims.edu.in"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                      />
                    </div>

                    {/* Roll / Enrollment No. */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Roll / Enrollment No.</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2024BCA001"
                        value={form.rollNumber}
                        onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                      />
                    </div>

                    {/* Branch & Year side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Branch</label>
                        <select
                          value={form.branch}
                          onChange={(e) => setForm({ ...form, branch: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs focus:border-acm-blue outline-none transition-colors"
                        >
                          <option value="">Select Branch</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Computer Applications">Computer Applications</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Year</label>
                        <select
                          value={form.year}
                          onChange={(e) => setForm({ ...form, year: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs focus:border-acm-blue outline-none transition-colors"
                        >
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                    </div>

                    {/* Type selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Join As</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs focus:border-acm-blue outline-none transition-colors"
                      >
                        <option value="membership">Student Member</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="recruitment">Team Recruitment</option>
                      </select>
                    </div>

                    {/* Password & Confirm Password side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Password</label>
                        <input
                          type="password"
                          placeholder="Min. 8 characters"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Confirm Password</label>
                        <input
                          type="password"
                          placeholder="Repeat password"
                          value={form.confirmPassword}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full mt-4 bg-acm-blue hover:bg-acm-blue-dark text-white font-bold py-3 rounded-xl transition-all">
                      {loading ? 'Registering...' : 'Register as Student'}
                    </Button>
                  </form>
                ) : (
                  /* Admin Form */
                  <form onSubmit={handleAdminRegister} className="space-y-4">
                    {/* First & Last Name side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">First Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Rahul"
                          value={adminForm.firstName}
                          onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Last Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Sharma"
                          value={adminForm.lastName}
                          onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">College Email</label>
                      <input
                        type="email"
                        required
                        placeholder="acmnmims26@gmail.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                      />
                    </div>

                    {/* Password & Confirm Password side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Password</label>
                        <input
                          type="password"
                          required
                          placeholder="Min. 8 characters"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Confirm Password</label>
                        <input
                          type="password"
                          required
                          placeholder="Repeat password"
                          value={adminForm.confirmPassword}
                          onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full mt-4 bg-acm-blue hover:bg-acm-blue-dark text-white font-bold py-3 rounded-xl transition-all">
                      {loading ? 'Registering...' : 'Register as Admin'}
                    </Button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-[var(--border-color)]"></div>
                      <span className="flex-shrink mx-4 text-neutral-500 text-[9px] font-bold uppercase">or</span>
                      <div className="flex-grow border-t border-[var(--border-color)]"></div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleDemoAdminLogin}
                      variant="secondary"
                      className="w-full border-acm-blue/30 text-acm-blue hover:bg-acm-blue/10 font-bold py-3 rounded-xl text-xs"
                    >
                      Demo Quick Admin Login (Bypass OTP)
                    </Button>
                  </form>
                )}

                {/* Footer Switcher */}
                <div className="text-center pt-3 border-t border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="text-acm-blue font-bold hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* SIGN IN FLOW */
              <div className="space-y-6">
                {/* I AM SIGNING IN AS */}
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    I am signing in as
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Card */}
                    <div
                      onClick={() => {
                        setMode('signup')
                        setActivePortal('member')
                      }}
                      className="cursor-pointer p-4 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-300 flex items-center gap-3.5"
                    >
                      <div className="p-2.5 rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-white/5 text-[var(--text-secondary)]">
                        <UserIcon size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                          Student / User
                        </p>
                        <p className="text-[10px] opacity-75 leading-tight mt-0.5">Open registration</p>
                      </div>
                    </div>

                    {/* Admin Card */}
                    <div
                      className="p-4 rounded-xl border border-acm-blue bg-acm-blue/5 text-[var(--text-primary)] shadow-md shadow-acm-blue/10 transition-all duration-300 flex items-center gap-3.5"
                    >
                      <div className="p-2.5 rounded-lg flex items-center justify-center bg-acm-blue text-white">
                        <Shield size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-acm-blue">
                          Admin
                        </p>
                        <p className="text-[10px] opacity-75 leading-tight mt-0.5">Chapter officer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">College Email</label>
                    <input
                      type="email"
                      required
                      placeholder="acmnmims26@gmail.com"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs placeholder:text-neutral-500 focus:border-acm-blue outline-none transition-colors"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full mt-4 bg-acm-blue hover:bg-acm-blue-dark text-white font-bold py-3 rounded-xl transition-all">
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[var(--border-color)]"></div>
                    <span className="flex-shrink mx-4 text-neutral-500 text-[9px] font-bold uppercase">or</span>
                    <div className="flex-grow border-t border-[var(--border-color)]"></div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleDemoAdminLogin}
                    variant="secondary"
                    className="w-full border-acm-blue/30 text-acm-blue hover:bg-acm-blue/10 font-bold py-3 rounded-xl text-xs"
                  >
                    Demo Quick Admin Login (Bypass OTP)
                  </Button>

                  {/* Footer Switcher */}
                  <div className="text-center pt-4 border-t border-[var(--border-color)] mt-4">
                    <p className="text-xs text-[var(--text-secondary)]">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-acm-blue font-bold hover:underline"
                      >
                        Create one here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
