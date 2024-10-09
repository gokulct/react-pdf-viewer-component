import React from "react";
import '../styles/ViewerHeader.css';

const ViewerHeader = (props) => {
    return (
        <div className="header">
            <i className="las la-stream" onClick={props.openNavigator} />
            <div className="header-content">
                <span>Page </span><input type="text" value={props.currentPage} className="page-no" onChange={props.onPageEnter} /> / {props.totalPages}
                <div className="header-actions">
                    <i className="las la-print header-icon" title="Print" onClick={props.onPrint}/>
                    <i className="las la-info-circle header-icon" title="Help" onClick={props.onHelp}/>
                </div>
            </div>
        </div>
    )
}
export default ViewerHeader;