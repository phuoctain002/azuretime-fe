import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { AiOutlineGold } from 'react-icons/ai';
import { Tooltip } from 'antd';
import { CgRing } from 'react-icons/cg';
import './sidebar.css';
import '../../../App.css';
import { Link, redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ad_logout } from '../../../redux/slice/adminAccount';
import { url, path } from '../../../api/url';

function SidebarAdmin() {
    const username = useSelector((state) => state.adminAccount.username);
    const role = useSelector((state) => state.adminAccount.role);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(ad_logout({ username: '', role: '', isLogin: false }));
        redirect('/administrator/login');
    };
    return (
        <div className="sidebar-admin">
            <Link to={'/administrator/'}>
                <div className="chrono-logo">
                    <img className="chrono-logo-img" src={url + '/images/media/logo-chrono24.jpg'} alt="logo" />
                </div>
            </Link>
            <div className="function-menu">
                <div className="function-menu-btn">
                    <AiOutlineGold className="menu-icon" />
                    <label className="function-menu-label">Loại sản phẩm</label>
                </div>
                <div className="menu-sub-level">
                    <ul>
                        {/* Link  /administrator/product-types/' +  idMenu */}
                        <Link to={'/administrator/product-types/' + 1} style={{ color: '#9ea4b3' }}>
                            <div className="function-menu-btn-lv2">
                                <label className="function-menu-label-lv2">Wrist Watches</label>
                            </div>
                        </Link>
                        <li>
                            <Link to={'/administrator/product-types/' + 3} style={{ color: '#9ea4b3' }}>
                                <div className="function-menu-btn-lv2">
                                    <label className="function-menu-label-lv2">Watch Accessories</label>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="function-menu-btn">
                    <CgRing className="menu-icon" />
                    <label className="function-menu-label">Sản phẩm</label>
                </div>
                <div className="menu-sub-level">
                    <ul>
                        <li>
                            <Link to={'/administrator/products/'} style={{ color: '#9ea4b3' }}>
                                <div className="function-menu-btn-lv2">
                                    <label className="function-menu-label-lv2">Wrist Watches</label>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/administrator/products/'} style={{ color: '#9ea4b3' }}>
                                <div className="function-menu-btn-lv2">
                                    <label className="function-menu-label-lv2">Pocket Watches</label>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/administrator/products/'} style={{ color: '#9ea4b3' }}>
                                <div className="function-menu-btn-lv2">
                                    <label className="function-menu-label-lv2">Watch Accessories</label>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/administrator/products/'} style={{ color: '#9ea4b3' }}>
                                <div className="function-menu-btn-lv2">
                                    <label className="function-menu-label-lv2">Clock</label>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>

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
    );
}

export default SidebarAdmin;
