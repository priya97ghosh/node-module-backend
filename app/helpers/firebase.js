// var FCM = require('fcm-node');

// var serverkey = 'AAAAHyMrQ5s:APA91bFwnsJFpB5fclE9IRH_N1UChszUsA_aatFoJJ4xAA5PIkItZB8jnX9xnsEKz65_oX1C-J9NeBcmYYE6Pr8JGRX7wuGb7hgKilZwUA5wLEic-7Smv-lN2cx-JhtgRAe5lVXklD8d';  
// var fcm = new FCM(serverkey);
// var message = {  
// 			to : req.body.userToken,
// 			collapse_key : 'XXX',
// 			data : {
// 					my_key: 'my value', contents: "abcv/"
// 			},
// 			notification : {
// 					title : 'Title of the notification',
// 					body : 'Body of the notification'
// 			}
// 	};

// fcm.send(message, function(err,response){  
// if(err) {
// 	console.log(message);
//        console.log("Something has gone wrong !");
//  } else {
//      console.log("Successfully sent with resposne :",response);
//    }
// });
require('dotenv').config();
var { FCM_KEY } = process.env;
var FCM = require('fcm-node');

// For single notification 
exports.sentNotificationSingle = function (receiver_id = null, title = null, dataO = null) {
	var serverKey = FCM_KEY; 		//put your server key here
	var fcm = new FCM(serverKey);

	// var send_id = 'dB4F1eRJdz_1O_NOpFpXQm:APA91bGVls2fnf5pp-FIwelRj8rW97am-TsSYBDT4n94LP8MeQyJ2lVX7Z_gKmCvW-6IJ9uKWKNwsC5nUC_Vs7y391bdtpIOBt2LzzLVCB3aIE8bpIswIRtzpSKyUvZqwWCGhlPCSbuk';
	//var send_id = receiver_id;

	var message = { 		// single recipient
		to: send_id.trim(),
		collapse_key: '',

		notification: {
			title: title,
			body: 'Your collection name is: ' + dataO.email
		}
	};

	console.log(message);

	fcm.send(message, function (err, response) {
		console.log(err);
		if (err) {
			console.log("Something has gone wrong!");
		} else {
			console.log("Successfully sent with response: ", response);
		}
	});
}

// For multi device
exports.sentNotificationMultiple = function (receiver_id = null, title = null, data0 = null) {
	var serverKey = FCM_KEY;
	var fcm = new FCM(serverKey);
	var message = {
		registration_ids: [
			// 'dB4F1eRJdz_1O_NOpFpXQm:APA91bGVls2fnf5pp-FIwelRj8rW97am-TsSYBDT4n94LP8MeQyJ2lVX7Z_gKmCvW-6IJ9uKWKNwsC5nUC_Vs7y391bdtpIOBt2LzzLVCB3aIE8bpIswIRtzpSKyUvZqwWCGhlPCSbuk',
			// 'dcCal_2KTW-vNaPe2xZqrm:APA91bEcqhpDLD4JSwGa9WvDpTAiHeFMHGJgyYiU5qTtJj0uzVT9GnshcyM5QdCx2Mtf8QAfU8hGrJ6X0ouEFlTNrwIkzY0RteiiFpkht87hsr4MkbFMjlSY3MOe7r8uBjOHDKjAvqlf'
		], // Multiple tokens in an array
		collapse_key: 'your_collapse_key',

		notification: {
			title: 'Title of your push notification',
			body: 'Body of your push notification'
		},

		data: {  //you can send only notification or only data(or include both)
			my_key: 'my value',
			my_another_key: 'my another value'
		}
	};

	console.log(message);

	fcm.send(message, function (err, response) {
		console.log(err);
		if (err) {
			console.log("Something has gone wrong!");
		} else {
			console.log("Successfully sent with response: ", response);
		}
	});
}