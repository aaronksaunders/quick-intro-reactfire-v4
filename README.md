# quick-intro-reactfire-v4

- updated previously released reactfire intro application to work with v4
- current has auth and create account, will add some CRUD functionality soon


## Two Approaches For Checking For Auth User

From the react router documentation..
```jsx
// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export const PrivateRoute = ({
  children,
  location,
  ...rest
}: React.PropsWithChildren<any>) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  console.log(signInCheckResult);
  debugger;
  if (status === "loading") {
    return <IonLoading isOpen={status === "loading"} />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        signInCheckResult.signedIn === true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
};

```

From the ReactFire Example Code, see this is in `AppAuthWrapper.tsx`
```jsx
export const AuthWrapper = ({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { status, data: signInCheckResult } = useSigninCheck();
  console.log(signInCheckResult);

  if (!children) {
    throw new Error("Children must be provided");
  }
  if (status === "loading") {
    return <IonLoading isOpen={status === "loading"} />;
  } else if (signInCheckResult.signedIn === true) {
    return children as JSX.Element;
  }

  return fallback;
};

```