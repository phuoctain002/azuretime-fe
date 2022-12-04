import Posts from '../../components/RightContent/Posts/aboutUs';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function PostsPage() {
    return (
        <>
            <Header />
            <div className="body">
                <Sidebar />
                <div className="right-content">
                    <Posts />
                </div>
            </div>
        </>
    );
}

export default PostsPage;
