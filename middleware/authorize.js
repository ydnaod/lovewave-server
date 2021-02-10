module.exports = async (req, res, next) => {
    /*
    if (userToken) {
        //return userToken;
    }
    if (accessToken && expiresIn && userToken) {
        next();
        //return userToken
    }
    else {
        const refresh = await fetch('http://localhost:4000/login/refresh_token');
        const parseRefresh = await refresh.json();
        accessToken = parseRefresh.access_token;
        res.access_token = accessToken
        userToken = accessToken;
        expiresIn = parseRefresh.expires_in;
        setTimeout(() => userToken = '', expiresIn * 1000);
        setTimeout(() => accessToken = '', expiresIn * 1000);
        setTimeout(() => expiresToken = '', expiresIn * 1000);
        /*res.redirect('http://localhost:3000/#' +
                    querystring.stringify({
                        access_token: res.access_token
                    }));
                    
    }*/
    const id = req.user;
    //console.log(req.user);
    const refresh = await fetch(`http://localhost:4000/login/refresh_token/${id}`, {
        method: "GET",
        headers: { token: req.header('token') }
    });
    const parseRefresh = await refresh.json();
    accessToken = parseRefresh.access_token;
    res.access_token = accessToken
    userToken = accessToken;
    expiresIn = parseRefresh.expires_in;
    setTimeout(() => userToken = '', expiresIn * 1000);
    setTimeout(() => accessToken = '', expiresIn * 1000);
    setTimeout(() => expiresToken = '', expiresIn * 1000);

    next();
}