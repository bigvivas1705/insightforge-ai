import { useState } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"

export default function Upload() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return setError("Please select a CSV file.")
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setResult(res.data)
    } catch (err) {
      if (err.response?.status === 401) navigate("/")
      setError("Upload failed. Please try again.")
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
          <span onClick={() => navigate("/predict")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Predict</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">Upload Dataset</h2>
          <p className="text-slate-500 text-sm mt-1">Upload a CSV file to get instant analytics</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
          <div
            className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-[#7C3AED] transition"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <p className="text-4xl mb-3">📁</p>
            <p className="text-slate-600 font-medium">{file ? file.name : "Click to select a CSV file"}</p>
            <p className="text-slate-400 text-sm mt-1">Only .csv files are supported</p>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="mt-6 w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <p className="text-sm text-slate-500">Rows</p>
                <p className="text-3xl font-bold text-[#0F172A] mt-1">{result.rows}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <p className="text-sm text-slate-500">Columns</p>
                <p className="text-3xl font-bold text-[#7C3AED] mt-1">{result.columns}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <p className="text-sm text-slate-500">Missing Values</p>
                <p className="text-3xl font-bold text-[#0F172A] mt-1">
                  {result.column_summary.reduce((acc, c) => acc + c.missing_values, 0)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-[#0F172A]">Column Summary</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left">Column</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Missing</th>
                    <th className="px-6 py-3 text-left">Missing %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.column_summary.map((col) => (
                    <tr key={col.column} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-[#0F172A]">{col.column}</td>
                      <td className="px-6 py-4 text-slate-600">{col.dtype}</td>
                      <td className="px-6 py-4 text-slate-600">{col.missing_values}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${col.missing_percent > 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                          {col.missing_percent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-[#0F172A]">Data Preview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      {result.preview[0] && Object.keys(result.preview[0]).map((key) => (
                        <th key={key} className="px-6 py-3 text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.preview.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-6 py-4 text-slate-600">{val ?? "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


