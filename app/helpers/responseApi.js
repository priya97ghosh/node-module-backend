// success response
exports.successResponse = function (res, msg, user) {
    var data = {
        status: true,
        code: 200,
        message: msg,
        user: user
    }
    return res.status(200).json(data);
}

//success response with data
exports.successResponseWithData = function (res, msg, data, userData) {
    var resWithData = {
        status: true,
        code: 200,
        message: msg,
        userData: userData,
        data: data
    }
    return res.status(200).json(resWithData);
}

// error response
exports.errorResponse = function (res, msg) {
    var errorRes = {
        status: false,
        code: 500,
        message: msg
    };
    return res.status(500).json(errorRes);
}

// not found response
exports.notFoundRes = function (res, msg, data) {
    var notFoundRes = {
        status: false,
        code: 404,
        message: msg,
        data: data,
    };
    return res.status(404).json(notFoundRes);
};

// unauthorized response
exports.unauthorizedResponse = function (res, msg, data) {
    var unAuthRes = {
        status: false,
        code: 401,
        message: msg,
        data: data
    };
    return res.status(401).json(unAuthRes);
};