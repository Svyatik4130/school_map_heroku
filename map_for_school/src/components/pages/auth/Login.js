import React, { useState } from 'react'
import AppleLogin from 'react-apple-login';
import GoogleLogin from 'react-google-login';
import AppleSignin from 'react-apple-signin-auth';
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import axios from 'axios'
import ErrorNotice from '../../layout/misc/ErrorNotice'

import { loggedUser } from '../../../actions/UserActions'
// import { getAllUsers } from '../../../actions/UserActions'
import { useDispatch } from 'react-redux'

export default function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()

    const dispatch = useDispatch()
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault()

        try {
            const loginUser = { email, password }

            const loginRes = await axios.post("users/login", loginUser)
            dispatch(loggedUser({
                token: loginRes.data.token,
                user: loginRes.data.user
            }))
            localStorage.setItem("auth-token", loginRes.data.token)

            history.push('/')
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    const responseGoogle = async (response) => {
        // qustion mark. will not throught an error if the object would not come to this function OR the object would be empty
        console.log(response)
        const result = response?.profileObj
        const token = response?.tokenId
        try {
            const newUser = { email: result.email, password: response?.tokenObj.access_token }
            await axios.post("/users/googleUserAuth", newUser)

            const userRespond = await axios.get("/users/getme", {
                headers: { "x-auth-token": token },
            });

            dispatch(loggedUser({
                token: token,
                user: userRespond.data
            }))
            localStorage.setItem("auth-token", token)
            history.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    const failedResponseGoogle = (response) => {
        console.log(response);
    }

    return (
        <div className="auth-wrapper-logNreg">
            <div className="auth-inner">
                <form onSubmit={submit}>
                    <h3>Login</h3>
                    {error && <ErrorNotice message={error} clearError={() => { setError(undefined) }} />}
                    <div className="form-group">
                        <label>Your email</label>
                        <input type="email" name="login" className="form-control" placeholder="Enter login" onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="pass" className="form-control" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block logNreg-btn">Submit</button>
                    <p className="forgot-password text-right">
                        Dont have account? <Link to={"/sign-up"}>Sign-up</Link>
                    </p>

                    {/* <AppleSignin
                        authOptions={{
                            clientId: 'behance.com',
                            scope: 'email name',
                            redirectURI: 'https://example.com',
                            state: '',
                            nonce: 'nonce',
                            usePopup: true,
                        }}
                        uiType="dark"
                        className="apple-auth-btn"
                        buttonExtraChildren="Continue with Apple"
                        onSuccess={(response) => console.log(response)}
                        onError={(error) => console.error(error)}
                    /> */}

                    <GoogleLogin
                        clientId="425644831777-ktunou2ldpdqi4mqe8r4fn724omhucmg.apps.googleusercontent.com"
                        buttonText="Continue with Google"
                        onSuccess={responseGoogle}
                        onFailure={failedResponseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </form>
            </div>
        </div>
    )
}
