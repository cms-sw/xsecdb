export const getCustomHTTPError = (error) => {
    let message = error.message;

    //if response exists, it means error is send from backend
    if (error.response) {
        message = error.response.data.error_message || error.message;
    }
    return message;
}

