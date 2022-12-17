import DefaultContent from '../../components/RightContent/homeCont';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
    useEffect(() => {
        localStorage.setItem('onClickBrandId', JSON.stringify(-1));
        localStorage.setItem('onClickCateId', JSON.stringify(-1));
        localStorage.setItem('cates', JSON.stringify([]));
    }, []);
    return <DefaultContent />;
}

export default HomePage;
