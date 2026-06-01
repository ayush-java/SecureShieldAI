import { useState } from "react"

function Login({ setIsAuthenticated }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {

    e.preventDefault()

    setError("")

    try {

      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        setError("Invalid credentials")
        return
      }

      if (response.status === 403) {
        setError("IP temporarily blocked")
        return
      }

      if (!response.ok) {
        setError("Backend error")
        return
      }

      setError("")
      console.log(data)

      setIsAuthenticated(true)

    } catch (err) {

      console.error(err)

      setError("Unable to reach backend server")

    }

  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ff8840,transparent_70%)]"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-lg border border-green-500/20 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-green-400 text-center mb-2">
          SecureShield AI
        </h1>

        <p className="text-gray-400 text-center mb-8">
          SOC Analyst Access Portal
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>

          <div>

            <label className="block text-green-400 mb-2">
              Email
            </label>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-green-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-green-400"
            />

          </div>

          <div>

            <label className="block text-green-400 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-green-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-green-400"
            />

          </div>

          {error && (
            <div className="text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 transition-all duration-300 text-black font-bold py-3 rounded-lg"
          >
            ACCESS SOC DASHBOARD
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login