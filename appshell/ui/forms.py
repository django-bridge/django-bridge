"""
Register Telepath adapters for core Django form widgets, so that they can
have corresponding JavaScript objects with the ability to render new instances
and extract field values.
"""

from datetime import date, datetime, time

from django import forms

from appshell.telepath import Adapter, register


class ServerRenderedInputAdapter(Adapter):
    js_constructor = "forms.ServerRenderedInput"

    def js_args(self, widget):
        return [
            widget.render("__NAME__", None, attrs={"id": "__ID__"}),
            widget.id_for_label("__ID__"),
        ]


register(ServerRenderedInputAdapter(), forms.widgets.Input)
register(ServerRenderedInputAdapter(), forms.Textarea)


class TextInputAdapter(Adapter):
    js_constructor = "forms.TextInput"

    def js_args(self, widget):
        return [
            "text",
            widget.id_for_label("__ID__"),
            widget.attrs.get("class", ""),
        ]


register(TextInputAdapter(), forms.TextInput)


class FieldWithName:
    def __init__(self, name, field):
        self.name = name
        self.field = field


class FieldAdapter(Adapter):
    js_constructor = "forms.Field"

    def js_args(self, field):
        value = field.field.value()

        if isinstance(value, (datetime, date, time)):
            value = value.isoformat()

        return [
            field.name,
            field.field.label,
            field.field.field.required,
            field.field.field.disabled,
            field.field.field.widget,
            field.field.help_text,
            value,
        ]


register(FieldAdapter(), FieldWithName)


class FormAdapter(Adapter):
    js_constructor = "forms.Form"

    def js_args(self, form):
        return [
            [FieldWithName(name, form[name]) for name in form.fields.keys()],
            form.errors,
        ]


register(FormAdapter(), forms.BaseForm)
