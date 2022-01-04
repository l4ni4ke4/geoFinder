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
        <div style={{position: "fixed", display:"block",width:"100%", height:"100%",backdropFilter:"blur(8px)",zIndex:1056}}>
            <Lottie options={defaultOptions}
            height="40vh"
            width={"20vw"}
            style={{position:"relative", top:"30vh"}}
            />
        </div>
    )
}

export default Loading
