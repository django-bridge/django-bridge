---
sidebar_position: 0
---

# When to use Django Render

Django Render is a great choice for building highly interactive applications. In this document, we will look at the areas where Django Render shines and where an alternative might be better.

## Where Django Render really shines

### Highly-interactive applications

Applications, whether offered as a SaaS or built internally at an organisation, is where Django Render really shines.

React allows you to build highly-reactive interfaces. State can be updated without server round-trips, and the code used to produce the first render can be re-used to apply those updates.

But using React often leads to bloated SPAs and requires a lot of boilerplate to set up (APIs, frontend tooling, etc).

Django render allows you to build a React frontend with minimal API and frontend libraries. It uses Django's URL routing and views and React for rendering the responses.

React is only used for rendering. All application logic is kept on the backend so bundle sizes are very small (usually less than 200KB) and initial renders are almost instant.

### Gradual migrations of template-rendered applications to React

If you're looking for a way to gradually migrate a template-rendered application to React, Django Render may be a great option.

Django Render uses Django's URL routing, so you don't need to set up a separate router for React and you can mix React-rendered views with template rendered views.

For best performance, make sure you use the `<Link>` tag when linking between React-rendered views and `<a>` tags when linking between React/template-rendered views. This allows the React views to fetch the content of the new page and re-render without reloading.

## Where Django Render doesn't shine so much

### Public websites that require SEO

While Django render apps render incredably fast (almost unnoticable to end users), client-side rendering does have an impact on SEO performance.

If you're building an application with a public website in the same project, you can build the public site with template-rendered views and build the application itself with React-rendered views.

### Decoupling the frontend from the backend

The frontend and backend of the Django Render app need to be tightly coupled together as the backend is what provides all the data and logic for the frontend to render. This means Django Render will be unsuitable for building frontends on top of generic APIs or integrating multiple backend applications in the same frontend (like Jamstack).

Despite this, Django Render does make it easier to develop the frontend and backend separately.Eeach view can be rendered with a single JSON response which makes it easier to mock out the responses in Storybook and to use test driven development to develop the backend views and application logic.
