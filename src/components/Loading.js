import Lottie from 'react-lottie';
import animationData from '../assets/loading-animation.json';

import React from 'react'

const Loading = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };


    return (
        <div style={{position: "fixed", top:"30vh", left:"40vw", zIndex:1056}}>

            <Lottie options={defaultOptions}
            height="40vh"
            width={"20vw"}
            />
        </div>
    )
}

export default Loading
