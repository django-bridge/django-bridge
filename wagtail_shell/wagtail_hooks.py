from django.urls import path, include
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.views.generic.base import TemplateView
from django.views.i18n import JavaScriptCatalog

from wagtail.core import hooks

from .decorators import shell_disable


@hooks.register("register_admin_urls")
def register_admin_urls():
    urls = [
        path('jsi18n/', JavaScriptCatalog.as_view(packages=['wagtail_shell']), name='javascript_catalog'),
        path('frame/', xframe_options_sameorigin(shell_disable(TemplateView.as_view(template_name='wagtailshell/frame.html'))), name='frame'),
    ]

    return [
        path(
            "shell/",
            include(
                (urls, "wagtail_shell"),
                namespace="wagtail_shell",
            ),
        )
    ]
