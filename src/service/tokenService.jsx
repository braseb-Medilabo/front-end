let accessToken = localStorage.getItem("token");

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(token) {

    accessToken = token;

    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
}

export function getRefreshToken() {
    return {"refreshToken" : localStorage.getItem("refreshToken")};
}

export function setRefreshToken(token) {

    if (token) {
        localStorage.setItem("refreshToken", token);
    } else {
        localStorage.removeItem("refreshToken");
    }
}

export function clearTokens() {

    accessToken = null;

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
}