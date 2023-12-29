<!-- prettier-ignore -->
```python
# views.py

@djream_view
def post_edit(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    form = PostForm(request.POST or None, instance=post)

    if form.is_valid():
        form.save()
        return redirect("post_detail", post_id=post.id)

    return DjreamResponse(request, "PostForm", {
        "title": post.title,
        "form": form,  # Form definitions can be mapped into JavaScript
        "form_action": reverse("post_edit", args=[post.id]),
        "csrf_token": get_token(request),
    })


# urls.py
from django.urls import path
from . import views


urlpatterns = [
    path("posts/<int:post_id>/edit/", views.post_edit, name="post_edit"),
]
```
