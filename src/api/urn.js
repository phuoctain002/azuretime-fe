// export const urnProductByType = (id) => '/api/product/' + id;
// export const urnProductId = (id) => '/api/product/' + id;
// export const urnProduct = '/api/product/';
// export const urnProductTypes = '/api/productTypes/';
// export const urnImageByProductId = '/api/imageByProductId/';

export const urnBrand = '/api/brand/';
export const urnCate = '/api/cate/';
export const urnPros = (id) => '/api/pros/products/' + id;
export const urnDetailProduct = (id) => '/api/pros/detail/' + id;
export const urnPost = (id) => '/api/post/' + id;
export const urnDetailImgs = (id) => '/api/image/detail/' + id;

// admin
export const urnProsAdmin = '/api/pros/'; // GET
export const urnAddProduct = '/api/pros/'; // POST
export const urnAddImages = '/api/image/';
export const urnGetImgsName = (id) => '/api/image/listname/' + id;
export const urnDeleteProduct = (id) => '/api/pros/' + id;
export const urnDeleteCate = (id) => '/api/cate/' + id;
export const urnDeleteBrand = (id) => '/api/brand/' + id;
export const urnUploadImagesFull = (time) => '/api/image/upload-full/' + time;
export const urnUploadImagesResized = (time) => '/api/image/upload-resized/' + time;

// admin - brand
