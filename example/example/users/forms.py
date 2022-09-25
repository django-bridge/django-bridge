from django import forms
from django.contrib.auth.forms import UsernameField
from django.contrib.auth.models import User


class UserChangeForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name"]
        field_classes = {"username": UsernameField}
