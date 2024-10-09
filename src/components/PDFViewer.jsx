import React, { useEffect, useState } from "react";
import '../styles/PDFViewer.css';
import ViewerHeader from "./ViewerHeader";
import Navigator from "./Navigator";
import Viewer from "./Viewer";
import { extractImageFromPDF, extractThumbnailsFromPDF, printPDF } from "../helpers/Helper";
import toast, { Toaster } from "react-hot-toast";
import { isMobile } from "../helpers/Constants";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const PDFViewer = (props) => {
    const [expanded, setExpanded] = useState(!isMobile());
    const [currentPage, setCurrentPage] = useState(1);
    const [imageSrc, setImageSrc] = useState(null);
    const [thumbs, setThumbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [startingPrint, setStartingPrint] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    useEffect(() => {
        if (props.url) {
            setIsLoading(true);
            Promise.all([
                extractImageFromPDF(props.url, currentPage),
                extractThumbnailsFromPDF(props.url, 1)
            ])
            .then(([imageUrl, resp]) => {
                setImageSrc(imageUrl); 
                setThumbs(resp.thumbnails); 
                setTotalPage(resp.totalPages);
                setIsLoading(false)
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
        }
    }, [])

    const pageSelect = (page) => {
        setIsLoading(true);
        if (page<=totalPage && page>=1) {
            extractImageFromPDF(props.url, page).then((image) => {
                setImageSrc(image);
                setCurrentPage(page);
                setIsLoading(false);
            }).catch((e) => {
                setIsLoading(false);
            })
        } else {
            toast.error('Invalid page number.', {position: 'bottom-right',duration:2000});
            setIsLoading(false);
        }
    }
    const next = () => {
        if (currentPage < totalPage) {
            setIsLoading(true);
            extractImageFromPDF(props.url, currentPage + 1).then((image) => {
                setCurrentPage(currentPage + 1);
                setImageSrc(image);
                setIsLoading(false);
            }).catch((e) => {
                setIsLoading(false);
            })
        }
    }
    const prev = () => {
        if (currentPage> 1) {
            setIsLoading(true);
            extractImageFromPDF(props.url, currentPage - 1).then((image) => {
                setCurrentPage(currentPage - 1);
                setImageSrc(image);
                setIsLoading(false);
            }).catch((e) => {
                setIsLoading(false);
            })
        }
    }
    const loadMore = (page) => {
        extractThumbnailsFromPDF(props.url, page).then(({thumbnails}) => {
            setThumbs((prev) => ([...prev, ...thumbnails]));
        });
    }
    const print = () => {
        setStartingPrint(true);
        printPDF(props.url).then((resp) => {
            setStartingPrint(false);
        }).finally(() => { 
            setStartingPrint(false);
        });
    }
    return (
        <div className={expanded ? "expanded" : "not-expanded"}>
            <ViewerHeader openNavigator={() => { setExpanded(prev => !prev) }} totalPages={totalPage} currentPage={currentPage} onPageEnter={(e) => { pageSelect(parseInt(e.target.value)); }} onPrint={print}
                onHelp={() => { setShowHelp(prev=>!prev) }} />
            <div className="pdf-viewer">
                <Navigator thumbs={thumbs} currentPage={currentPage} onPageSelect={pageSelect} onLoadMore={loadMore} totalPages={totalPage} />
                <Viewer isLoading={isLoading} onPrev={prev} onNext={next} src={imageSrc} />
            </div>
            <Toaster />
            <Modal open={startingPrint} closable={false} footer={null}>
                <div style={{textAlign:'center',margin:'10px 0'}}>
                    Starting Print
                </div>
                <div className="print-loader">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </div>
            </Modal>
            <Modal title="Help" open={showHelp} closable={true} maskClosable={true} footer={null} onCancel={() => { setShowHelp(false)}}>
                <div className="list-header">
                    PC
                </div>
                <div>
                    Scroll Up/Scroll Down - Previous Page / Next Page
                </div>
                <div>
                    CTRl+Scroll Up/CTRL+Scroll Down - Zoom In/Zoom Out
                </div>
                <div className="list-header">
                    Mobile
                </div>
                <div>
                    Next Button/Prev Button - Previous Page / Next Page
                </div>
                <div>
                    Pinch In/Pinch Out - Zoom In/Zoom Out
                </div>
            </Modal>
        </div>
    )
}
export default PDFViewer;