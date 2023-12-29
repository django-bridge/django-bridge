<!-- prettier-ignore -->
```ts twoslash
import Shell, { ShellResponse } from "@djream/core";
import PostForm from "./views/PostForm";

// List of views that can be rendered by Djream
const views = new Map();
views.set("PostForm", PostForm);

function App(): ReactElement {
  // Get the initial response from the server
  // This is used to render the first view, subsequent views are loaded via AJAX
  const rootElement = document.getElementById("root");
  const initialResponse = rootElement.dataset.initialResponse;

  return (
    <Shell
      views={views}
      initialResponse={JSON.parse(initialResponse)}
    />
  );
}

export default App;
```
