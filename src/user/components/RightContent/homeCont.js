// import Resizer from 'react-image-file-resizer';
import { useState } from 'react';
function DefaultContent() {
    const [isA, setIsA] = useState(true);
    // ====TEST RESIZE IMAGE======
    // const [imgFull, setImgFull] = useState('');
    // const [imgx200, setImgx200] = useState('');
    // const [imgx400, setImgx400] = useState('');
    // const [imgx300, setImgx300] = useState('');
    // const [imgx160, setImgx160] = useState('');
    // const [imgx50, setImgx50] = useState('');

    // const resizeFile = (size, quality, file) =>
    //     new Promise((resolve) => {
    //         Resizer.imageFileResizer(
    //             file,
    //             size,
    //             size,
    //             'PNG',
    //             quality,
    //             0,
    //             (uri) => {
    //                 resolve(uri);
    //             },
    //             'base64',
    //         );
    //     });

    // const onChange = async (event) => {
    //     try {
    //         const file = event.target.files[0];
    //         const imageFull = await resizeFile(500, 100, file);
    //         const image400 = await resizeFile(400, 30, file);
    //         const image300 = await resizeFile(300, 100, file);
    //         const image200 = await resizeFile(200, 95, file);
    //         const image160 = await resizeFile(160, 95, file);
    //         const image50 = await resizeFile(50, 100, file);
    //         setImgFull(imageFull);
    //         setImgx400(image400);
    //         setImgx200(image200);
    //         setImgx300(image300);
    //         setImgx160(image160);
    //         setImgx50(image50);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    return (
        <>
            <div className="default-content">
                {/* ====TEST RESIZE IMAGE======= */}
                {/* <input type="file" id="image-input" accept="image/*" onChange={(e) => onChange(e)} />

                <div className="imglist">
                    <div style={{ height: '500px', width: '500px' }}>
                        <img id="preview" src={imgFull} alt=""></img>
                    </div>
                    <div style={{ height: '200px', width: '200px' }}>
                        <img id="preview" src={imgx400} alt="" width={200}></img>
                    </div>
                    <div style={{ height: '200px', width: '200px' }}>
                        <img id="preview" src={imgFull} alt="" width={200}></img>
                    </div>
                    <div style={{ height: '200px', width: '200px' }}>
                        <img id="preview" src={imgx200} alt="" width={200}></img>
                    </div>
                    <div style={{ height: '160px', width: '160px' }}>
                        <img id="preview" src={imgx400} alt="" width={160}></img>
                    </div>
                    <div style={{ height: '160px', width: '160px' }}>
                        <img id="preview" src={imgx300} alt="" width={160}></img>
                    </div>
                    <div style={{ height: '50px', width: '50px' }}>
                        <img id="preview" src={imgx400} alt="" width={50}></img>
                    </div>
                    <div style={{ height: '50px', width: '50px' }}>
                        <img id="preview" src={imgFull} alt="" width={50}></img>
                    </div>
                </div> */}
            </div>
        </>
    );
}
export default DefaultContent;
