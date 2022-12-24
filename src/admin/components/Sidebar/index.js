import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { AiOutlineGold } from 'react-icons/ai';
import { Tooltip } from 'antd';
import { CgRing } from 'react-icons/cg';
import './sidebar.css';
import '../../../App.css';
import { Link, useLocation } from 'react-router-dom';
import auth from '../../../routes/auth';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actLogin } from '../../../redux/actions/adminAccount';
function SidebarAdmin() {
    const { state } = useLocation();
    const { username, password, role } = state;
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true); //có thể sd ueSelector

    // const navigate = useNavigate();
    const handleLogout = () => {
        const action = actLogin(false);
        dispatch(action);
        sessionStorage.setItem('isLogin', false);
        auth.logout(() => {
            setIsLogin(false);
        });
    };

    return (
        <div>
            <div className="sidebar-admin">
                <div className="function-menu">
                    <div className="company-name">
                        <Link to={'/admin/'}>
                            <h1 className="company-name-label">AZURETIME</h1>
                        </Link>
                    </div>
                    <Link to={'/admin/product-types/'} style={{ color: '#9ea4b3' }}>
                        <div className="function-menu-btn">
                            <AiOutlineGold className="menu-icon" />
                            <label className="function-menu-label">Loại sản phẩm</label>
                        </div>
                    </Link>
                    <Link to={'/admin/products/'} style={{ color: '#9ea4b3' }}>
                        <div className="function-menu-btn">
                            <CgRing className="menu-icon" />
                            <label className="function-menu-label">Sản phẩm</label>
                        </div>
                    </Link>

                    {/* <div className="function-menu-btn">
                        <BsCardImage className="menu-icon" />
                        <label className="function-menu-label">Album</label>
                    </div> */}
                    {/* <div className="function-menu-btn">
                        <TfiLayoutSlider className="menu-icon" />
                        <label className="function-menu-label">Slide</label>
                    </div> */}
                </div>
                <div className="account-bottom">
                    <UserOutlined className="account-icon" />
                    <div className="account-info">
                        <h3 className="account-name">{username ? username : 'Tai Phuoc'}</h3>
                        <span className="account-role">{role ? role : 'Không xác định'}</span>
                    </div>
                    <Tooltip placement="topRight" title="Đăng xuất">
                        <div className="logout-btn" onClick={handleLogout}>
                            <LogoutOutlined className="account-icon-logout" />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export default SidebarAdmin;
