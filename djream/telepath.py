from datetime import datetime

from django import forms
from telepath import Adapter, AdapterRegistry, JSContextBase


class CustomJSContextBase(JSContextBase):

    # Remove default media as we import 'telepath-unpack' directly into the client app
    @property
    def base_media(self):
        return forms.Media()


class CustomAdapterRegistry(AdapterRegistry):
    js_context_base_class = CustomJSContextBase


registry = CustomAdapterRegistry()
JSContext = registry.js_context_class


def register(adapter, cls):
    registry.register(adapter, cls)


def adapter(js_constructor, base=Adapter):
    """
    Allows a class to implement its adapting logic with a `js_args()` method on the class itself.
    This just helps reduce the amount of code you have to write.

    For example:

        @adapter('wagtail.mywidget')
        class MyWidget():
            ...

            def js_args(self):
                return [
                    self.foo,
                ]

    Is equivalent to:

        class MyWidget():
            ...


        class MyWidgetAdapter(Adapter):
            js_constructor = 'wagtail.mywidget'

            def js_args(self, obj):
                return [
                    self.foo,
                ]
    """

    def _wrapper(cls):
        ClassAdapter = type(
            cls.__name__ + "Adapter",
            (base,),
            {
                "js_constructor": js_constructor,
                "js_args": lambda self, obj: obj.js_args(),
            },
        )

        register(ClassAdapter(), cls)

        return cls

    return _wrapper


class DateTimeAdapter(Adapter):
    js_constructor = "Date"

    def js_args(self, date):
        return [date.isoformat()]


register(DateTimeAdapter(), datetime)
