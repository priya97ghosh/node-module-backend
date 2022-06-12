exports.ErrorRes = function (res, msg) {
	var data = {
		status: false,
		code: 500,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.NotFoundRes = function (res, msg,data) {
	var data = {
		status: false,
		code: 1,
		message: msg,
		data:data,
	};
	return res.status(404).json(data);
};

exports.UnauthorizedResponse = function (res, msg,data) {
	var data = {
		status: false,
		code: 401,
		message: msg,
		data:data
	};
	return res.status(401).json(data);
};

exports.ValidationErrorWithData = function (res, msg, data) {
	var resData = {
		status: false,
		code: 400,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};