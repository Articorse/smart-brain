import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageURL, boxes}) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <div>
                    {imageURL.length > 0 &&
                        <img id='inputimage' alt='bla' src={imageURL} width='500px' height='auto'/>
                    }
                </div>
                <div>
                    {
                        boxes.map((box, i) => {
                            return (
                                <div
                                    key={i}
                                    className='bounding-box'
                                    style={{
                                        top: box.topRow,
                                        right: box.rightCol,
                                        bottom: box.bottomRow,
                                        left: box.leftCol
                                    }}
                                ></div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default FaceRecognition;