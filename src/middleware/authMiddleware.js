const isLoggedIn = (req, res, next) => {
    console.log('isLoggedIn middleware hit. req.session.user:', req.session.user);
    if (req.session.user) {
        return next();
    }
    res.redirect('/sign-in');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'owner' || req.session.user.role === 'supervisor')) {
        return next();
    }
    res.status(403).send('Access denied');
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).send('You do not have permission to perform this action');
        }
        next();
    };
};

export {
    isLoggedIn,
    isAdmin,
    restrictTo,
};
