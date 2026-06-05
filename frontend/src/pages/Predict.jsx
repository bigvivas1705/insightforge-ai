import { useState } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"

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

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-[#0F172A] cursor-pointer" onClick={() => navigate("/dashboard")}>InsightForge <span className="text-[#7C3AED]">AI</span></h1>
        <div className="flex items-center gap-6">
          <span onClick={() => navigate("/dashboard")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Dashboard</span>
          <span onClick={() => navigate("/upload")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Upload</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">ML Predictions</h2>
          <p className="text-slate-500 text-sm mt-1">Upload a CSV and choose a target column to predict</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
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
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={loading || !file || !targetColumn}
            className="mt-6 w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Running Model..." : "Run Prediction"}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Model</p>
                <p className="text-xl font-bold text-[#0F172A] mt-1">{result.model}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Target Column</p>
                <p className="text-xl font-bold text-[#7C3AED] mt-1">{result.target_column}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">R² Score (Accuracy)</p>
                <p className="text-3xl font-bold text-[#0F172A] mt-1">{result.r2_score}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Mean Squared Error</p>
                <p className="text-3xl font-bold text-[#7C3AED] mt-1">{result.mean_squared_error}</p>
              </div>
            </div>

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
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-[#7C3AED]">{val.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}