import { useState, useEffect } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1000
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <span>{count}</span>
}

export default function Dashboard() {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await client.get("/datasets")
        setDatasets(res.data)
      } catch (err) {
        if (err.response?.status === 401) navigate("/")
      } finally {
        setLoading(false)
      }
    }
    fetchDatasets()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const totalRows = datasets.reduce((acc, d) => acc + (d.rows_count || 0), 0)
  const avgCols = datasets.length
    ? Math.round(datasets.reduce((acc, d) => acc + (d.columns_count || 0), 0) / datasets.length)
    : 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-[#0F172A]"
        >
          InsightForge <span className="text-[#7C3AED]">AI</span>
        </motion.h1>
        <div className="flex items-center gap-6">
          <span onClick={() => navigate("/upload")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Upload</span>
          <span onClick={() => navigate("/predict")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Predict</span>
          <button onClick={handleLogout} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-[#0F172A]">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Overview of your uploaded datasets</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Datasets", value: datasets.length, color: "text-[#0F172A]" },
            { label: "Total Rows Processed", value: totalRows, color: "text-[#7C3AED]" },
            { label: "Avg Columns", value: avgCols, color: "text-[#0F172A]" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                <AnimatedCounter value={stat.value} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Datasets Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-[#0F172A]">Recent Uploads</h3>
            <button
              onClick={() => navigate("/upload")}
              className="text-sm bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-lg font-medium transition"
            >
              + New Upload
            </button>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : datasets.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No datasets uploaded yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Filename</th>
                  <th className="px-6 py-3 text-left">Rows</th>
                  <th className="px-6 py-3 text-left">Columns</th>
                  <th className="px-6 py-3 text-left">Uploaded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datasets.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-[#0F172A]">{d.filename}</td>
                    <td className="px-6 py-4 text-slate-600">{d.rows_count}</td>
                    <td className="px-6 py-4 text-slate-600">{d.columns_count}</td>
                    <td className="px-6 py-4 text-slate-500">{d.uploaded_at}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </div>
  )
}
