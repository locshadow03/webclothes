import React, { useEffect, useState } from 'react';
import registerImage from '../img/register.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/Auth';
// import "../../css/main.css";

const Login = () => {
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await login(formData);
            if (success.statusCode === 200) {
              localStorage.setItem("username", success.username);
              setFormData({
                  username: '',
                  password: '',
            });
            localStorage.setItem("token", success.token);
            localStorage.setItem("role", success.role);
            setSuccessMessage('Đăng nhập thành công!');
            setErrorMessage('')
          } else if(success.statusCode === 404){
            setErrorMessage('Không tồn tại tài khoản!')
          } else if(success.statusCode === 401){
            setErrorMessage('Nhập sai tên tài khoản hoặc password!')
          }

        } catch (error) {
            console.error('Error registering user:', error);
            setErrorMessage('Đăng nhập thất bại!');
        }
    };

    useEffect(() => {
        if (successMessage) {
            const role = localStorage.getItem("role");
            const timer = setTimeout(() => {
                 if (role.includes("ADMIN")) {
                    navigate('/dashboard/category');
                 }
                  else if (role.includes("USER")) {
                     navigate('/home');
                 }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

  return (
    <div>
      <div className="container-fluid" style={{ height: '800px' }}>
        <div className="d-flex justify-content-center align-items-center h-100 w-100">
          <div className="bg-white" style={{ width: '75%', borderRadius: '15px' }}>
            <div className="h-100">
              <div className="row h-100">
                <div className="col-xl-6 col-lg-6">
                  <div className="logo w-100 h-100">
                    <div className="h-100 w-100">
                      <img src={registerImage} className="img-fluid" alt="Logo" style={{ objectFit: 'cover', height: '100%', width: '100%', borderRadius: '15px' }}/>
                    </div>
                  </div>
                </div>

                <form className="col-xl-6 col-lg-6" onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center align-items-center h-100 mx-3">
                    <div className="inputlogin w-100 h-100" style={{ borderRadius: '40px' }}>
                      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center ">
                        <div className="mt-1 d-flex justify-content-center align-items-center">
                          <h3 className="fw-bold">Login</h3>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success w-100" role="alert">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="alert alert-danger w-100" role="alert">
                                {errorMessage}
                            </div>
                        )}


                        <div className="mt-2 w-100">

                          <div className="col-12 mt-4">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control rounded-input"
                                id="username"
                                name="username"
                                placeholder="User name"
                                style={{ backgroundColor: '#d3d3d3', borderRadius: '0 40px 40px 0' }}
                                value={formData.username}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                    
                        <div className="mt-2 w-100">
                          <div className="col-12 mt-4">
                            <div className="input-group">
                              <input
                                type="password"
                                className="form-control rounded-input"
                                id="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                style={{ backgroundColor: '#d3d3d3', borderRadius: '0 40px 40px 0' }}
                                value={formData.password}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row justify-content-center mt-3 w-100">
                          <div className="col-6">
                            <button type="submit" className="btn form-control btn-primary shadow-lg">Login</button>
                          </div>

                          <div className="text-center mt-3">
                            <Link to = "/auth/register" className="small">Register</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
