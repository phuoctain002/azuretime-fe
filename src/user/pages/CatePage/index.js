import CategoryContent from '../../components/RightContent/cateCont';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function CategoryPage() {
    return (
        <>
            <Header />
            <div className="body">
                <Sidebar />
                <div className="right-content">
                    <CategoryContent />
                </div>
            </div>
        </>
    );
}

export default CategoryPage;
