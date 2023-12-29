<!-- prettier-ignore -->
```ts twoslash
import React from 'react';
import { Form } from "@djream/forms";
import { Button } from "@djream/ui";

export default function PostForm({ title, form, form_action, csrf_token }) {
  return (
    <>
      <h1>{title}</h1>

      <Form action={form_action} method="post">
        <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token} />

        {form.render()}

        <Button type="submit">Save</Button>
      </Form>
    <>
  );
}
```
