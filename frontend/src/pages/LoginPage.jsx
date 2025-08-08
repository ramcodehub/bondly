import { useState } from 'react'
import { Card } from '../../shared-ui/src'
import { apiService } from '../services/apiService'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (isLogin) {
        await apiService.auth.login({ email: formData.email, password: formData.password })
        alert('Login successful!')
      } else {
        await apiService.auth.register({ email: formData.email, password: formData.password, name: formData.name })
        alert('Registration successful!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center pt-16 md:pt-20">
      <div className="w-full max-w-md">
        <Card>
          <h2 className="text-center text-xl sm:text-2xl font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="w-full border rounded px-3 py-2 text-sm" type="text" name="name" value={formData.name} onChange={handleChange} required={!isLogin} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="w-full border rounded px-3 py-2 text-sm" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input className="w-full border rounded px-3 py-2 text-sm" type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700" type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button className="text-blue-600 hover:underline ml-2" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage