const emailValidate = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(email)){
            console.log('email validated');        
            return true
        }else{
            console.log('email validation failed');
            return false
        }
    }

    const passwordValidate = (password) => {
        if (password.length < 5  || password == ''){
            console.log(`${password} validation failed`);
            return false;
        }else{
            console.log('password validated');
            return true
        }
    }

    const usernameValidate = (username) => {
        if(username.length < 3 || username == ''){
            console.log("username validation failed");
            return false
        }else{
            console.log('username validation passed');
            return true
        }
    }
    module.exports = {
        emailValidate,
        passwordValidate,
        usernameValidate
    }