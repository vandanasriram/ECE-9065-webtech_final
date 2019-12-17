const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY; 
exports.jwtverify = (req) => {
    if (typeof req.headers.authorization === 'undefined') {
        return {"msg":"Access denied. Missing Auth header.", "valid":false};
    }
	const token = req.headers.authorization.split(" ");
	if (! token[0].startsWith("Bearer")) {
		return {"msg":"Access denied. Missing Token.", "valid": false};
    }
    console.log("token-> " + token[1]);
    try {
        const payload = jwt.verify(token[1], secret);
        console.log("JWT: ", JSON.stringify(payload));
        return {"msg":"Success", "valid":true, "userdata" : payload};
    } catch(ex) {
        console.log("Invalid jwt");
        return {"msg":"Invalid jwt. Authorization failed.", "valid":false};
    }
}