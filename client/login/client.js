//If the user tries to login
const handleLogin = (e) => {
    e.preventDefault();

    $("#blurbMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val == '') {
        handleError("Oops! Seems like you didn\'t fill out everything.");
        return false;
    }

    //console.log($("input[name=_csrf]").val());

    //Try logging in
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

//If the user tries to sign up, ensures that passwords match
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

//If the user tries to change passwords
const handleChangePass = (e) => {
    e.preventDefault();

    $("#blurbMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Oops! Seems like you didn\'t fill out everything.");
        return false;
    }

    if ($("#pass").val() == $("#pass2").val()) {
        handleError("Uh oh! Looks like the passwords are the same.");
        return false;
    }

    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

    return false;
};

//Create login window
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
            <button id="button1" value="signup" href="/signup">Sign Up</button>
            <button id="button2" value="change" href="/changePassword">Change Password</button>
        </div>
    );
};

//Create sign up window
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
            <button id="button1" value="login" href="/login">Log In</button>
            <button id="button2" value="change" href="/changePassword">Change Password</button>
        </div>
    );
};

//Create change password window
const ChangePassWindow = (props) => {
    return (
        <div className="content-box">
            <form id="changePassForm" name="changePassForm"
                onSubmit={handleChangePass}
                action="/changePassword"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass">Old Password: </label>
                <input id="pass" type="password" name="pass" placeholder="old password" />
                <label htmlFor="pass2">New Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="new password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input id="changePassBtn" className="formSubmit" type="submit" value="Change Password" />
            </form>
            <h3>--OR--</h3>
            <button id="button1" value="login" href="/login">Log In</button>
            <button id="button2" value="signup" href="/signup">Sign Up</button>
        </div>
    );
};

//render change password winow
const createChangePassWindow = (csrf) => {
    ReactDOM.render(
        <ChangePassWindow csrf={csrf} />,
        document.querySelector(".content")
    );
    
    //All the ifs shouldn't be necessary except on createloginwindow, but the buttons were acting finicky and this resolved it
    const button1 = document.querySelector("#button1");
    const button2 = document.querySelector("#button2");

    if (button1.value === "signup") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button1.value === "login") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }
    if (button1.value === "change") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createChangePassWindow(csrf);
            return false;
        });
    }

    if (button2.value === "signup") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button2.value === "login") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }
    if (button2.value === "change") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createChangePassWindow(csrf);
            return false;
        });
    }
};

//render login window, start with this and based on buttons change to proper window to render
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector(".content")
    );

    const button1 = document.querySelector("#button1");
    const button2 = document.querySelector("#button2");

    if (button1.value === "signup") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button1.value === "login") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }
    if (button1.value === "change") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createChangePassWindow(csrf);
            return false;
        });
    }

    if (button2.value === "signup") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button2.value === "login") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }
    if (button2.value === "change") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createChangePassWindow(csrf);
            return false;
        });
    }
};

//render signup window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector(".content")
    );

    //All the ifs shouldn't be necessary except on createloginwindow, but the buttons were acting finicky and this resolved it
    const button1 = document.querySelector("#button1");
    const button2 = document.querySelector("#button2");

    if (button1.value === "signup") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button1.value === "login") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }
    if (button1.value === "change") {
        button1.addEventListener("click", (e) => {
            e.preventDefault();
            createChangePassWindow(csrf);
            return false;
        });
    }

    if (button2.value === "signup") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if (button2.value === "login") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }
    if (button2.value === "change") {
        button2.addEventListener("click", (e) => {
            e.preventDefault();
            createChangePassWindow(csrf);
            return false;
        });
    }
};

//Set up by trying to render login window
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