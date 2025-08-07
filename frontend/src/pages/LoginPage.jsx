import { useState } from 'react'
import { Input } from '@shared-ui/components/Input'
import { Button } from '@shared-ui/components/Button'
import { Card } from '@shared-ui/components/Card'

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
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }
      
      // Handle successful login/registration
      console.log('Success:', data)
      alert(isLogin ? 'Login successful!' : 'Registration successful!')
      
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card>
          <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="mb-3">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="d-grid gap-2">
              <Button type="submit" variant="primary">
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </div>
          </form>
          
          <div className="text-center mt-3">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button 
                variant="link" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register' : 'Login'}
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage