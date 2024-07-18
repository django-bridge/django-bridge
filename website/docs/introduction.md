---
sidebar_position: 1
---

# Introduction

## What is Django Bridge?

Django Bridge provides a simple and productive way to create fully client-side rendered frontends for Django applications.

Django Bridge applications use Django’s built-in URL routing and views, allowing you to build your backend like a regular Django app and render the frontend with React components instead of Django templates.

## How does it work?

The backend operates similarly to a traditional Django application: requests are routed to views using Django's URL configuration, the view processes the request, and returns a response. The key difference is that the view returns a JSON response instead of an HTML response. This JSON response contains the name of the React component to render and any data to pass to it.

The frontend library parses this JSON response, then finds and renders the appropriate React component. When the user clicks on a hyperlink, the library fetches the data for the next page and renders it without reloading the page, providing a single-page application (SPA) experience.

The frontend setup uses a standard Vite+React configuration. In development, the Django server fetches the JavaScript built by the Vite dev server, enabling hot module reloading. In production, a static bundle is served to the browser, so Node.js is not required on the server.

*If the views return JSON, how does the browser render it?* Django Bridge includes a middleware class that detects whether the client is a regular browser request and converts the response to HTML. This is done by nesting the JSON within an HTML template that also loads the frontend bundle. Any subsequent requests are made using the browser's `fetch()` API and rendered without reloading the page.

*Wouldn't JSON limit you to only strings, numbers, dictionaries, and lists in your props?* Not at all! Thanks to the [Telepath](https://wagtail.github.io/telepath/) library, Django Bridge allows you to adapt any Python object into JavaScript. This means you can send any Python object, such as form definitions, to the frontend and render them with React.

## Should I use it?

If you're about to build a web app or SaaS product with Django and React, this library could save you a lot of time. It provides all the necessary tools to integrate a React frontend with Django and includes a [project template](/docs/start) with simple Vite-based frontend tooling to get you started.

If you want to add React to an existing Django application, Django Bridge can be very helpful. It uses Django's URL routing, views, and forms, allowing you to keep your application logic intact and  port templates to React incrementally.

However, if you are building a public website that requires good SEO, Django Bridge may not be the best option. Since all Django Bridge views are client-side rendered, it is difficult for search engines to read the content.

Additionally, Django Bridge may not be ideal for organizations where the React frontend and Django backend are maintained by separate teams, as these components need to be tightly coupled.
