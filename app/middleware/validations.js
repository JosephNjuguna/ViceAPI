const usernameValidate = (username) => {
    const re = /[a-zA-Z]{3,}_*[0-9_]*[a-zA-Z]*_*/;
    // understanding this regex :
    // should have 3 or more letters after that it can have a
    // number or alphabets letters again
    if(!re.test(username) || username == ''){
        console.log("username validation failed");
        return false
    }else{
        console.log('username validation passed');
        return true
    }
}
const emailValidate = (email) => {
    const re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
    // should have letters and numbers , @  letters or digit , '.' 
    // is a must then letters
    if (!re.test(email) || email == ''){
        console.log('email validation failed');
        return false
    }else{
        console.log('email validated');        
        return true
    }
}
const passwordValidate = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{7,}$/;
    // this regex 7 letters or more small, Capital letters a digit 
    if (!re.test(password) || password == ''){
        console.log(`${password} validation failed`);
        return false;
    }else{
        console.log('password validated');
        return true
    }
}
module.exports = {
    emailValidate,
    passwordValidate,
    usernameValidate
}