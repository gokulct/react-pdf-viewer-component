import React, { useEffect, useRef, useState } from "react";
import '../styles/Navigator.css';
import { default_navigator_page_size } from "../helpers/Constants";

const Navigator = (props) => {
    const navigatorRef = useRef(null);
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = navigatorRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) { 
            if (document.querySelector('#load-more-btn')) {
                document.querySelector('#load-more-btn').click();
            }
        }
    };
    useEffect(() => {
        const navigatorElement = navigatorRef.current;
        navigatorElement.addEventListener('scroll', handleScroll);
        return () => {
            navigatorElement.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className="navigator"  ref={navigatorRef}>
            {props.thumbs ? props.thumbs.map((item, index) =>
                <div>
                    <img src={item} key={index} onClick={() => { props.onPageSelect(index + 1) }} alt="page" className={props.currentPage === index + 1 ? "selected" : ""} />
                    <div className="page-number-card">
                        {index+1}
                    </div>
                </div>
            ) : <></>}
            {props.thumbs.length!==props.totalPages ?
                <span id="load-more-btn" onClick={() => { props.onLoadMore((props.thumbs.length/default_navigator_page_size)+1); }} className="horizontal-loader"></span> : <></>
            }
        </div>
    )
}
export default Navigator;