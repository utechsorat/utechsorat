module.exports = {
    ensureAuthenticated: function(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/users/login');
    },
    adminAuthenticated: function(req, res, next){
      if(req.user.admin){
        return next();
      }
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/');
    }
  }