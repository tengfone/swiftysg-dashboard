import { useState, useRef } from "react";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { signIn } from "next-auth/client";
import { useSession, getSession } from "next-auth/client";
import { useEffect } from "react";

async function createUser(user, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ user, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export default function HomePage() {
  const userInputRef = useRef();
  const passwordInputRef = useRef();
  const secretCodeInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredUser = userInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let enteredSecretCode = "";
    if (enteredSecretCode.length !== 0) {
      enteredSecretCode = secretCodeInputRef.current.value;
    }

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false, // by default nextJS will send to another error page
        user: enteredUser,
        password: enteredPassword,
      });
      if (!result.error) {
        console.log("Passed");
        // set some auth state
        router.replace("/dashboard");
      }
    } else {
      try {
        // const result = await createUser(enteredUser, enteredPassword);
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/dashboard");
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="text">User Name</label>
          <input type="text" id="user" required ref={userInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
          {isLogin ? null : (
            <div>
              <label htmlFor="password">Secret Code</label>
              <input
                type="password"
                id="secretCode"
                required
                ref={secretCodeInputRef}
              />
            </div>
          )}
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}
