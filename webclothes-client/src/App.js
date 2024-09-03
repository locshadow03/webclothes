import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './layout/Menu';
import Navbar from './layout/Navbar';
import AddCategory from './component/dashboard/category/AddCategory';
import Admin from './component/dashboard/category/Admin';
import EditCategory from './component/dashboard/category/EditCategory';
import AllBrand from './component/dashboard/brand/AllBrand';
import AddBrand from './component/dashboard/brand/AddBrand';
import EditBrand from './component/dashboard/brand/EditBrand';
import AllProducts from './component/dashboard/product/AllProducts';
import AddProduct from './component/dashboard/product/AddProduct';
import EditProduct from './component/dashboard/product/EditProduct';
import Register from './component/auth/Register';
import Login from './component/auth/Login.jsx';
import AllUsers from './component/dashboard/user/AllUsers.jsx';
import FooterHome from './layout/FooterHome.jsx';
import HeaderHome from './layout/HeaderHome.jsx';
import Home from './component/home/Home.jsx';
import ProductDetail from './component/home/ProductDetail.jsx';
import MenuProfile from './layout/MenuProfile.jsx';
import Profile from './component/home/Profile.jsx';
import ProductFilter from './component/home/ProductFilter.jsx';
import FavoriteProduct from './component/home/FavoriteProduct.jsx';
import MyCart from './component/home/MyCart.jsx';
import AllOrder from './component/dashboard/order/AllOrder.jsx';
import MyOrder from './component/home/MyOrder.jsx';
import DashBoard from './component/dashboard/tke/DashBoard.jsx';
import Chart from './component/dashboard/tke/Chart.jsx';
import ProductSearch from './component/home/ProductSearch.jsx';
import Help from './component/home/Help.jsx';
import AllContact from './component/dashboard/contact/AllContact.jsx';


// Bố cục với Navbar và Menu
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <Menu />
    <div className="row">
      <div className="col-xl-2 col-lg-2 col-sm-2 col-md-2"></div>
      <div className="col-xl-10 col-lg-10 col-sm-10 col-md-10">
        {children}
      </div>
    </div>
  </>
);

// Bố cục với HeaderHome và Footer
const HomeLayout = ({ children }) => (
  <>
    <HeaderHome />
      {children}
    <FooterHome />
  </>
);



// Bố cục không có Navbar và Menu
const AuthLayout = ({ children }) => (
  <div className="container-fluid">
    {children}
  </div>
);

// Bố cục menu profile
const ProfileLayout = ({ children }) => (
  <>
    <HeaderHome />
    <div className = "container mt-3 py-5">
      <div className='row'>
      <div className='col-3'>
        <MenuProfile />
      </div>

      <div className='col-9 bg-white'>
        {children}
      </div>
      </div>
    </div>
    <FooterHome />
  </>
);

function App() {
  return (
    <>
      <main>
        <Router>
          <Routes>
            <Route path="/home" element={<HomeLayout><Home /></HomeLayout>} />
            <Route path="/home/account/profile/:userId" element={<ProfileLayout><Profile /></ProfileLayout>} />
            <Route path="/home/account/order/:customerId" element={<ProfileLayout><MyOrder /></ProfileLayout>} />
            <Route path="/home/help" element={<HomeLayout><Help /></HomeLayout>} />

            <Route path="/home/product-detail/:productId" element={<HomeLayout><ProductDetail /></HomeLayout>} />
            <Route path="/home/product-filter" element={<HomeLayout><ProductFilter /></HomeLayout>} />
            <Route path="/home/favorite-product" element={<HomeLayout><FavoriteProduct /></HomeLayout>} />
            <Route path="/home/my-cart" element={<HomeLayout><MyCart /></HomeLayout>} />
            <Route path="/home/search/:keyword" element={<HomeLayout><ProductSearch /></HomeLayout>} />

            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/dashboard" element={<MainLayout><DashBoard /></MainLayout>} />
            <Route path="/dashboard/category" element={<MainLayout><Admin /></MainLayout>} />
            <Route path="/dashboard/category/add/new-category" element={<MainLayout><AddCategory /></MainLayout>} />
            <Route path="/dashboard/category/update/:categoryId" element={<MainLayout><EditCategory /></MainLayout>} />

            <Route path="/dashboard/brand" element={<MainLayout><AllBrand /></MainLayout>} />
            <Route path="/dashboard/brand/add/new-brand" element={<MainLayout><AddBrand /></MainLayout>} />
            <Route path="/dashboard/brand/update/:brandId" element={<MainLayout><EditBrand /></MainLayout>} />

            <Route path="/dashboard/product" element={<MainLayout><AllProducts /></MainLayout>} />
            <Route path="/dashboard/product/add/new-product" element={<MainLayout><AddProduct /></MainLayout>} />
            <Route path="/dashboard/product/update/:productId" element={<MainLayout><EditProduct /></MainLayout>} />

            <Route path="/dashboard/order" element={<MainLayout><AllOrder /></MainLayout>} />
            <Route path="/dashboard/chart" element={<MainLayout><Chart /></MainLayout>} />

            <Route path="/auth/register" element={<AuthLayout><Register /></AuthLayout>} />
            <Route path="/auth/login" element={<AuthLayout><Login /></AuthLayout>} />

            <Route path="/dashboard/user" element={<MainLayout><AllUsers /></MainLayout>} />

            <Route path="/dashboard/contact" element={<MainLayout><AllContact /></MainLayout>} />
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
