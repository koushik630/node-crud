var express = require('express');
var router = express.Router();


var home = require("../controllers/HomeController");
var group = require("../controllers/GroupController"); 
var socket = require("../controllers/SocketController");

router.get("/", home.index);
router.post("/sign-in", home.signIn);
router.post("/sign-up", home.signUp);
router.post("/forget-password-send", home.forgetPasswordSend);
router.get("/reset/:token", home.resetPasswordRender);
router.post("/forget-password-reset", home.resetPassword);


router.get("/home", home.dashboard);
router.get("/search/:token", home.searchUser);
router.post("/send-repuest/:token", home.sendRepuest);
router.get("/get-notification/:token", home.getNotifications);
router.post("/request-action/:token", home.requestAction);
router.get("/get-friends/:token", home.getfriends);
router.post("/get-friend-details/:token", home.getFriendDetails);
router.post("/send-message/:token", home.sendMessage);
router.post("/get-friend-messages/:token", home.getFriendMessages);
router.get("/get-friends-unread-message-count/:token", home.getFriendsUnreadMessageCount);
router.post("/set-friends-read-message-status/:token", home.setFriendsReadMessageStatus);
router.post("/changepic/:token", home.changePic);
router.get("/user-pic/:token", home.getuserPic);
router.get("/logout", home.logout);
router.post("/change-password/:token", home.changePassword);
router.get("/profile-details/:token", home.profileDetails);
router.post("/profile-update/:token", home.updateProfile);

router.post("/block-or-leave/:token", home.blockOrLeave);


router.get("/get-imojies/:token", home.getImojis);


router.post("/create-group/:token", group.createGroup);
router.get("/get-groups/:token", group.getGroups);
router.get("/get-group-members/:token/:groupId", group.getGroupMembers);
router.get("/get-group-unread-message-count/:token", group.getGroupUnreadMessageCount);
router.post("/set-group-admin/:token", group.setAsGroupAdmin)
router.get("/get-friends-not-group/:token/:groupId", home.getFriendNotInGroup)
router.post("/add-group-members/:token", group.addGroupMembers);


global.io.on('connection', socket.index);

module.exports = router;