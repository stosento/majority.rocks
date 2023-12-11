import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function generateRoomCode() {
    return Math.random().toString(36).substr(2, 4).toUpperCase();
}

export function getTokenFromUrl() {
    return window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        let parts = item.split("=")
        initial[parts[0]] = decodeURIComponent(parts[1])
        return initial;
      }, {});
};

export function generateToastMessage(message) {
  toast.info(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
  return;
}