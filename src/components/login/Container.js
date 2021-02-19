import React, { useState } from 'react'
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import LoginBox from "./Box"
import axios from "axios";
import ForgetPassword from "./ForgetPassword";
import UploadForm from "../upload/UploadForm";

const Container = () => {
    const [username, setUsername] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    // const [URL_Reducer, setURL_Reducer] = useState("")
    const [loginBool, setLoginBool] = useState(true)
    const [forgetPasswordShow, setForgetPasswordShow] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const [userRole, setUserRole] = useState(false)
    const [userFirstname, setUserFirstname] = useState(false)
    const [userLastname, setUserLastname] = useState(false)


    const onChangeUsername = (e) => {
        setUsername(e.target.value)
        console.log(username)
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
        console.log(password)
    }
    const loginHandle = () => {

        if (username === "") {
            setUsernameError("Der Benutzername ist erforderlich.");
        }
        else if (username && username.length < 3) {
            setUsernameError("Der Benutzername ist zu kurz.")
        } else {
            setUsernameError("")
        }
        if (password === "") {
            setPasswordError("Das Passswort ist erforderlich.");
        }
        else if (password && password.length < 3) {
            setPasswordError("Das Passswort ist zu kurz.")
        }

        if (usernameError || passwordError) {
            return false;
        } else {
            axios.get(`/api/usersValidation/${username}/${password}`)
                .then((response) => {
                    if (response.data.msg === "successfully") {
                        setLoginBool(true)
                        setErrorMsg("")
                        setPasswordError("");
                        setUsernameError("");
                        setUserRole(response.data.user.role)
                        setUserFirstname(response.data.user.firstname)
                        setUserLastname(response.data.user.lastname)

                        console.log(loginBool)
                        console.log(response.data.user.lastname)
                        console.log(response.data.user.firstname)


                    } else if (response.data.msg === "not successfully") {
                        setErrorMsg("Der Benutzername oder das Passwort ist falsch.")
                        setLoginBool(false)
                        console.log(response.data)
                        console.log(errorMsg)

                    }
                })
                .catch(err => {
                    console.log(err.data)
                })
        }
        console.log(passwordError, usernameError)

    }
    const forgetPassword = () => {
        if (forgetPasswordShow === false) {
            setForgetPasswordShow(true)
        }
    }
    return (
        <>
            {loginBool && !forgetPasswordShow && !errorMsg ?
                <>
                <UploadForm />
                </>
                : null}
            {!loginBool && !forgetPasswordShow ?
                <div style={{ marginTop: "10%", marginLeft: "30%", marginRight: "30%" }}>
                    <form >
                        <div style={{ color: "#E9967A", textAlign: "center" }} variant="h1">
                            <LockOutlinedIcon />
                        </div>
                        <TextField
                            variant="outlined"
                            autoFocus
                            fullWidth
                            className="mb-4"
                            margin="normal"
                            type="text"
                            name="username"
                            id="username"
                            label="Benutzername"
                            onChange={(e) => onChangeUsername(e)}
                        />
                        {usernameError ? (
                            <Typography variant="p" ><small className="text-danger"> {usernameError}</small></Typography>
                        )
                            : null}
                        <TextField
                            variant="outlined"
                            className="mb-4"
                            margin="normal"
                            fullWidth
                            type="password"
                            name="passwort"
                            label="Passwort"
                            onChange={(e) => onChangePassword(e)}
                        />
                        {passwordError ? (
                            <Typography variant="p" ><small className="text-danger"> {passwordError}</small></Typography>
                        )
                            : null}
                        <Button
                            fullWidth
                            variant="contained"
                            color="inherit"
                            name="login"
                            id="login-submit"
                            className="login-button"
                            style={{ color: "#E9967A", textAlign: "center", marginTop: "5%" }}
                            onClick={loginHandle}
                        >
                            Anmelden
                            </Button>

                        <Grid className="mt-4 " style={{ textAlign: "center", marginTop: "10%" }}>
                            <a variant="body2" color="inherit" style={{ color: "#1E90FF", cursor: "pointer" }} onClick={forgetPassword}>
                                {"Passwort vergessen ?"}
                            </a>
                        </Grid>
                    </form>
                    <LoginBox />
                </div>
                : null}

            {errorMsg && !loginBool ? (
                <div style={{ textAlign: "Center", marginTop: "30px", backgroundColor: "#E6E6FA" }}>
                    <Typography variant="p" color="secondary" align="center" > {errorMsg}</Typography>

                </div>
            ) : null}
            {forgetPasswordShow && !loginBool ?
                <ForgetPassword />
                : null}
        </>
    )
}

export default Container
