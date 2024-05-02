---
sidebar_position: 2
---

# Adding global context

In your application, you might want to have some information available for all parts of your application. This may be menu information, user data, urls, etc.

Global Context Providers are functions within Django that provide this data.

To create a Global Context Provider, first write a function that takes a request and returns something. For example, here's a couple of provider functions:

```python
def user(request):
    return {
        "username": request.user.username,
        "fullName": request.user.get_full_name(),
        "profileUrl": reverse("user_profile", args=[request.user.username])
    }


def urls(request):
    return {
        "login": reverse("login"),
    }
```

Then, register them using the ``CONTEXT_PROVIDERS`` setting:

```python
DJANGO_RENDER = {
    ...

    "CONTEXT_PROVIDERS": {
        "user": "myapp.context_providers.user",
        "urls": "myapp.context_providers.urls",
    }
}
```

Now, whenever a request is made to a Django Render enabled view, those functions will be called and the values added in the response. The values are separate from the props, but you can access this data by registering a React context for each one.

```tsx
interface User {
    username: string;
    fullName: string;
    profileUrl: string;
}

interface URLs {
    login: string;
}

const UserContext = React.createContext<User|null>(null);
const URLsContext = React.createContext<URLs>({login: "#"});

const config = DjangoRender.Config();

...

config.addContextProvider("user", UserContext);
config.addContextProvider("urls", URLsContext);

...
```

Now, let's implement a ``<UserAccount>`` component that displays the link to the users profile when logged in, or a link to log in if not:

```tsx
export function UserAccount() {
    const user = React.useContext(UserContext);
    const { login } = React.useContext(URLsContext);

    if (user === null) {
        // User is not logged in so show link to log in
        return <Link href={login}>Log in</Link>;
    }

    // Show link to users profile
    return <Link href={user.profileUrl}>{user.fullName}</Link>;
}
```
