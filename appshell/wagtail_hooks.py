from django.urls import path, include
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.views.generic.base import TemplateView
from django.views.i18n import JavaScriptCatalog

from wagtail.core import hooks

from .decorators import shell_disable


@hooks.register("register_admin_urls")
def register_admin_urls():
    urls = [
        path('jsi18n/', JavaScriptCatalog.as_view(packages=['appshell']), name='javascript_catalog'),
        path('frame/', xframe_options_sameorigin(shell_disable(TemplateView.as_view(template_name='appshell/frame.html'))), name='frame'),
    ]

    return [
        path(
            "shell/",
            include(
                (urls, "appshell"),
                namespace="appshell",
            ),
        )
    ]


@hooks.register("insert_global_admin_css", order=100)
def global_admin_css():
    # Remove left padding from the content, this is usually for Wagtail's
    # builtin menu which we've removed in templates/wagtailadmin/base.html.
    return """
    <style>
        .wrapper {
            padding-left: 0;
        }

        #nav-toggle {
            display: none;
        }
    </style>
    """
