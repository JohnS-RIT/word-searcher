const handleLogin = (e) => {
    e.preventDefault();

    $("#blurbMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val == '') {
        handleError("Oops! Seems like you didn\'t fill out everything.");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    $("#blurbMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Oops! Seems like you didn\'t fill out everything.");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Uh oh! Looks like the passwords don\'t match.");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const LoginWindow = (props) => {
    return (
        <div className="content-box">
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Log In" />
        </form>
        <h3>--OR--</h3>
        <button value="signup" href="/signup">Sign Up</button>
        </div>
    );
};

const SignupWindow = (props) => {
    return (
        <div className="content-box">
        <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
        <h3>--OR--</h3>
        <button value="login" href="/login">Log In</button>
        </div>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector(".content")
    );

    const button = document.querySelector("button");

    if (button.value === "signup"){
        button.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button.value === "login"){
        button.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }  
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector(".content")
    );

    const button = document.querySelector("button");

    if (button.value === "signup"){
        button.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button.value === "login"){
        button.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }  
};

const setup = (csrf) => {  
    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});