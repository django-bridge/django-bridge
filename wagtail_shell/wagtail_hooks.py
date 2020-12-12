from django.urls import path, include, reverse
from django.utils.html import format_html
from django.views.i18n import JavaScriptCatalog

from wagtail.admin.staticfiles import versioned_static
from wagtail.core import hooks


@hooks.register("register_admin_urls")
def register_admin_urls():
    urls = [
        path('jsi18n/', JavaScriptCatalog.as_view(packages=['wagtail_shell']), name='javascript_catalog'),

        # Add your other URLs here, and they will appear under `/admin/shell/`
        # Note: you do not need to check for authentication in views added here, Wagtail does this for you!
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


@hooks.register("insert_global_admin_js")
def insert_global_admin_js():
    return format_html(
        '<script src="{}"></script><script src="{}"></script>',
        versioned_static(reverse('wagtail_shell:javascript_catalog')),
        versioned_static('wagtail_shell/js/wagtail-shell.js'),
    )
