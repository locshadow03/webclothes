import React from 'react';

const FooterHome = () => {
  return (
    <footer className="bg-light text-center text-lg-start" id="contact">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Liên hệ</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <i className="bi bi-geo-alt-fill"></i> Địa chỉ: Yên Phụ, Yên Phong, Bắc Ninh.
              </li>
              <li>
                <i className="bi bi-phone"></i> Số điện thoại: 0342612107
              </li>
              <li>
                <i className="bi bi-envelope-fill"></i> Email: locchuvan89@gmail.com
              </li>
            </ul>
            <div className="mt-4">
              <a href="#!" className="text-dark mx-1"><i className="bi bi-facebook"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-twitter"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-instagram"></i></a>
              <a href="#!" className="text-dark mx-1"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Liên kết nhanh</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#home" className="text-dark">Trang chủ</a>
              </li>
              <li>
                <a href="#product" className="text-dark">Sản phẩm</a>
              </li>
              <li>
                <a href="#brand" className="text-dark">Nhãn hàng</a>
              </li>
              <li>
                <a href="#contact" className="text-dark">Liên hệ</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">Gửi câu hỏi</h5>
            <form action="submit.php" method="POST">
              <div className="form-group mt-2">
                <input type="text" className="form-control" placeholder="Tên của bạn" name="name" required />
              </div>
              <div className="form-group mt-2">
                <input type="email" className="form-control" placeholder="Email của bạn" name="email" required />
              </div>
              <div className="form-group mt-2">
                <input type="tel" className="form-control" placeholder="Số điện thoại của bạn" name="phone" required />
              </div>
              <div className="form-group mt-2">
                <textarea className="form-control" rows="4" placeholder="Tin nhắn của bạn" name="message" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary mt-2">Gửi</button>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 Bản quyền thuộc về:
        <a className="text-dark" href="https://shopquanao.com/">Shop Quần Áo</a>
      </div>
    </footer>
  );
};

export default FooterHome;
