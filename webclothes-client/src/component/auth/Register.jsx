import React, { useState } from 'react';
// import "../../css/main.css";
import registerImage from '../img/register1.jpg';
import { Link} from 'react-router-dom';
import { register } from '../../api/Auth';

const Register = () => {

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [errorMessageUserName, setErrorMessageUserName] = useState("");

    const [errorMessageEmail, setErrorMessageEmail] = useState("");
    
    const [errorMessagePassWord, setErrorMessagePassWord] = useState("");

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [confirmPassword, setConfirmPassword] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
        if (name === 'email') {
            setErrorMessageEmail('');
        } else if (name === 'username') {
            setErrorMessageUserName('');
        } else if (name === 'password') {
            setErrorMessagePassWord('');
        }
            setFormData({ ...formData, [name]: value });
    };
    const handleConfirmPasswordChange = (e) => {
        let value = e.target.value;
        setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
          return;
        } 
        if (formData.password !== confirmPassword) {
            setErrorMessage('Mật khẩu không đồng bộ!');
            return;
        }
        try {
            const success = await register(formData);
            if (success.statusCode === 200) {
              setFormData({
                  username: '',
                  email: '',
                  password: '',
              });
              setSuccessMessage('Đăng ký thành công');
              setErrorMessage('')
          } else if(success.statusCode === 400) {
              setErrorMessage(success.message);
          }

        } catch (error) {
            console.error('Error registering user:', error);
            setErrorMessage('Đăng ký thất bại!');
        }
    };

    const validateForm = () => {
      let isValid = true;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
          setErrorMessageEmail('Invalid email format');
          isValid = false;
      }
  
      if (formData.username.length < 3 || formData.username.length > 10) {
          setErrorMessageUserName('Username must be between 3 and 10 characters');
          isValid = false;
      }
  
      if (formData.password.length < 6 || formData.password.length > 10) {
          setErrorMessagePassWord('Password must be between 6 and 10 characters');
          isValid = false;
      }
  
      return isValid;
  };

  return (
    <div>
      <div className="container-fluid" style={{ height: '800px' }}>
        <div className="d-flex justify-content-center align-items-center h-100 w-100">
          <div className="bg-white" style={{ width: '75%', borderRadius: '15px' }}>
            <div className="h-100">
              <div className="row h-100">
                <div className="col-xl-6 col-lg-6">
                  <div className="logo">
                    <div className="h-100 w-100">
                      <img src={registerImage} className="img-fluid" alt="Logo" style={{ objectFit: 'cover', height: '100%', width: '100%', borderRadius: '15px' }}/>
                    </div>
                  </div>
                </div>

                <form className="col-xl-6 col-lg-6" onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center align-items-center h-100 mx-4">
                    <div className="inputlogin" style={{ borderRadius: '40px' }}>
                      <div className="w-100 h-100">
                        <div className="mt-1 d-flex justify-content-center align-items-center">
                          <h3 className="fw-bold">Register</h3>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success mt-3" role="alert">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {errorMessage}
                            </div>
                        )}


                        <div className="row justify-content-center mt-2">

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
                        {errorMessageUserName && (
                            <div className="alert alert-danger mt-1" role="alert">
                                {errorMessageUserName}
                            </div>
                        )}

                        <div className="row mt-4 justify-content-center">
                          <div className="col-12">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control rounded-input"
                                id="email"
                                name="email"
                                placeholder="Email address"
                                style={{ backgroundColor: '#d3d3d3', borderRadius: '0 40px 40px 0' }}
                                value={formData.email}
                                onChange={handleChange}
                          
                              />
                            </div>
                          </div>
                        </div>

                        {errorMessageEmail && (
                            <div className="alert alert-danger mt-1" role="alert">
                                {errorMessageEmail}
                            </div>
                        )}

                        <div className="row justify-content-center">
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

                          <div className="col-12 mt-4">
                            <div className="input-group">
                              <input
                                type="password"
                                className="form-control rounded-input"
                                id="repeatPassword"
                                name="repeatPassword"
                                placeholder="Nhập lại mật khẩu"
                                style={{ backgroundColor: '#d3d3d3', borderRadius: '0 40px 40px 0' }}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                              />
                            </div>
                          </div>
                        </div>
                        {errorMessagePassWord && (
                            <div className="alert alert-danger mt-1" role="alert">
                                {errorMessagePassWord}
                            </div>
                        )}

                        <div className="row justify-content-center mt-4">
                          <div className="col-6">
                            <button type="submit" className="btn form-control btn-primary shadow-lg">Register</button>
                          </div>

                          <div className="text-center mt-3">
                            <Link to = "/auth/login" className="small">Already have an account? Login!</Link>
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
  );
};

export default Register;
