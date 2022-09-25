from wagtail.admin.urls import urlpatterns
from wagtail.utils.urlpatterns import decorate_urlpatterns

from appshell.decorators import shell_enable


urlpatterns = decorate_urlpatterns(urlpatterns, shell_enable)
