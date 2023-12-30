#!/usr/bin/env python

from os import path

from djream import __version__
from setuptools import find_packages, setup

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, "../README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="djream",
    version=__version__,
    description="A framework for building React frontends for Django projects",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Karl Hobley",
    author_email="karl@kaed.uk",
    url="",
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
        "Programming Language :: Python :: 3.10",
        "Framework :: Django",
        "Framework :: Django :: 4.0",
    ],
    install_requires=["Django>=4.0,<5.0", "telepath>=0.3,<0.4"],
    zip_safe=False,
)
