import React, { useEffect, useState } from 'react';
import { getCountOrders, getTopCustomerAll, getTopCustomerMonth, getTopCustomerToDay, getTopCustomerYear, getTopProductOrderAll, getTopProductOrderMonth, getTopProductOrderToday, getTopProductOrderYear, getTotalAmount } from '../../../api/Order';
import { getTotalUser } from '../../../api/User';
import { getTopFavoriteProductAll, getTopFavoriteProductMonth, getTopFavoriteProductToday, getTopFavoriteProductYear } from '../../../api/FavoriteProduct';

const DashBoard = () => {
    const[countTotal, setCountTotal] = useState();
    const[totalCount, setTotalCount] = useState(0);

    const[totalAmount, setTotalAmount] = useState(0);
    const[totalUser, setTotalUser] = useState(0);
    const[topCustomer, setTopCustomer] = useState([]);
    const[topProduct, setTopProduct] = useState([]);
    const[topFavoriteProduct, setTopFavoriteProduct] = useState([]);

    const[errorMessage, setErrorMessage] = useState("")
    const[successMessage, setSuccessMessage] = useState("")

    const fetchCountOrder = async () =>{
        try{
            const result = await getCountOrders()
            setCountTotal(result)
            if (selectedPeriod1 === 'Theo ngày') {
                setTotalCount(result.countDate);
            } else if (selectedPeriod1 === 'Theo tháng') {
                setTotalCount(result.countMonth);
            } else if (selectedPeriod1 === 'Theo năm') {
                setTotalCount(result.countYear);
            } else {
                setTotalCount(result.countTotal);
            }
        } catch(error){
            setErrorMessage(error)
        }
    }

    const fetchTotalAmount = async () =>{
        try{
            const result = await getTotalAmount()
            setTotalAmount(result)
            if (selectedPeriod2 === 'Theo ngày') {
                setTotalAmount(result.totalAmountToday)
            } else if (selectedPeriod2 === 'Theo tháng') {
                setTotalAmount(result.totalAmountThisMonth);
            } else if (selectedPeriod2 === 'Theo năm') {
                setTotalAmount(result.totalAmountThisYear);
            } else {
                setTotalAmount(result.totalAmountAllTime);
            }
        } catch(error){
            setErrorMessage(error)
        }
    }

    const fetchTotalUser = async () =>{
      try{
          const result = await getTotalUser()
          setTotalUser(result)
          if (selectedPeriod3 === 'Theo ngày') {
              setTotalUser(result.totalUserToday)
          } else if (selectedPeriod3 === 'Theo tháng') {
              setTotalUser(result.totalUserMonth);
          } else if (selectedPeriod3 === 'Theo năm') {
              setTotalUser(result.totalUserYear);
          } else {
              setTotalUser(result.totalUserAll);
          }
      } catch(error){
          setErrorMessage(error)
      }
  }

  const fetchTopCustomer = async () =>{
    try{
        
        let result
        if (selectedPeriod4 === 'Theo ngày') {
          result = await getTopCustomerToDay()
        } else if (selectedPeriod4 === 'Theo tháng') {
          result = await getTopCustomerMonth()
        } else if (selectedPeriod4 === 'Theo năm') {
          result = await getTopCustomerYear()
        } else {
          result = await getTopCustomerAll()
        }
        setTopCustomer(result)
    } catch(error){
        setErrorMessage(error)
    }
}

const top5Customers = topCustomer.slice(0, 5);

const fetchTopProduct = async () =>{
  try {
    let result;
    if (selectedPeriod5 === 'Theo ngày') {
      result = await getTopProductOrderToday();
    } else if (selectedPeriod5 === 'Theo tháng') {
      result = await getTopProductOrderMonth();
    } else if (selectedPeriod5 === 'Theo năm') {
      result = await getTopProductOrderYear();
    } else {
      result = await getTopProductOrderAll();
    }
    setTopProduct(result);
  } catch (error) {
    setErrorMessage("Error fetching top products.");
  }

}
  const top5Products = topProduct.slice(0, 5);

  const fetchTopFavorite = async () =>{
    try {
      let result;
      if (selectedPeriod6 === 'Theo ngày') {
        result = await getTopFavoriteProductToday();
      } else if (selectedPeriod6 === 'Theo tháng') {
        result = await getTopFavoriteProductMonth();
      } else if (selectedPeriod6 === 'Theo năm') {
        result = await getTopFavoriteProductYear();
      } else {
        result = await getTopFavoriteProductAll();
      }
      setTopFavoriteProduct(result);
    } catch (error) {
      setErrorMessage("Error fetching top favorite products.");
    }
  
  }
    const top5FavoriteProducts = topFavoriteProduct.slice(0, 5);
    
    

  // State để lưu trữ lựa chọn hiện tại
  const [selectedPeriod1, setSelectedPeriod1] = useState('Theo ngày');

  // Hàm xử lý sự kiện chọn dropdown
  const handleDropdownClick1 = (period) => {
    setSelectedPeriod1(period);
  };

  // State để lưu trữ lựa chọn hiện tại
  const [selectedPeriod2, setSelectedPeriod2] = useState('Theo ngày');

  // Hàm xử lý sự kiện chọn dropdown
  const handleDropdownClick2 = (period) => {
    setSelectedPeriod2(period);
  };

  // State để lưu trữ lựa chọn hiện tại
  const [selectedPeriod3, setSelectedPeriod3] = useState('Theo ngày');

  // State để lưu trữ lựa chọn hiện tại
  const [selectedPeriod4, setSelectedPeriod4] = useState('Theo ngày');

    // State để lưu trữ lựa chọn hiện tại
    const [selectedPeriod5, setSelectedPeriod5] = useState('Theo ngày');

    // State để lưu trữ lựa chọn hiện tại
    const [selectedPeriod6, setSelectedPeriod6] = useState('Theo ngày');

  // Hàm xử lý sự kiện chọn dropdown
  const handleDropdownClick3 = (period) => {
    setSelectedPeriod3(period);
  };

  const handleDropdownClick4 = (period) => {
    setSelectedPeriod4(period);
  };

  const handleDropdownClick5 = (period) => {
    setSelectedPeriod5(period);
  };

  const handleDropdownClick6 = (period) => {
    setSelectedPeriod6(period);
  };

  useEffect(() =>{
    fetchCountOrder()
    fetchTotalAmount()
    fetchTotalUser()
    console.error("CountOrders", countTotal)
})
  useEffect(() => {
    fetchCountOrder()
  }, [selectedPeriod1]);

  useEffect(() => {
    fetchTotalAmount()
  }, [selectedPeriod2]);

  useEffect(() => {
    fetchTotalUser()
  }, [selectedPeriod3]);

  useEffect(() => {
    fetchTopCustomer()
  }, [selectedPeriod4]);

  useEffect(() => {
    fetchTopProduct();
  }, [selectedPeriod5]);

  useEffect(() => {
    fetchTopFavorite()
  }, [selectedPeriod6]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };
  

  return (
    <>
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-4 col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <div className='d-flex justify-content-between align-items-end'>
                  <div className="d-flex justify-content-start align-items-end">
                    <h5 className="card-title m-0" style={{ color: "red" }}>Đơn hàng</h5>
                    <p className='m-0 mx-2' style={{ fontSize: "15px", color: "#808080" }}>
                      {selectedPeriod1}
                    </p>
                  </div>
                  <div className="dropdown">
                    <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                      ...
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick1('Theo ngày')}>Theo ngày</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick1('Theo tháng')}>Theo tháng</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick1('Theo năm')}>Theo năm</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick1('Tổng')}>Tổng</button></li>
                    </ul>
                  </div>
                </div>
                    <div className='d-flex justify-content-start align-items-center my-3'>
                        <div className='rounded-circle d-flex justify-content-center align-items-center' style = {{height : '60px', width : '60px', backgroundColor : 'violet'}}><i class="bi bi-cart" style = {{fontSize : '30px'}}></i></div>
                        <h5 className="card-text m-0 mx-2" id="total-orders" style = {{color: "red"}}>{totalCount}</h5>
                        <p className="card-text m-0 mx-1" id="total-orders">Đơn hàng</p>
                    </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <div className='d-flex justify-content-between align-items-end'>
                  <div className="d-flex justify-content-start align-items-end">
                    <h5 className="card-title m-0" style={{ color: "green" }}>Doanh thu</h5>
                    <p className='m-0 mx-2' style={{ fontSize: "15px", color: "#808080" }}>
                      {selectedPeriod2}
                    </p>
                  </div>
                  <div className="dropdown">
                    <button className="btn" type="button" id="dropdownMenuButtonRevenue" data-bs-toggle="dropdown" aria-expanded="false">
                      ...
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonRevenue">
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick2('Theo ngày')}>Theo ngày</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick2('Theo tháng')}>Theo tháng</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick2('Theo năm')}>Theo năm</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick2('Tổng')}>Tổng</button></li>
                    </ul>
                  </div>
                </div>
                <div className='d-flex justify-content-start align-items-center my-3'>
                  <div className='rounded-circle d-flex justify-content-center align-items-center' style={{ height: '60px', width: '60px', backgroundColor: 'blue' }}>
                    <i className="bi bi-cash" style={{ fontSize: '30px' }}></i>
                  </div>
                  <h5 className="card-text m-0 mx-2" id="total-revenue" style={{ color: "green" }}>{formatCurrency(totalAmount)}</h5>
                  <p className="card-text m-0 mx-1">Doanh thu</p>
                </div>
              </div>
            </div>
          </div>

        <div className="col-lg-4 col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <div className='d-flex justify-content-between align-items-end'>
                  <div className="d-flex justify-content-start align-items-end">
                    <h5 className="card-title m-0" style={{ color: "purple" }}>Người đăng ký</h5>
                    <p className='m-0 mx-2' style={{ fontSize: "15px", color: "#808080" }}>
                      {selectedPeriod3}
                    </p>
                  </div>
                  <div className="dropdown">
                    <button className="btn" type="button" id="dropdownMenuButtonRegistrations" data-bs-toggle="dropdown" aria-expanded="false">
                      ...
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonRegistrations">
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick3('Theo ngày')}>Theo ngày</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick3('Theo tháng')}>Theo tháng</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick3('Theo năm')}>Theo năm</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick3('Tổng')}>Tổng</button></li>
                    </ul>
                  </div>
                </div>
                <div className='d-flex justify-content-start align-items-center my-3'>
                  <div className='rounded-circle d-flex justify-content-center align-items-center' style={{ height: '60px', width: '60px', backgroundColor: 'orange' }}>
                    <i className="bi bi-person-plus" style={{ fontSize: '30px' }}></i>
                  </div>
                  <h5 className="card-text m-0 mx-2" id="total-registrations" style={{ color: "purple" }}>{totalUser}</h5>
                  <p className="card-text m-0 mx-1">Người đăng ký</p>
                </div>
              </div>
            </div>
        </div>
        </div>

        <div className="col-lg-12 col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <div className='d-flex justify-content-between align-items-end'>
                  <div className="d-flex justify-content-start align-items-end">
                    <h5 className="card-title m-0" style={{ color: "purple" }}>Top 5 người dùng chi tiêu nhiều nhất</h5>
                    <p className='m-0 mx-2' style={{ fontSize: "15px", color: "#808080" }}>
                      {selectedPeriod4}
                    </p>
                  </div>
                  <div className="dropdown">
                    <button className="btn" type="button" id="dropdownMenuButtonRegistrations" data-bs-toggle="dropdown" aria-expanded="false">
                      ...
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonRegistrations">
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick4('Theo ngày')}>Theo ngày</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick4('Theo tháng')}>Theo tháng</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick4('Theo năm')}>Theo năm</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick4('Tổng')}>Tổng</button></li>
                    </ul>
                  </div>
                </div>
                <div className='my-3'>
                  <table className = "table table-hover">
                    <thead>
                      <tr>
                      <th className='col-1' style = {{color: "#808080"}}>#</th>
                        <th className='col-2' style = {{color: "#808080"}}>Họ</th>
                        <th className='col-1' style = {{color: "#808080"}}>Tên</th>
                        <th className='col-2' style = {{color: "#808080"}}>Số điện thoại</th>
                        <th className='col-3' style = {{color: "#808080"}}>Địa chỉ</th>
                        <th className='col-3' style = {{color: "#808080"}}>Tổng chi tiêu</th>
                      </tr>
                    </thead>

                    <tbody>
                    {top5Customers.map((customer, index) => (
                        <tr key={customer.id} className='text-start'>
                          <td>{index + 1}</td>
                          <td>{customer.lastName}</td>
                          <td>{customer.firstName}</td>
                          <td>{customer.phoneNumber}</td>
                          <td style = {{color: "green"}}>{customer.address}</td>
                          <td style = {{color: "red"}}>{formatCurrency(customer.totalAmount)}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>

        <div className="col-lg-12 col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <div className='d-flex justify-content-between align-items-end'>
                  <div className="d-flex justify-content-start align-items-end">
                    <h5 className="card-title m-0" style={{ color: "purple" }}>Top 5 sản phẩm được mua nhiều nhất</h5>
                    <p className='m-0 mx-2' style={{ fontSize: "15px", color: "#808080" }}>
                      {selectedPeriod5}
                    </p>
                  </div>
                  <div className="dropdown">
                    <button className="btn" type="button" id="dropdownMenuButtonRegistrations" data-bs-toggle="dropdown" aria-expanded="false">
                      ...
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonRegistrations">
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick5('Theo ngày')}>Theo ngày</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick5('Theo tháng')}>Theo tháng</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick5('Theo năm')}>Theo năm</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick5('Tổng')}>Tổng</button></li>
                    </ul>
                  </div>
                </div>
                <div className='my-3'>
                  <table className = "table table-hover">
                    <thead>
                      <tr>
                        <th className='col-1' style = {{color: "#808080"}}>#</th>
                        <th className='col-3' style = {{color: "#808080"}}></th>
                        <th className='col-3' style = {{color: "#808080"}}>Tên sản phẩm</th>
                        <th className='col-2' style = {{color: "#808080"}}>Giá</th>
                        <th className='col-1' style = {{color: "#808080"}}>Số lượng</th>
                        <th className='col-2' style = {{color: "#808080"}}>Giảm giá</th>
                      </tr>
                    </thead>

                    <tbody>
                      {top5Products.map((product, index) => (
                        <tr key = {product.id} className='text-start'>
                          <td>{index + 1}</td>
                          <td>
                            {product.img && (
                              <img
                              src={`data:image/jpeg;base64,${product.img}`}
                              alt={`Photo of ${product.img}`}
                              style={{ width: '150px', height: '100px',objectFit: "cover"}}
                              />
                            )}
                          </td>
                          <td style = {{color: "blue"}}>{product.nameProduct}</td>
                          <td style = {{color: "red"}}>{formatCurrency(product.price)}</td>
                          <td style = {{color: "green"}}>{product.totalProductOrder}</td>
                          <td style = {{color: "red"}}>{product.discount}%</td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
        </div>

        <div className="col-lg-12 col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <div className='d-flex justify-content-between align-items-end'>
                  <div className="d-flex justify-content-start align-items-end">
                    <h5 className="card-title m-0" style={{ color: "purple" }}>Top 5 sản phẩm được yêu thích nhất</h5>
                    <p className='m-0 mx-2' style={{ fontSize: "15px", color: "#808080" }}>
                      {selectedPeriod6}
                    </p>
                  </div>
                  <div className="dropdown">
                    <button className="btn" type="button" id="dropdownMenuButtonRegistrations" data-bs-toggle="dropdown" aria-expanded="false">
                      ...
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonRegistrations">
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick6('Theo ngày')}>Theo ngày</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick6('Theo tháng')}>Theo tháng</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick6('Theo năm')}>Theo năm</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDropdownClick6('Tổng')}>Tổng</button></li>
                    </ul>
                  </div>
                </div>
                <div className='my-3'>
                <table className = "table table-hover">
                    <thead>
                      <tr>
                        <th className='col-1' style = {{color: "#808080"}}>#</th>
                        <th className='col-3' style = {{color: "#808080"}}></th>
                        <th className='col-3' style = {{color: "#808080"}}>Tên sản phẩm</th>
                        <th className='col-2' style = {{color: "#808080"}}>Giá</th>
                        <th className='col-2' style = {{color: "#808080"}}>Số lượt thích</th>
                        <th className='col-1' style = {{color: "#808080"}}>Giảm giá</th>
                      </tr>
                    </thead>

                    <tbody>
                      {top5FavoriteProducts.map((favoriteProduct, index) => (
                        <tr key = {favoriteProduct.id} className='text-start'>
                          <td>{index + 1}</td>
                          <td>
                            {favoriteProduct.avatar && (
                              <img
                              src={`data:image/jpeg;base64,${favoriteProduct.avatar}`}
                              alt={`Photo of ${favoriteProduct.avatar}`}
                              style={{ width: '150px', height: '100px',objectFit: "cover"}}
                              />
                            )}
                          </td>
                          <td style = {{color: "blue"}}>{favoriteProduct.nameProduct}</td>
                          <td style = {{color: "red"}}>{formatCurrency(favoriteProduct.price)}</td>
                          <td style = {{color: "green"}}>{favoriteProduct.totalFavoriteProduct}</td>
                          <td style = {{color: "red"}}>{favoriteProduct.discount}%</td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
        </div>
        

      </div>
    </>
  );
};

export default DashBoard;
