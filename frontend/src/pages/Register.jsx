import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'Ravi Kumar', icon: User, type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'you@example.com', icon: Mail, type: 'email' },
    { key: 'password', label: 'Password', placeholder: '••••••••', icon: Lock, type: 'password' },
  ]

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8 justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white">SpendWise</span>
        </motion.div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-display font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm mb-6">Start tracking your finances today</p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field, i) => (
              <motion.div key={field.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">{field.label}</label>
                <div className="relative">
                  <field.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition"
                  />
                </div>
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-lg transition text-sm mt-2 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium transition">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
