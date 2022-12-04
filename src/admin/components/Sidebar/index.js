import { AiOutlineGold } from 'react-icons/ai';
import { CgRing } from 'react-icons/cg';
import { BsCardImage } from 'react-icons/bs';
import { TfiLayoutSlider } from 'react-icons/tfi';
import './sidebar.css';
function SidebarAdmin() {
    return (
        <>
            <div className="sidebar-admin">
                <div className="company-name">
                    <h1 className="company-name-label">AZURETIME</h1>
                </div>
                <div className="function-menu">
                    <div className="function-menu-btn">
                        <AiOutlineGold className="menu-icon" />
                        <label className="function-menu-label">Loại sản phẩm</label>
                    </div>
                    <div className="function-menu-btn">
                        <CgRing className="menu-icon" />
                        <label className="function-menu-label">Sản phẩm</label>
                    </div>
                    <div className="function-menu-btn">
                        <BsCardImage className="menu-icon" />
                        <label className="function-menu-label">Album</label>
                    </div>
                    <div className="function-menu-btn">
                        <TfiLayoutSlider className="menu-icon" />
                        <label className="function-menu-label">Slide</label>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SidebarAdmin;
