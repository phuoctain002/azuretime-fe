import { Button } from 'antd';
import './ptypes.css';
function ProductTypes() {
    return (
        <>
            <div className="heading-product-type">Chỉnh sửa loại sản phẩm</div>
            <div className="form">
                <div className="form-product-type">
                    <span className="input-label">Loại sản phẩm</span>
                    <input className="form-input" />
                </div>
            </div>
            <Button type="primary">Save</Button>
        </>
    );
}

export default ProductTypes;
