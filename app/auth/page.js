"use client"

import { useState, useEffect } from "react"
import AuthContext from "../context/authContext"
import { useContext } from "react"

const Login = () => {
    const { isAuthenticated, login } = useContext(AuthContext)
    const [contextLoad, setContextLoad] = useState(true);
    useEffect(() => {
        if (isAuthenticated) {
            login();
        }
        setTimeout(() => {
            setContextLoad(false);
        }, 400);
    }, [isAuthenticated]);

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [confrmPassword, setConfrmPassword] = useState('')

    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = () => {
        setIsCreatingAccount(true);
        setIsForgotPassword(false);
    }

    const handleForgotPassword = () => {
        setIsCreatingAccount(false);
        setIsForgotPassword(true);
    }

    const handleLoginAccount = () => {
        setIsForgotPassword(false);
        setIsCreatingAccount(false);
    }

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
            setTimeout(() => {
                setAlertMessage('');
            }, 500);
        }, 3000);
    }

    const handleSubmit = async () => {
        setLoading(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (isCreatingAccount) {
            if (password == '' || confrmPassword == '' || email == '' || username == '') {
                showAlert('Please fill in all fields');
                setLoading(false);
                return;
            }
            else if (password !== confrmPassword) {
                showAlert('Passwords do not match');
                setLoading(false);
                return;
            } else if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address');
                setLoading(false);
                return;
            } else {
                const res = await fetch("/api/newUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password, email }),
                })

                const data = await res.json();
                console.log(data);

                if (data?.message?.constraint == "users_email_key") {
                    showAlert("E-Mail already exists");
                    setLoading(false);
                    return;
                } else if (data?.message?.constraint == "users_username_key") {
                    showAlert("Username already exists");
                    setLoading(false);
                    return;
                } else if (data?.message == "Success") {
                    console.log(data);
                    localStorage.setItem("token", data.token);
                    setLoading(false);
                    login();
                    return;
                }
                return;
            }
        } else if (isForgotPassword) {

            return;
        } else {
            if (username == '' || password == '') {
                showAlert('Please fill in all fields');
                setLoading(false);
                return;
            }
            const res = await fetch("/api/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()
            console.log(data)
            if (data?.message == "Success") {
                localStorage.setItem("token", data.token);
                login();
                return;
            } else if (data?.message == "Wrong Password") {
                showAlert("Invalid Password");
                setLoading(false);
                return;
            } else if (data?.message == "NO") {
                showAlert("User Does not exist");
                setLoading(false);
                return;
            }
        }
    }

    if (contextLoad) {
        return (
            <main className='flex flex-col items-center m-8'>
                <section className='card bg-base-200 w-96 shadow-xl gap-5 p-4'>
                    <div className="skeleton h-32 w-full"></div>
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                </section>
            </main>
        )
    }


    return (
        <main className='flex flex-col items-center m-8'>
            <section className='card bg-base-200 w-96 shadow-xl gap-5 p-4'>
                {isCreatingAccount &&

                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path
                                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="grow" placeholder="Email" />
                    </label> || isForgotPassword && (
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                            </svg>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="grow" placeholder="Email" />
                        </label>
                    )}
                {!isForgotPassword && (
                    <>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="grow" placeholder="Username" />
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                            </svg>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="grow" placeholder='Password' />
                        </label>
                    </>
                )}
                {isCreatingAccount && (
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd" />
                        </svg>
                        <input value={confrmPassword} onChange={(e) => setConfrmPassword(e.target.value)} type="password" className="grow" placeholder='Confirm Password' />
                    </label>
                )}
                <button onClick={handleSubmit} className='btn btn-primary w-full'>{loading && <span className=" absolute right-8 loading loading-spinner"></span>}Submit</button>

                <div className="flex justify-between mt-2">
                    {!isForgotPassword && <button onClick={handleForgotPassword} className="btn btn-link">Forgot Password</button>}
                    {isForgotPassword && <button onClick={handleLoginAccount} className="btn btn-link">Login</button>}
                    {!isCreatingAccount && <button onClick={handleCreateAccount} className="btn btn-link">Create Account</button>}
                    {isCreatingAccount && <button onClick={handleLoginAccount} className="btn btn-link">Already have an account?</button>}
                </div>
            </section>
            {alertMessage && (
                <section className=' w-full overflow-hidden flex justify-center'>
                    <div role="alert" className={` w-64 alert alert-info mt-10 transform transition-all duration-1000 ease-out ${isAlertVisible ? '' : '-translate-y-[100%] opacity-0'}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{alertMessage}</span>
                    </div>
                </section>
            )}
        </main>
    )
}

export default Login
