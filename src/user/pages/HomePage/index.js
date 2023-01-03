import DefaultContent from '../../components/RightContent/homeCont';
import { useEffect } from 'react';

function HomePage() {
    document.title = 'Chrono24us';
    useEffect(() => {
        localStorage.setItem('onClickBrandId', JSON.stringify(-1));
        localStorage.setItem('onClickCateId', JSON.stringify(-1));
        localStorage.setItem('cates', JSON.stringify([]));
    }, []);
    return <DefaultContent />;
}

export default HomePage;
