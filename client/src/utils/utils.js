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