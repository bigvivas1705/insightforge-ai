import { useState } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from "recharts"

export default function Predict() {
  const [file, setFile] = useState(null)
  const [targetColumn, setTargetColumn] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handlePredict = async () => {
    if (!file) return setError("Please select a CSV file.")
    if (!targetColumn) return setError("Please enter a target column.")
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await client.post(`/predict?target_column=${targetColumn}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setResult(res.data)
    } catch (err) {
      if (err.response?.status === 401) navigate("/")
      setError(err.response?.data?.detail || "Prediction failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const predictionChartData = result?.predictions.map((val, i) => ({
    name: `#${i + 1}`,
    predicted: parseFloat(val.toFixed(2))
  }))

  const accuracyData = result ? [
    { name: "R² Score", value: parseFloat((result.r2_score * 100).toFixed(1)), fill: "#7C3AED" }
  ] : []

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-[#0F172A] cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          InsightForge <span className="text-[#7C3AED]">AI</span>
        </motion.h1>
        <div className="flex items-center gap-6">
          <span onClick={() => navigate("/dashboard")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Dashboard</span>
          <span onClick={() => navigate("/upload")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Upload</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-[#0F172A]">ML Predictions</h2>
          <p className="text-slate-500 text-sm mt-1">Upload a CSV and choose a target column to predict</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6"
        >
          <div
            className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-[#7C3AED] transition"
            onClick={() => document.getElementById("predictFileInput").click()}
          >
            <p className="text-4xl mb-3">🤖</p>
            <p className="text-slate-600 font-medium">{file ? file.name : "Click to select a CSV file"}</p>
            <p className="text-slate-400 text-sm mt-1">Only .csv files are supported</p>
            <input
              id="predictFileInput"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700">Target Column</label>
            <input
              type="text"
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              placeholder="e.g. performance_score, salary, price"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mt-4">{error}</div>
          )}

          <button
            onClick={handlePredict}
            disabled={loading || !file || !targetColumn}
            className="mt-6 w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Running Model...
              </span>
            ) : "Run Prediction"}
          </button>
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Model", value: result.model, color: "text-[#0F172A]" },
                { label: "Target Column", value: result.target_column, color: "text-[#7C3AED]" },
                { label: "Training Samples", value: result.training_samples, color: "text-[#0F172A]" },
                { label: "Testing Samples", value: result.testing_samples, color: "text-[#7C3AED]" },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Accuracy Gauge + MSE */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 font-medium mb-4">R² Score (Accuracy)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="60%" outerRadius="90%"
                    data={accuracyData}
                    startAngle={90} endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "#f1f5f9" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <p className="text-center text-3xl font-bold text-[#7C3AED] mt-2">{result.r2_score}</p>
                <p className="text-center text-slate-400 text-sm mt-8">out of 1.0</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center items-center">
                <p className="text-sm text-slate-500 font-medium mb-2">Mean Squared Error</p>
                <p className="text-5xl font-bold text-[#0F172A] mt-4">{result.mean_squared_error}</p>
                <p className="text-slate-400 text-sm mt-4 text-center">Lower is better — measures average prediction error</p>
              </div>
            </div>

            {/* Predictions Bar Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-semibold text-[#0F172A] mb-6">Predicted Values</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={predictionChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="predicted" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Predictions Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-[#0F172A]">Sample Predictions</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Predicted Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.predictions.map((val, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-[#7C3AED]">{val.toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}