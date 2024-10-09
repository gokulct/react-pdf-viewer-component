import React, { useCallback, useEffect, useRef } from "react";
import '../styles/Viewer.css';
import Loader from "./Loader";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

const Viewer = (props) => {
    const imageRef = useRef(null);
    const handleWheel = (event) => {
        console.log(event.target.classList);
        if (!event.ctrlKey && event.target.classList.contains('ufhsfnkm')) {
            event.preventDefault(); 
            event.stopPropagation(); 
            if (event.deltaY < 0) {
                document.querySelector('#prev-btn').click();
            } else if (event.deltaY > 0) {
                document.querySelector('#nxt-btn').click();
            }
            
        }
    };
    useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: false , capture: true});
        return () => {
            window.removeEventListener('wheel', handleWheel, {capture: true});
        };
    }, []);
    const onUpdate = useCallback(({ x, y, scale }) => {
        const { current: img } = imageRef;
    
        if (img) {
          const value = make3dTransformValue({ x, y, scale });
    
          img.style.setProperty("transform", value);
        }
      }, []);
    
    return (
        <div className="viewer">
            {props.isLoading ? <Loader></Loader> :
                <>{props.src ?
                    <QuickPinchZoom onUpdate={onUpdate} centerContained={true} maxZoom={5} minZoom={0.5} animationDuration={250}>
                        <img ref={imageRef} src={props.src} alt="page-image"/>
                    </QuickPinchZoom> :
                    <></>
                }
                </>
            }
            <div className="actions-bar">
                <i  id="prev-btn" className="las la-angle-left" onClick={props.onPrev} title="Prev"/>
                <i id="nxt-btn" className="las la-angle-right" onClick={props.onNext} title="Next"/>
            </div>
        </div>
    )
}
export default Viewer;