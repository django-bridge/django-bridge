from wagtail.admin.menu import MenuItem, SubmenuMenuItem
from wagtail.core import hooks


def serialize_admin_menu_item(request, item):
    if isinstance(item, SubmenuMenuItem):
        return {
            'type': 'group',
            'data': MenuItem.get_context(item, request),
            'items': serialize_admin_menu(request, item.menu),
        }

    else:
        return {
            'type': 'item',
            'data': item.get_context(request),
        }


def serialize_admin_menu(request, menu):
    menu_items = menu.menu_items_for_request(request)

    # provide a hook for modifying the menu, if construct_hook_name has been set
    if menu.construct_hook_name:
        for fn in hooks.get_hooks(menu.construct_hook_name):
            fn(request, menu_items)

    return [
        serialize_admin_menu_item(request, menu_item)
        for menu_item in sorted(menu_items, key=lambda i: i.order)
    ]
