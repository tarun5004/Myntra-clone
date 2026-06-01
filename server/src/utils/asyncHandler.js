const asyncHandler = (requestHandler) => {
    // promise.resolve() is used to convert the requestHandler into a promise, so that 
    // we can use .catch() to handle any errors that may occur during the execution 
    // of the requestHandler.
    return async (req, res, next) => {
        promise.resolve(requestHandler(req, res, next)).catch(next);
    }
}

export default asyncHandler;