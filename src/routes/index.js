import HomePage from '../user/pages/HomePage';
import BrandPage from '../user/pages/BrandPage';
import CategoryPage from '../user/pages/CatePage';
import DetailPage from '../user/pages/DetailPage';
import PostsPage from '../user/pages/PostsPage';
import Admin from '../admin/pages';

const publicRoutes = [
    { path: '/', component: HomePage },
    { path: '/brand/:idBrand', component: BrandPage },
    { path: '/category/:idCate/:gender', component: CategoryPage },
    { path: '/detail/:idProduct', component: DetailPage },
    { path: '/posts/:idPost', component: PostsPage },
    { path: '/admin', component: Admin },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
