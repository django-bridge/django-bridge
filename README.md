# Djream

Djream is a framework for rapidly building Django applications with React SPA frontends.

## Features

- Build React SPAs using Django views, urls, and forms
- Render views in modals
- 10KB of minified JavaScript, only depends on React. As URL routing and state is managed on the backend, you won't need Redux or React Router
- Seamless integration with non-SPA Django views, allowing mixing with third-party applications and incremental rewrites
- Support for hot-reloading with Vite

## How it works

Djream uses Django's URL routing and views on the backend. Instead of HTML, Djream-enabled views return a JSON document describing what to render.

For example, a request to `/todos/` could return the following JSON:

```json
> GET /todos HTTP/2.0
> Accept: application/json
...
< Content-Type: application/json
{
    "view": "todo-list",
    "context": {
        "todos": [
            ...
        ]
    }
}
```

The frontend will look up the React component assiciated with "todo-list" and render it with the given context passed as the props.

### Initial load

If the views only return JSON, how does the browser get the JavaScript code to render it?

The first request to an SPA view is wrapped in a HTML document that displays a loading screen, loads the JS bundle, and has the initial JSON response embedded within. When the JS bundle is loaded, the initial JSON respose is rendered.

Djream based applications are incredably lightweight (Djream itself is 10KB), and all the required data for rendering is in that initial request, so this initial render usually feels instant.

### Navigation without page reloads

After Djream is loaded, new requests are made using `fetch()` calls. The server returns a JSON documents describing what to render the next page, so Djream will render it and update the URL with `pushState`.

### Switching between SPA and non-SPA views

Can I still render HTML in Django? Yes you can!

All SPA-enabled views are decorated with `@djream_enable`, so Djream can tell if a view would return an SPA-response without actually calling it.

So, on each click, Djream will check if the next URL is SPA-enabled, if it's not then the link will be loaded the traditional way.

When users navigate back to an SPA-enabled URL, the initial response will be wrapped in HTML (see Initial load above), loading the SPA in again.

### Forms

Djream supports serializing Django form definitions, allowing them to be rendered in React.

Forms are submitted as `multipart/form-data` so can be processed by the view using the Django forms framework. Any errors can be fed back by serializing the form again and re-rendering it, just like you would with a Django template.

Djream has a `<Form>` React component that will submit the form over AJAX.

### Modals

Views can be opened in modals using the `openModal(url)` helper.



## Example

```python
@djream_enable
def my_view(request):
    # View logic here ...

    return DjreamResponse(
        request,
        "my-view",
        {
            "title": "This is a title",
            "message": "this is a message",
            "link": reverse("other_view"),
        }
```

```tsx
import { Shell, Link } from "djream";

# MyView.tsx
interface MyViewProps {
    title: string;
    message: string;
    link: string;
};

function MyView({title, message, link}: MyViewProps) {
    return <div>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link href={link}>Click me</Link>
    </div>
}

# App.tsx
function App() {
    const views = new Map();
    views.insert("my-view", MyView);

    return <Shell views={views} />;
}
```

## Installation

Install `djream` with pip:

    pip install djream

Add it to `INSTALLED_APPS`:

```python
# settings.py

INSTALLED_APPS = [
    # ...

    'djream',

    # ...
]

```

## Usage

See the [example project](https://github.com/kaedroho/djream/tree/main/example) for a usage example.
