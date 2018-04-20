var User = require('../Models/User');
const url = require('url');
var bodyParser = require("body-parser");
app.use(bodyParser());
const UserController = {
//=============================================================================
  profile : function(req, res ){
    res.render('pages/user/view',{
      page_name : 'profile_page',
      'query': req.query,
      req : req,
      res : res
    });
  },
  //===========================================================================
  getEditProfile : function(req, res ){
    res.render('pages/user/edit',{
      page_name : 'profile_page',
      'query': req.query,
      req : req,
      res : res
    });
  },
  postEditProfile: function(req, res) {
    var uniquePicfile='';
    if(req.body.upload_hidden!='')
    {
      var base64Data = req.body.upload_hidden.replace(/^data:image\/png;base64,/, "");
          uniquePicfile = uniqueFilename('', 'pic', '/my/thing/to/uniq/on');
          uniquePicfile = uniquePicfile+".png";
      var outputName = __dirname+'/../../public/uploads/user/images/'+uniquePicfile;
      require("fs").writeFile(outputName, base64Data, 'base64', function(err) {

      });
    }
        User.forge({
            id: req.params.id
        })
        .fetch()
        .then(function(userVal) {
            userVal.save({
                    f_name: req.body.f_name || userVal.get('f_name'),
                    f_name: req.body.l_name || userVal.get('l_name'),
                    description: req.body.description || userVal.get('description'),
                    profile_pic: (uniquePicfile != '') ? uniquePicfile : userVal.get('profile_pic') || userVal.get('profile_pic'),

                })
                .then(function() {
                  {f_name: req.session.passport.user.f_name}
                    res.redirect(url.format({
                        pathname: "/profile",
                        query: {
                            error: false,
                            successMsg: "Profile Updated sucessfully.",
                        }
                    }));
                })
                .otherwise(function(err) {
                    res.status(500).json({
                        error: true,
                        data: {
                            message: err.message
                        }
                    });
                });
        })
        .otherwise(function(err) {
            res.status(500).json({
                error: true,
                data: {
                    message: err.message
                }
            });
        });

  },
}
module.exports = UserController;
