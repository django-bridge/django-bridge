---
sidebar_position: 10
---

# Python objects in React

Django Render has built-in support for converting Python objects into JavaScript objects so they can be used by React.

There are two parts, on the backend we need to define an “adapter”, this is a class that tells Django Render how to convert an instance of a particular Python class into JSON.
Then on the frontend, we need to define a “constructor” which constructs a JavaScript object from the JSON.

Adapters are defined in a file called ``adapters.py`` which can be created in any app. Django Render will auto detect these files and load them.

For example, here is an adapter to convert Django's ``TextInput`` widget:

```python

from django import forms
from django_render.adapters import Adapter, register

class TextInputAdapter(Adapter):
    js_constructor = "forms.TextInput"

    def js_args(self, widget):
        return [
            "text",
            widget.attrs.get("class", ""),
        ]

register(TextInputAdapter(), forms.TextInput)
```

Let’s step through this code one line at a time:

- First, we import the Django forms framework and the ``Adapter`` class and ``register`` function from Django Render

- Next, we define a class called ``TextInputAdapter`` that inherits from ``Adapter``

- Then we set the ``js_constructor`` attribute to “forms.TextInput”. This tells the frontend which constructor to use to create the JavaScript object. The naming convention of this is arbitrary

- We then define a ``js_args`` function. This takes an instance of a ``TextInput`` and returns a list of arguments that will be passed in to the constructor.
In this example, we want to know the type of ``TextInput`` (since we can reuse this for passwords and emails) and the ``class``.

- Finally, we call ``register`` which adds the adapter to the registry. The second argument is the type of object that this adapter will adapt. Note that this `adapter` will also adapt any other class that inherits from ``TextInput`` unless a more specific adapter is registered for the sub-class

Next we need to define a constructor to create the JavaScript objects that will represent our text inputs:

```jsx
export default class TextInputDef {
  constructor(type, className) {
    this.type = type;
    this.className = className;
  }

  render(id, name, disabled, value) {
    return (
      <input
        id={id}
        type={this.type}
        name={name}
        defaultValue={value}
        disabled={disabled}
        className={this.className}
      />
    );
  }
}
```
