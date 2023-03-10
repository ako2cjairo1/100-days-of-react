import styles from '../modules/Login.module.css'

export const Login = () => {
    const { background, shape, social, fb, login, password, separator, line, small } = styles
    return (
        <section>
            <div className={background}>
                <div className={shape}></div>
                <div className={shape}></div>
            </div>
            <form>
                <header>
                    <h3>Welcome back</h3>
                    {/* <p>Log in or create a new account to access your secure keychain.</p> */}

                </header>

                <label htmlFor="username">Email Address</label>
                <input
                    type="text"
                    placeholder="example@gmail.com"
                    id="username"
                />

                <label htmlFor="password">Master Password</label>
                <input className={password}
                    type="password"
                    placeholder="Password"
                    id="password"
                />
                <p><a className={small}>Forgot master password?</a></p>

                <button className={login}>Continue</button>
                <p className={small}>Don't have an account?<a> Sign up</a></p>
                <div className={separator}>
                    <div className={line}></div>
                    <p>OR</p>
                    <div className={line}></div>
                </div>
                <footer className={`${social}`}>
                    <button className="go">
                        <a href="" data-pr></a>
                        <i className="fab fa-google"></i> Continue with Google
                    </button>
                    <button className={fb}>
                        <i className="fab fa-facebook"></i> Continue with Facebook
                    </button>
                </footer>
            </form>
        </section>
    )
}
