#!/usr/bin/env python

from os import path

from setuptools import find_packages, setup

from djrender import __version__

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, "../README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="djrender",
    version=__version__,
    description="A framework for building React frontends for Django projects",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Karl Hobley",
    author_email="karl@kaed.uk",
    url="https://djrenderproject.org",
    project_urls={
        "Documentation": "https://dream.io/docs/",
        "Source": "https://github.com/kaedroho/djrender/",
        "Tracker": "https://github.com/kaedroho/djrender/issues",
    },
    packages=find_packages(),
    include_package_data=True,
    license="BSD-3-Clause",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: BSD License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Framework :: Django",
        "Framework :: Django :: 4.0",
        "Framework :: Django :: 5.0",
    ],
    install_requires=["Django>=4.0,<6.0", "telepath>=0.3,<0.4"],
    zip_safe=False,
)
