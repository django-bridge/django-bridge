---
sidebar_position: 1
---

# Introduction

## What is Django Render?

Django Render is a library and approach that allows you to create fully client-side rendered frontends for Django applications in a simple and productive way.

Instead of client-side routing and APIs, Django render applications use Django’s URL routing and views.
So you can build your backend like a regular Django application but render the frontend with React components instead of Django templates.

## How does it work?

Django render applications are built with regular Django URL routing and views on the backend and React components on the frontend.

The Django views return JSON responses that contain the name of the component to render, its props, and any additional global context.
On the client, these responses are parsed and the named component is looked up and rendered using the provided props and global context.

*Wouldn't JSON limit you to only strings, numbers, dicts and lists in your props?* Not at all! Thanks to the [Telepath](https://wagtail.github.io/telepath/) library, Django Render allows you to adapt any Python object into JavaScript.
This means you can send any Python object, such as form definitions, to the frontend and render them with React.

*If my views return JSON, how does the browser render it?* Django Render has a middleware class that detects whether the client is a regular browser request and converts the response to HTML by nesting the JSON in a HTML template which also loads the frontend bundle.
Any subsequent requests are made using the browsers `fetch()` API and rendered without reloading the page.

## Is it right for my project?

If you are looking to build an internal application or SaaS product using Django and React, Django Render should be a great option!

It allows you to keep all of your application logic in the backend, keeping the frontend light and nimble. You can use Django’s built-in forms framework for all form logic and validation too.

If you have an existing Django template-rendered application and would like to port it to React incrementally, Django Render could really help with this. Django Render uses Django views and forms, so you can keep your application logic where it is. You can also mix Django template rendered views with React rendered views in the same application so you don’t have to port everything in one go.

Django Render may not be a great option if you are building a public website that needs good SEO. All Django Render views are client-side rendered which makes it difficult for Django to read the content.

Django Render also may not be a great option in organisations where the React frontend and Django backend are maintained by separate teams as these components need to be tightly coupled together. It is possible to mitigate this by treating the JSON responses as a sort of stable API and using TDD and Storybook to build each component in isolation, but there is no support for formalising this API (in a way like GraphQL or OpenAPI does).
