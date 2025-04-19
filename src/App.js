import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from './components/home';
import Login from './components/login';
import NotFound from './components/notfound';
import Register from './components/register';
import ProductsPage from './components/productsPage';
import OrdersPage from './components/ordersPage';
import CartPage from './components/cartPage';
import BulkOrders from './components/bulkOrderPage';
import ProtectedRoute from './components/protectedRoute';
import AdminProductsPage from './admin-components/adminProductsPage';
import EditProductPage from './admin-components/adminEditProductPage';
import AddNewProduct from './admin-components/addNewProduct';
import AdminOrdersPage from './admin-components/adminOrders';
import AdminBulkOrders from './admin-components/adminBulkOrdersPage';
import adminProtectedRoute from './admin-components/adminProtectedRoute';
import Navbar from './components/navbar';

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/products" Component={ProtectedRoute(ProductsPage)} />
        <Route path="/cart" Component={ProtectedRoute(CartPage)} />
        <Route path="/my-orders" Component={ProtectedRoute(OrdersPage)} />
        <Route path="/user/bulkorder" Component={ProtectedRoute(BulkOrders)} />
        <Route path="/admin/products" Component={adminProtectedRoute(AdminProductsPage)}/>
        <Route path="/admin/edit/products/:id" Component={adminProtectedRoute(EditProductPage)}/>
        <Route path='/admin/add-new-product' Component={adminProtectedRoute(AddNewProduct)} />
        <Route path="/admin/orders" Component={adminProtectedRoute(AdminOrdersPage)}/>
        <Route path='/admin/bulk-orders' Component={adminProtectedRoute(AdminBulkOrders)}/>
        <Route path="/not-found" Component={NotFound} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
