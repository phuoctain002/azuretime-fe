import Item from 'antd/lib/list/Item';

function AboutUs() {
    const post = {
        title: 'ABOUT US',
        description: `Began with the first clock store in 1990, After more than 20 year of and serving development, at present Azuretime have been perfecting in the  aspect of commerce, online selling, direct sellingâ€¦ becoming a superior modern and professional retail system.

    With the of operating guideline of making high quality products and the professional serving style, Azuretime have gained more and more credit of domestic and international customer
   
    To meet up with the need of the customer in fashion and sport... Azuretime have accompanied with the Swissland's brands of high class clock and watch, the place where the most professional clock makers in the world came from. From the Classical style clocks of Maurice Lacroixâ€¦,which are not only elegant but also luxury, to the energetic or professional sporting watch of Glycin, West Endâ€¦ They all can meet the diverse need of customers.
   
    We will be very please to serve you at Minh Quy Showroom located at 103 Dong Khoi District 1 Ho Chi Minh City.
   
   Azuretime also send the best regard to customers, workers and collaborators who dedicated to Azuretime throughout those years. Azuretime commit to perform our best serving to ensure that the customers will always be our Gods.`,
    };
    const images = [
        {
            idImage: 1,
            urlImage:
                'https://firebasestorage.googleapis.com/v0/b/watches-395b6.appspot.com/o/azuretime-web-1.jpg?alt=media&token=319fd1a8-9d0d-4753-8741-b02c107f3878',
        },
        {
            idImage: 2,
            urlImage:
                'https://firebasestorage.googleapis.com/v0/b/watches-395b6.appspot.com/o/azuretime-web-3.jpg?alt=media&token=ce420e2e-3dea-48d2-9ebb-4060c58315e0',
        },
    ];
    const videos = [
        { idVideo: 1, urlVideo: 'https://www.youtube.com/embed/nDr7UA3JYok' },
        { idVideo: 2, urlVideo: 'https://www.youtube.com/embed/4cKehBUMezA' },
        { idVideo: 3, urlVideo: 'https://www.youtube.com/embed/8vCFW37KOgw' },
        { idVideo: 4, urlVideo: 'https://www.youtube.com/embed/dHG-PAPdt0c' },
        { idVideo: 5, urlVideo: 'https://www.youtube.com/embed/liZrcCC7FAw' },
    ];
    return (
        <div className='post-wrapper'>
            <div className="heading-top">
                <span>{post.title}</span>
            </div>
            <p className="post-desciption">{post.description}</p>
            <div className="post-image">
                {images &&
                    images.map((image) => {
                        return <img src={image.urlImage} alt="" />;
                    })}
            </div>
            <div className="post-video">
                {videos.map((video, index) => {
                    return <iframe src={video.urlVideo} width={500} height={300} title={video.idVideo}></iframe>;
                })}
            </div>
        </div>
    );
}

export default AboutUs;
