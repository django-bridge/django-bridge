import json

from django import template
from django.core.serializers.json import DjangoJSONEncoder
from django.urls import reverse

from wagtail.admin.menu import admin_menu
from wagtail.admin.navigation import get_explorable_root_page
from wagtail.admin.search import admin_search_areas
from wagtail.admin.staticfiles import versioned_static
from wagtail.admin.templatetags.wagtailadmin_tags import avatar_url


register = template.Library()


@register.simple_tag(takes_context=True)
def shell_template_rendered(context):
    request = context['request']
    request.shell_template_rendered = True
    return ''


@register.simple_tag(takes_context=True)
def shell_iframe_safe(context):
    return context['request'].shell_iframe_safe


@register.simple_tag(takes_context=True)
def shell_props(context):
    request = context['request']
    search_areas = admin_search_areas.search_items_for_request(request)
    if not search_areas:
        return ''
    search_area = search_areas[0]

    explorer_start_page = get_explorable_root_page(request.user)

    return json.dumps({
        'homeUrl': reverse('wagtailadmin_home'),
        'logoImages': {
            'mobileLogo': versioned_static('wagtailadmin/images/wagtail-logo.svg'),
            'desktopLogoBody': versioned_static('wagtailadmin/images/logo-body.svg'),
            'desktopLogoTail': versioned_static('wagtailadmin/images/logo-tail.svg'),
            'desktopLogoEyeOpen': versioned_static('wagtailadmin/images/logo-eyeopen.svg'),
            'desktopLogoEyeClosed': versioned_static('wagtailadmin/images/logo-eyeclosed.svg'),
        },
        'searchUrl': search_area.url,
        'explorerStartPageId': explorer_start_page.id if explorer_start_page else None,
        'menuItems': admin_menu.as_serializable(request),
        'user': {
            'name': request.user.first_name or request.user.get_username(),
            'avatarUrl': avatar_url(request.user, size=50),
        },
        'accountUrl': reverse('wagtailadmin_account'),
        'logoutUrl': reverse('wagtailadmin_logout'),
    }, cls=DjangoJSONEncoder)
