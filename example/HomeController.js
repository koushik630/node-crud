var dateFormat 		= require('dateformat');
var fs 				= require('fs');
var base64Img 		= require('base64-img');
var Jimp 			= require("jimp");
var Cookies 		= require('cookies');
//var nodemailer 		= require('nodemailer');
var crypto 			= require('crypto');

var User 			= require('../models/users');
var Userconnection 	= require('../models/userconnection');
var Message 		= require('../models/messages');
var Blocks 			= require('../models/blocks');
var Groups 			= require('../models/groups');
var Imojis 			= require('../models/imojis');



var HomeController = {


	index  : function(request, response){
		response.render("index");
	},

	signIn : function(request, response){
		var post = request.body;
		
		User.loginCheck(post.email,post.password, function(data)  {
		    if (data == null){
		       response.json({'status':0,'message':'Sorry, login faild'});
		    } else{
		       if (post.loggedMe) {
		       		var cookies 		= new Cookies( request, response);
		       		cookies
		       		.set("e",new Buffer(post.email).toString('base64'), { httpOnly: false })
		       		.set("p",new Buffer(post.password).toString('base64'), { httpOnly: false });
		       }
		       request.session.username = data;
		       User.updateById(data._id,{
			       		currentRoom:"", 
			       		lastLoggedinTime: new Date(),lastActiveTime: new Date(),
			       		device : post.device
		       		},function(res){});


		       response.json({'status':1,'message':'success','username':data.username, 'userId':data._id});
		       
		    }
		})
	},

	signUp : function(request, response){
		var post = request.body;
		var userName = post.username;
		var email = post.email;
		if (userName == '') {
		    pos = email.indexOf("@");
		    userName = "live:"+email.substr(0,pos);
		}


		User.emailExist(email, function(data){
		  if (data == true) {
		    response.json({"status":0,"message":"Email is already exists, Please choose another one"});
		  } else{

		    User.usernameExist(userName, function(data){
		       if (data == true){
		          response.json({"status":0,"message":"Username is already exists, Please choose another one"});
		       } else {
		          var insertData = {
			                'name' : post.name,
			                'email' : post.email,
			                'username' : userName,
			                'password' : post.password,
			                'address' : post.address
			              };
			       User.insert(insertData, function(modelResponse){
			       	response.json(modelResponse); 
			       });
		       }
		    });
		    
		  }
		})
	},

	forgetPasswordSend : function(request, response) {
		var post = request.body;
		User.emailExist(post.email, function(data){
			if (data == false) {
				response.json({"status":0,"message":"Email is not exists, Please enter existing one"});
			} else {
				User.getUserDetailsByQuery({email : post.email}, function(userData){
					var token = crypto.createHash('md5').update(userData.email).digest("hex");
					User.updateById(userData._id,{
			       		requestToken : token
		       		},function(res){});

					var mailer = nodemailer.createTransport(global.config.mail);
					var mailOptions = {
					  from : "ExpressChat:tonmoy@matrixnmedia.com",
					  to : post.email,
					  subject : 'Request for password',
					  html : 'Hi user,<br/> <br/>You forget your password and try to reset new one. <a href="http://localhost:3000/reset/'+token+'">Click Here</a> to reset new Password.<br/> <br/> Thanks, <br/> Express Chat Team'
					};

					mailer.sendMail(mailOptions, function(error, info){
					  if (error) {
					    console.log(error);
					  } else {
					    response.json({"status":1,"message":"Email is send. Please check your mail inbox"});
					  }
					});	
				})
				
			}
		});
	},

	resetPasswordRender : function(request, response) {
		var token = request.params.token;
		response.render("resetpassword",{ token : token });
	},

	resetPassword : function(request, response) {
		User.getUserDetailsByQuery({requestToken : request.body.token}, function(userData){

			if (userData!= null) {
				User.updateById(userData._id,{
			       		password : request.body.newpassword,
			       		requestToken : null
		       		},function(res){});
				response.json({"status":1,"message":"password is reset successfully"});
			} else {
				response.json({"status":0,"message":"Token is mismatched"});
			}
		});
	},

	profileDetails : function(request, response) {
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			User.getUserDetails(loggedinUser._id, function(userdata){
				response.json({'data':userdata});
			})
		} else {
			response.json(global.tokenError)
		}
	},

	updateProfile : function(request, response) {
		if (global._token == request.params.token) {
			var postData = request.body;
			var loggedinUser  = request.session.username;
			var updateData = {
							gender : postData.gender,
							dob : new Date(postData.dob),
							status : postData.currentstatus,
							lastActiveTime: new Date()
						};
			if (loggedinUser.username != postData.username) {
				User.usernameExist(postData.username, function(exist){
					if (exist == true) {
						response.json({ "status" :0, "message": "Display name is already exist, please try another one" })
					} else {
						updateData.username = postData.username;
						User.updateById(loggedinUser._id,updateData,function(res){});
						response.json({"status":1,"message":"Profile is updated  successfully"});
					}
				})
			} else {
				
				User.updateById(loggedinUser._id,updateData,function(res){});
				response.json({"status":1,"message":"Profile is updated  successfully"});
			}
		} else {
			response.json(global.tokenError)
		}

	},

	dashboard : function(request, response){
		var loggedinUser  = request.session.username;
		var cookies 		= new Cookies( request, response);
		if (loggedinUser == undefined && cookies.get("e") == undefined && cookies.get("p") == undefined){
			response.redirect("/");
		} else {
			if (loggedinUser == undefined && cookies.get("e") != undefined && cookies.get("p") != undefined) {
				User.loginCheck(  new Buffer(cookies.get("e"), 'base64'), new Buffer(cookies.get("p"), 'base64'), function(data){
					request.session.username = data;
					User.getUserDetails(data._id, function(data){
						response.render("home", {user: data});
					})
				} )
			} else if (loggedinUser != undefined) {
				User.getUserDetails(loggedinUser._id, function(data){
					response.render("home", {user: data});
				})
			}
		}
		
		
	},
	logout : function(request, response) {

			var loggedinUser = request.session.username;
			User.updateById(loggedinUser._id,{
				currentRoom:"", 
				lastLoggedinTime: new Date(),lastActiveTime: new Date()
			},function(res){});

			var cookies 		= new Cookies( request, response);
			cookies
				.set("e",'', {expires: new Date(0)})
			    .set("p",'', {expires: new Date(0)});
			request.session.destroy();
			response.redirect("/");
		
	},

	getuserPic : function(request, response){
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			User.getUserDetails(loggedinUser._id, function(data){
				var image = data.profilePic;
				response.json({"image":image,"name":data.name})
			})
		} else {
			response.json(global.tokenError)
		}
	},

	searchUser : function(request, response) {
		var loggedinUser  = request.session.username;
		var searchKey = request.query.term;
		if (global._token == request.params.token) {
			User.searchByName(searchKey,loggedinUser, function(data){
				var result  = [];var statusArr =[];
				var promises = [];
				for(var index in data) {
					promises[index] = new Promise(function(resolve, reject){
						var row = data[index];
						result[index] = {};
						result[index]  = {
							'id' : row._id,
							'name' : row.name,
							'displayname' : row.username,
							'address' : row.address,
							'status' : null
						};
						//result[index].status = Userconnection.checkData(loggedinUser._id,row._id);
						Userconnection.checkConnectionStatus(loggedinUser._id,row._id, function(connectionData){
							if (connectionData.length >0){
								result[index].status =   connectionData[0].status;
							}
							if (index == (data.length -1)) {
								Promise.all(promises).then(response.json(result));
							}
							
						})
					});
				}/**/
				
			})
		} else {
			response.json(global.tokenError)
		}
	},

	sendRepuest : function(request, response) {
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			var post = request.body;
			var sendId  = post.id;
			var userId = loggedinUser._id
			Userconnection.checkConnectionStatus( sendId, userId, function(data){
				if (data.length == 0) {
					Userconnection.addRequest(sendId, userId, function(requestData){
						//console.log(requestData);
						User.updateById(loggedinUser._id,{lastActiveTime: new Date()},function(res){});
						response.json(requestData);
					})
				} else if (data[0].status == 2) {

					Userconnection.resendRequest(data[0]._id, function(requestData){
						//console.log(requestData);
						User.updateById(loggedinUser._id,{lastActiveTime: new Date()},function(res){});
						response.json(requestData);
					})
				}
			})
		} else {
			response.json(global.tokenError);
		}
	},

	getNotifications : function(request, response) {
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			if (loggedinUser != undefined){
				var userId  = loggedinUser._id;
				Userconnection.getNotifications(userId, function(modelResponse){
					var result = {};var indexCount = 0;
					if (modelResponse.length >0) {
						for(var index in modelResponse) {
							var row = modelResponse[index];
							if (row.fromId._id == userId) {
								if (row.status == 0) {
									result[indexCount] = {
										"id"	  : row._id, 
										"action"  : 'request_send_by_you', 
										"message" : "you sent request to "+ row.toId.name +", till now request is pending."
									};
								}
								else if (row.status == 1) {
									result[indexCount] = {
										"id"	  : row._id,
										"action"  : 'request_send_by_you_accept', 
										"message" :  row.toId.name +" accepts your request.",
									};
								}
								else if (row.status == 2) {
									result[indexCount] = {
										"id"	  : row._id,
										"action"  : 'request_send_by_you_deny', 
										"message" :  row.toId.name +" denied your request.",
									};
								}

							}
							else if (row.toId._id == userId) {
								if (row.status == 0) {
									result[indexCount] = {
										"id"	  : row._id,
										"action"  : 'request_accept_by_you', 
										"message" : row.fromId.name +" sneds you request, please accept the request."
									};
								}
							}
							indexCount ++;

						}
						Groups.getNotifications(userId,function(groupData){
							if (groupData.length >0) {
								for(var index in groupData) {
									var row = groupData[index];
									result[indexCount] = {
										"id"	  : row._id,
										"action"  : 'request_accept_by_you_group', 
										"message" : "you have a request to join in a new group. Name : "+row.name
									};
									indexCount++;
								}
							}
							response.json(result);
						})
						
					} else {
						response.json({});
					}
				})
			}
		} else {
			response.json(global.tokenError);
		}
		
	},

	requestAction : function(request, response) {
		if (global._token == request.params.token) {
			var post = request.body;
			var updateData = {};
			
			if (post.requestType == 'friend'){
				if (post.type == 'accept') {
					updateData.status = 1;	
				} else if (post.type == 'deny') {
					updateData.status = 2;
				}
				Userconnection.updateRequest(updateData, post.id, function(modelResponse){
					response.json({"status":1});
				});	
			} else if (post.requestType == 'group') {
				var loggedinUser  = request.session.username;
				Groups.updateRequest(post, loggedinUser._id, function(modelResponse){
					var message = "Hi, I join here";
					var messageElement = {
						friendType : 'group',
						sendToId : post.id,
						message : message,
						messageType : 3
					};
					Message.sendMessage(messageElement, loggedinUser._id, function(messageResponse){
						response.json({
								status 	: 1,
								msgId : messageResponse,
								sendTo : post.id,
								message : message,
								messageType : 3
							});
					})

					//response.json({"status":1});

				});	
			}
		} else {
			response.json(global.tokenError);
		}
		
	},

	getfriends : function(request, response) {
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			if (loggedinUser != undefined){
				var userId  = loggedinUser._id;
				Userconnection.getFriends(userId, function(data){
					var result  = [];
					if (data.length > 0) {
						//console.log(data);
						for(var index in data){
							
							var row = data[index];
							var friend = {};

							
							if (userId == row.fromId._id){
								var dateDiff = parseInt(((new Date() - new Date(row.toId.lastActiveTime))/1000)/60)
								friend = {
									id : row.toId._id,
									name : row.toId.name,
									username : row.toId.username,
									pic : row.toId.profilePic,
									lastActiveTime : row.toId.lastActiveTime,
									activeStatus : (dateDiff !=null && dateDiff < 20)? '1':((dateDiff !=null && dateDiff > 15)? '0':''),
									device : row.toId.device,
									statustext : row.toId.status,
									blockStatus : 0,
									friendStatus : row.status,
								};
									
							}
							if (userId == row.toId._id){
								var dateDiff = parseInt(((new Date() - new Date(row.fromId.lastActiveTime))/1000)/60)
								friend = {
									id : row.fromId._id,
									name : row.fromId.name,
									username : row.fromId.username,
									pic : row.fromId.profilePic,
									lastActiveTime : row.fromId.lastActiveTime,
									activeStatus : (dateDiff !=null && dateDiff < 20)? '1':((dateDiff !=null && dateDiff > 15)? '0':''),
									device : row.fromId.device,
									statustext : row.fromId.status,
									blockStatus : 0,
									friendStatus : row.status,
								}	
							}
							var joinArr = [
								friend.id,
								userId
							];
							joinArr.sort();
							var roomName = '';
							for (var i in joinArr) {
								roomName += joinArr[i]+'-';
							}
							roomName = roomName.substring(0, roomName.length - 1);
							friend['room'] =  roomName;
							result[index] = friend;
								
							
						}
					}
					response.json(result);
				});
			}
		} else {
			response.json(global.tokenError);
		}
		
	},

	getFriendDetails : function(request, response) {
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			var friendId = request.body.friendId;
			if (request.body.friendType == 'friend') {
				User.getUserDetails(friendId, function(data){
					Blocks.checkBlock(loggedinUser._id, friendId, function(blockByUserdata) {
						
						Blocks.checkBlock(friendId, loggedinUser._id,  function(blockByFrienddata) {
							response.json({
								data : data, 
								blockUserStatus: ((blockByUserdata == null)? 0:1), 
								blockFriendStatus: ((blockByFrienddata == null)? 0:1) });
						});
					})
					
				});
			} else if ( request.body.friendType == 'group' ) {
				Groups.getDetails(friendId, function(data){
					Groups.getGroupUserType(loggedinUser._id, friendId, function(groupData){
						response.json({data : data, usertype: groupData.userType   });	
					});
					
				})
			}
		} else {
			response.json(global.tokenError);
		}
	},

	blockOrLeave : function(request, response) {
		if (global._token == request.params.token) {
			var postData = request.body;
			var loggedinUser  = request.session.username;
			if (postData.type == 'friend') {
				Blocks.checkBlock(loggedinUser._id, postData.id, function(data){
					if (data == null) {
						Blocks.insert(loggedinUser._id, postData.id, function(insertData){
							var messageElement = {

								friendType : 'friend',
								sendToId : postData.id,
								message : 'block '+postData.name,
								messageType : 3
							};
							Message.sendMessage(messageElement, loggedinUser._id, function(messageResponse){
								Blocks.checkBlock(postData.id, loggedinUser._id,  function(blockByFrienddata) {
									response.json({
										"status":1,
										"message":"block successfully",
										"blockStatusByUser" : 1,
										"blockStatusByFriend" : ((blockByFrienddata == null)? 0:1),
										"emitmessage" : messageElement.message,
										"msgId" : messageResponse,
										"messageType" : 3
									});
								});
							})
						})	
					} else {
						var block = Blocks.unblock(data._id);
						var messageElement = {

								friendType : 'friend',
								sendToId : postData.id,
								message : 'unblock '+postData.name,
								messageType : 3
							};
							Message.sendMessage(messageElement, loggedinUser._id, function(messageResponse){
								Blocks.checkBlock(postData.id, loggedinUser._id,  function(blockByFrienddata) {
									response.json({
										"status":1,
										"message":"unblock successfully",
										"blockStatusByUser" : 0,
										"blockStatusByFriend" : ((blockByFrienddata == null)? 0:1),
										"emitmessage" : messageElement.message,
										"msgId" : messageResponse,
										"messageType" : 3
									});

								});
							})
					}
				})
				
			} else if (postData.type == 'group') {
				var post = {
					type : 'removed',
					id : postData.id
				};
				Groups.updateRequest(post, loggedinUser._id, function(modelResponse){
					var messageElement = {

						friendType : 'group',
						sendToId : postData.id,
						message : 'left from the group',
						messageType : 3
					};
					Message.sendMessage(messageElement, loggedinUser._id, function(messageResponse){
						response.json({
							"status":1,
							'message': 'You left successfully',
							"emitmessage" : 'left from '+postData.name,
							"msgId" : messageResponse,
							"messageType" : 3
						});
					})
					
				});	
			} 
		} else {
			response.json(global.tokenError);
		}
	},

	sendMessage : function(request, response){
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			var userId  = loggedinUser._id;
			var post 	= request.body;
			User.updateById(loggedinUser._id,{lastActiveTime: new Date()},function(res){});
			if (post.msgtype == 'add'){
				post.messageType = 1;
				Message.sendMessage(post, userId, function(modelResponse){
					setTimeout(function(){
						var newMsgId = modelResponse;
						response.json({"id":newMsgId, "messageType": post.messageType});
						
					},200);
					
				})
			} else if(post.msgtype == 'edit') {
				updateData = {
					message : post.message,
					status : 3 // edit message
				}
				Message.updateById(post.msgId, updateData, function(modelResponse){
					setTimeout(function(){
						response.json({"id":post.id, "messageType": post.messageType});
						
					},200);
					
				})
			} else if(post.msgtype == 'delete') {
				updateData = {
					status : 2, // delete message
					messageType : 3
				}
				Message.updateById(post.msgId, updateData, function(modelResponse){
					setTimeout(function(){
						response.json({status : 1});
						
					},200);
					
				})
			}
		} else {
			response.json(global.tokenError);
		}
		
	},



	getFriendMessages : function(request, response){
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			var userId  = loggedinUser._id;
			var post 	= request.body;
			User.updateById(loggedinUser._id,{lastActiveTime: new Date()},function(res){});
			Message.getFriendMessage(post.fId, userId, post.day, post.friendType, function(data){
				var result = {};
				var count = 0;
				for( var index in data ){
					var row = data[index];
					var date = dateFormat(row.createdAt, "dddd, mmmm dS, yyyy");
					if(result[date] == undefined ){
						result[date] = {};
						count = 0;
					}
					result[date][count] = {};
					result[date][count].id = row.id;
					result[date][count].time = dateFormat(row.createdAt, "hh:MM:ss TT");
					result[date][count].user = row.fromId.name;
					result[date][count].userId = row.fromId.id;
					result[date][count].message = row.message;
					result[date][count].status = row.status;
					result[date][count].messageType = row.messageType;
					count++;
				}
				response.json(result);
			});
		} else {
			response.json(global.tokenError);
		}
	},

	getFriendsUnreadMessageCount : function(request, response){
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			var userId  = loggedinUser._id;
			Message.getUnreadMsgCountGroupByUser(userId, function(data){
				var result = {};
				if (data.length > 0){
					for(var index in data){
						var row  = data[index];
						result[row._id] = row.total;
					}
				}
				response.json(result);
			});
		} else {
			response.json(global.tokenError);
		}
		
	},
	
	setFriendsReadMessageStatus : function(request, response){
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			var userId  = loggedinUser._id;
			var post = request.body;
			Message.setReadStatus(post.fId, userId, post.friendType, function(data){
				response.json({"status":1});
			})
		} else {
			response.json(global.tokenError);
		}
		
	},


	changePic : function(request, response){
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			var post = request.body;
			//console.log(post);

			/* UPLOAD IMAGE FROM BAS64 STRING */
			var uplaodPath = './public/uploads/profilePic/';

			var filepath = base64Img.imgSync(post.file, uplaodPath, loggedinUser._id);
			var filenameArr = filepath.split("/");
			var filename = filenameArr[ (filenameArr.length-1) ];
			/* ----------------- */

			/* CROP IMAGE */

			Jimp.read(filepath , function (err, image) {
				image.crop( parseInt(post.left), parseInt(post.top), parseInt(post.width), parseInt(post.height) )
				.write(filepath);  
			});

			/* ---------------- */
			User.getProfilePic(loggedinUser._id, function(data){
				var picName = data.profilePic;
				picName = picName.toString().replace(/['"]+/g, '');
				if (fs.existsSync(uplaodPath+picName)) {
					console.log("exist");
					fs.unlink(uplaodPath+picName);
				}

				User.updateById(loggedinUser._id,{profilePic:filename, lastActiveTime: new Date()},function(res){});
				response.json({data: filepath});
			})
		} else {
			response.json(global.tokenError);
		}
		
	},

	changePassword : function(request, response) {
		if (global._token == request.params.token) {
			var loggedinUser  = request.session.username;
			User.updateById(loggedinUser._id,{password:request.body.password, lastActiveTime: new Date()},function(res){
				response.json({status:1});
			});
		} else {
			response.json(global.tokenError);
		}
	},

	getImojis : function(request, response) {
		if (global._token == request.params.token) {
			fs.readdir('./public/images/imogies', (err, files) => {
				var imojis={};
			  files.forEach(file => {
			  	var imoji = file.replace(/\.[^/.]+$/, "");
			  	var imojiArr = imoji.split("-");
			  	var group = imojiArr[0]; 
			  	var imojiText = imojiArr[1]; 
			  	if (imojis[group] == undefined) {
			  		imojis[group] = [];
			  	}
			    imojis[group].push({
			    	name : imoji,
			    	text : imojiText,
			    });
			  });
			  response.json({data : imojis});
			})
		} else {
			response.json(global.tokenError);
		}
		
	},

	getFriendNotInGroup : function(request, response) {
		if (global._token == request.params.token) {
			var groupId = request.params.groupId;
			var userId = request.session.username._id;
			var members = Groups.getGroupMembers(groupId);
			members.then(function(data){
				
				var members = [];
				for(var m = 0 ; m<data.members.length; m++) {
					members[m] = String(data.members[m].userId._id);
				}
				
				Userconnection.getFriends(userId, function(userFriends){
					var friend = {};
					if (userFriends.length > 0) {
						for(var index in userFriends){
							var row = userFriends[index];
							if (userId == row.fromId._id && members.indexOf(String(row.toId._id)) === -1){
								friend[index] = {
									id : row.toId._id,
									name : row.toId.name,
									username : row.toId.username,
									pic : row.toId.profilePic
								};
							} else if (userId == row.toId._id && members.indexOf(String(row.fromId._id)) === -1){
								friend[index] = {
									id : row.fromId._id,
									name : row.fromId.name,
									username : row.fromId.username,
									pic : row.fromId.profilePic
								};
							}
						}
					}
					response.json({data : friend});
				});
				

			})
		} else {
			response.json(global.tokenError);
		}
	},
	

}
module.exports =  HomeController;