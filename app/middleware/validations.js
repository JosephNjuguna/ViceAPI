const reqResponses = require('../helpers/responses');

let message;
class Validations {
    static async validatesignup(req, res, next) {
        try{
            const{ name, email, password } = req.body;

            let re;
            // if(name === ''|| email == "" || password ===""){
            //     message = "Ensure all fields are filled";
            //     return reqResponses.handleError(message, 400, res);
            // }
            if(name == ''){
                message= "username field empty";
                return reqResponses.handleError(message, 400, res);
            }
            if(email == ''){
                message= "email field empty";
                return reqResponses.handleError(message, 400, res);
            }
            if(password == ''){
                message= "password field empty";
                return reqResponses.handleError(message, 400, res);
            }

            if (name) {
                re = /[a-zA-Z]{3,}_*[0-9_]*[a-zA-Z]*_*/;
                message = "user validation failed";
                if (!re.test(name) || name == "") return reqResponses.handleError(message, 400, res);
            }
            if (email) {
                re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
                message = "email validation failed";
                if (!re.test(email)) return reqResponses.handleError(message, 400, res);
            }
            if (password) {
                re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{7,}$/;
                message = "password validation failed";
                if (!re.test(password)) return reqResponses.handleError(message, 400, res);
            }
            next();
        }catch (error) {
            return reqResponses.handleError(error.toString(), 500, res);
        }
    }
    static async validatelogin(req, res, next) {
        try{
            const{ name, password } = req.body;

            let re;
            if(name == '' || password =="" || password == undefined){
                message = "Ensure all fields are filled";
                return reqResponses.handleError(message, 400, res);
            }
            if (name) {
                re = /[a-zA-Z]{3,}_*[0-9_]*[a-zA-Z]*_*/;
                message = "user validation failed";
                if (!re.test(name) || name == "") return reqResponses.handleError(message, 400, res);
            }
            if (password) {
                re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{7,}$/;
                message = "password validation failed";
                if (!re.test(password)) return reqResponses.handleError(message, 400, res);
            }
            next();
        }catch (error) {
            return reqResponses.handleError(error.toString(), 500, res);
        }
    }
}
module.exports = Validations;