import DetailContent from '../../components/RightContent/detailCont';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function DetailPage() {
    return (
        <>
            <Header />
            <div className="body">
                <Sidebar />
                <div className="right-content">
                    <DetailContent />
                </div>
            </div>
        </>
    );
}

export default DetailPage;
