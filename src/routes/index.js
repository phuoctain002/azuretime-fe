import HomePage from '../user/pages/HomePage';
import BrandPage from '../user/pages/BrandPage';
import CategoryPage from '../user/pages/CatePage';
import DetailPage from '../user/pages/DetailPage';
import PostsPage from '../user/pages/PostsPage';

import Admin from '../admin/pages/index';
import AdminProduct from '../admin/pages/Product/index';
import AdminCreateProduct from '../admin/pages/Product/createProduct';
import AdminUpdateProduct from '../admin/pages/Product/updateProduct';

import AdminProductTypes from '../admin/pages/ProductTypes/index';
import AdminLogin from '../admin/pages/Login';
const publicRoutes = [
    { path: '/', component: HomePage },
    { path: '/brand/:idBrand', component: BrandPage },
    { path: '/category/:idCate/:gender', component: CategoryPage },
    { path: '/detail/:idProduct', component: DetailPage },
    { path: '/posts/:idPost', component: PostsPage },
];

const privateRoutes = [
    // Admin - Product
    { path: '/administrator/', component: Admin },
    { path: '/administrator/products/', component: AdminProduct },
    { path: '/administrator/create-product/:idBrand/:idCategory', component: AdminCreateProduct },
    { path: '/administrator/create-product/', component: AdminCreateProduct },
    { path: '/administrator/update-product/:idProduct', component: AdminUpdateProduct },
    // Admin - Product types
    { path: '/administrator/product-types/', component: AdminProductTypes },
];

const loginRoute = { path: '/administrator/login', component: AdminLogin }; //public route

export { publicRoutes, privateRoutes, loginRoute };
