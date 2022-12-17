import HomePage from '../user/pages/HomePage';
import BrandPage from '../user/pages/BrandPage';
import CategoryPage from '../user/pages/CatePage';
import DetailPage from '../user/pages/DetailPage';
import PostsPage from '../user/pages/PostsPage';

import AdminProduct from '../admin/pages/Product/index';
import AdminCreateProduct from '../admin/pages/Product/createProduct';
import AdminUpdateProduct from '../admin/pages/Product/updateProduct';

import AdminProductTypes from '../admin/pages/ProductTypes/index';
const publicRoutes = [
    { path: '/', component: HomePage },
    { path: '/brand/:idBrand', component: BrandPage },
    { path: '/category/:idCate/:gender', component: CategoryPage },
    { path: '/detail/:idProduct', component: DetailPage },
    { path: '/posts/:idPost', component: PostsPage },
    // Admin - Product
    { path: '/admin/products/', component: AdminProduct },
    { path: '/admin/create-product/', component: AdminCreateProduct },
    { path: '/admin/update-product/:idProduct', component: AdminUpdateProduct },
    // Admin - Product types
    { path: '/admin/product-types/', component: AdminProductTypes },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
