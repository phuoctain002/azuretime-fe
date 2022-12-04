import '~/admin/components/Header/header.css';

function HeaderAdmin() {
    return (
        <>
            <div className="header-admin">
                <div className="heading">
                    <span className="heading-label"></span>
                </div>
                <div className="header-user">
                    <h2 className="username">Hi, Tai Phuoc</h2>
                    <div className="logout-btn">
                        <span className="logout-label"></span>
                    </div>
                    <div className="edit-info-btn">
                        <span className="edit-info-label"></span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeaderAdmin;
