"""
Register Telepath adapters for core Django form widgets, so that they can
have corresponding JavaScript objects with the ability to render new instances
and extract field values.
"""

from datetime import date, datetime, time

from django import forms
from django.conf import settings
from django.forms.models import ModelChoiceIteratorValue
from django.template.defaultfilters import filesizeformat
from telepath import ValueNode

from ..telepath import Adapter, register


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


class PasswordInputAdapter(Adapter):
    js_constructor = "forms.TextInput"

    def js_args(self, widget):
        return [
            "password",
            widget.id_for_label("__ID__"),
            widget.attrs.get("class", ""),
        ]


register(PasswordInputAdapter(), forms.PasswordInput)


class FileInputAdapter(Adapter):
    js_constructor = "forms.FileInput"

    def js_args(self, widget):
        return [
            widget.id_for_label("__ID__"),
            widget.attrs.get("class", ""),
            widget.attrs.get("accept", ""),
            filesizeformat(settings.MAX_UPLOAD_SIZE),
        ]


register(FileInputAdapter(), forms.FileInput)


class SelectAdapter(Adapter):
    js_constructor = "forms.Select"

    def js_args(self, widget):
        return [
            widget.id_for_label("__ID__"),
            widget.options("__NAME__", ""),
            widget.attrs.get("class", ""),
        ]


register(SelectAdapter(), forms.Select)


class SelectMultipleAdapter(Adapter):
    js_constructor = "forms.SelectMultiple"

    def js_args(self, widget):
        return [
            widget.id_for_label("__ID__"),
            widget.options("__NAME__", ""),
            widget.attrs.get("class", ""),
            widget.attrs.get("inline", False),
        ]


register(SelectMultipleAdapter(), forms.SelectMultiple)


class ModelChoiceIteratorValueAdapter(Adapter):
    def build_node(self, value, context):
        return ValueNode(value.value)


register(ModelChoiceIteratorValueAdapter(), ModelChoiceIteratorValue)


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
