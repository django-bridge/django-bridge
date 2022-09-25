#!/usr/bin/env python

from os import path

from setuptools import find_packages, setup

from appshell import __version__

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="django-react-appshell",
    version=__version__,
    description="A framework for building React SPA frontends for Django projects",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Karl Hobley",
    author_email="karl@kaed.uk",
    url="",
    packages=find_packages(),
    include_package_data=True,
    license="BSD",
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
    extras_require={
        "dev": [
            "black>=22,<23",
            "flake8>=5,<6",
            "isort>=5,<6",
        ],
    },
    zip_safe=False,
)
