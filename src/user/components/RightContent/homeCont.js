import Resizer from 'react-image-file-resizer';
import { useEffect, useState } from 'react';

function DefaultContent() {
    const [imgFull, setImgFull] = useState('');
    const [imgx200, setImgx200] = useState('');
    const [imgx400, setImgx400] = useState('');
    const [imgx160, setImgx160] = useState('');
    const [imgx50, setImgx50] = useState('');

    const resizeFile = (size, quality, file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                size,
                size,
                'PNG',
                quality,
                0,
                (uri) => {
                    resolve(uri);
                },
                'base64',
            );
        });

    const onChange = async (event) => {
        try {
            const file = event.target.files[0];
            const imageFull = await resizeFile(500, 100, file);
            const image400 = await resizeFile(400, 100, file);
            const image200 = await resizeFile(200, 95, file);
            const image160 = await resizeFile(160, 100, file);
            const image50 = await resizeFile(50, 100, file);
            setImgFull(imageFull);
            setImgx400(image400);
            setImgx200(image200);
            setImgx160(image160);
            setImgx50(image50);
        } catch (err) {
            console.log(err);
        }
    };

    // const ChangeImage = (e) => {
    //     if (e.target.files) {
    //         let imageFile = e.target.files[0];
    //         var reader = new FileReader();
    //         reader.onload = function (e) {
    //             var img = document.createElement('img');
    //             img.onload = function (event) {
    //                 // Dynamically create a canvas element
    //                 var canvas = document.createElement('canvas');

    //                 // var canvas = document.getElementById("canvas");
    //                 var ctx = canvas.getContext('2d');

    //                 // Actual resizing
    //                 ctx.drawImage(img, 0, 0, 50, 50);

    //                 // Show resized image in preview element
    //                 var dataurl = canvas.toDataURL(imageFile.type);
    //                 document.getElementById('preview').src = dataurl;
    //             };
    //             img.src = e.target.result;
    //         };
    //         reader.readAsDataURL(imageFile);
    //     }
    // };
    return (
        <>
            <div className="default-content">
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
                        <img id="preview" src={imgFull} alt="" width={160}></img>
                    </div>
                    <div style={{ height: '50px', width: '50px' }}>
                        <img id="preview" src={imgx400} alt="" width={50}></img>
                    </div>
                    <div style={{ height: '50px', width: '50px' }}>
                        <img id="preview" src={imgFull} alt="" width={50}></img>
                    </div>
                </div> */}
                <div className="row-1">
                    <div className="wrap-img-home">
                        <img
                            className="img-home"
                            src={
                                'https://firebasestorage.googleapis.com/v0/b/watches-395b6.appspot.com/o/logo-davidoff-2.png?alt=media&token=198c441a-2c7a-42f9-b07b-f0b5775872e0'
                            }
                            alt="davidoff"
                        />
                    </div>
                    <div className="wrap-img-home">
                        <img
                            className="img-home"
                            src={
                                'https://firebasestorage.googleapis.com/v0/b/watches-395b6.appspot.com/o/mouricelacroix.png?alt=media&token=48af3996-313f-4c3a-afee-4b4ee864275e'
                            }
                            alt="mouricelacroix"
                        />
                    </div>
                </div>
                <div className="row-2">
                    <div className="wrap-img-home">
                        <img
                            className="img-home"
                            src={
                                'https://firebasestorage.googleapis.com/v0/b/watches-395b6.appspot.com/o/glycine.png?alt=media&token=7810920f-cd2d-45ea-8c0d-4c28e7a5bc34'
                            }
                            alt="glycine"
                        />
                    </div>
                    <div className="wrap-img-home">
                        <img
                            className="img-home"
                            src={
                                'https://firebasestorage.googleapis.com/v0/b/watches-395b6.appspot.com/o/westendwatchc.png?alt=media&token=de2fecd9-1e64-4dbd-9e8c-fae621d9eece'
                            }
                            alt="westendwatch"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DefaultContent;
