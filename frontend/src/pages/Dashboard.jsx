import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, Plus, LogOut, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income']
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Rent', 'Utilities', 'Other']
const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316']

const StatCard = ({ title, amount, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass rounded-2xl p-5"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-400 text-sm">{title}</span>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-display font-bold text-white">
      ₹{Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </p>
  </motion.div>
)

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ type: 'EXPENSE', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    try {
      const [txRes, sumRes, catRes, monRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/transactions/summary'),
        api.get('/transactions/category-breakdown'),
        api.get('/transactions/monthly-summary'),
      ])
      setTransactions(txRes.data)
      setSummary(sumRes.data)
      // Category pie data
      const catArr = Object.entries(catRes.data).map(([name, value]) => ({ name, value: Number(value) }))
      setCategoryData(catArr)
      // Monthly bar data
      const monthMap = {}
      monRes.data.forEach(({ month, year, type, total }) => {
        const key = `${year}-${String(month).padStart(2, '0')}`
        if (!monthMap[key]) monthMap[key] = { month: key, income: 0, expense: 0 }
        if (type === 'INCOME') monthMap[key].income = Number(total)
        else monthMap[key].expense = Number(total)
      })
      setMonthlyData(Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/transactions', { ...form, amount: parseFloat(form.amount) })
      setShowModal(false)
      setForm({ type: 'EXPENSE', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
      fetchAll()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`)
    fetchAll()
  }

  const categories = form.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <div className="min-h-screen bg-[#0f1117] p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">SpendWise</span>
          </div>
          <p className="text-slate-400 text-sm">Welcome back, <span className="text-white font-medium">{user?.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            <Plus size={16} /> Add Transaction
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition">
            <LogOut size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Balance" amount={summary.balance} icon={Wallet} color="bg-sky-500" delay={0} />
        <StatCard title="Total Income" amount={summary.totalIncome} icon={TrendingUp} color="bg-emerald-500" delay={0.1} />
        <StatCard title="Total Expenses" amount={summary.totalExpense} icon={TrendingDown} color="bg-red-500" delay={0.2} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-white mb-4">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-white mb-4">Expense by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #334155', borderRadius: 8 }}
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No expense data yet</div>
          )}
        </motion.div>
      </div>

      {/* Transactions list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5">
        <h3 className="font-display font-semibold text-white mb-4">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No transactions yet. Add one!</p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {transactions.map((tx, i) => (
                <motion.div key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition group">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                      ${tx.type === 'INCOME' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                      {tx.category[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{tx.category}</p>
                      <p className="text-slate-500 text-xs">{tx.description || tx.type} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                    </span>
                    <button onClick={() => handleDelete(tx.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-light rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-display font-bold text-white text-lg mb-5">Add Transaction</h3>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* Type toggle */}
                <div className="flex rounded-xl overflow-hidden border border-white/10">
                  {['EXPENSE', 'INCOME'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t, category: '' })}
                      className={`flex-1 py-2.5 text-sm font-semibold transition ${form.type === t
                        ? t === 'INCOME' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        : 'text-slate-400 hover:text-white'}`}>
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">Amount (₹)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00" required min="0.01" step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50 transition" />
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required
                    className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50 transition">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">Description (optional)</label>
                  <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="What was this for?"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50 transition" />
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/50 transition" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition">
                    Cancel
                  </button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    type="submit" disabled={loading}
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-60">
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
