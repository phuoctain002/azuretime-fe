import BrandContent from '../../components/RightContent/brandCont';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function BrandPage() {
    return (
        <>
            <Header />
            <div className="body">
                <Sidebar />
                <div className="right-content">
                    <BrandContent />
                </div>
            </div>
        </>
    );
}

export default BrandPage;
