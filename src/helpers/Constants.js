export const default_navigator_page_size = 20;
export const isMobile = () => {
    if (window.innerWidth<=600) {
        return true;
    } else {
        return false;
    }
}