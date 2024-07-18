---
sidebar_position: 5
---

# Navigation

## The ``<Link>`` component

Django Bridge includes a ``<Link>`` built-in component that extends the HTML ``<a>`` tag to provide client-side navigation between views.

For example:

```jsx
import { Link } from "@django-bridge/react";

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

When a user clicks this link, the ``/dashboard`` URL will be fetched in the background and the response rendered.

The ``<Link>`` component accepts all ``<a>`` tag attributes as props, and an extra optional prop called ``skipDirtyFormCheck`` which allows you to disable blocking the navigation away from a page that contains unsaved data in a form.

## The ``navigate()`` function

You can also trigger client-side navigation with the ``navigate()`` function that is provided by ``NavigationContext``.

For example, we can call this function from the ``onClick`` handler of a ``<button>``:

```jsx
import { Link, NavigationContext } from "@django-bridge/react";

export default function Page() {
  const { navigate } = useContext(NavigationContext);
  return <button type="button" onClick={() => navigate("/dashboard")}>Dashboard</button>
}
```
