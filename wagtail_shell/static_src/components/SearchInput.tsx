import React from 'react';
import styled from 'styled-components';

import * as mixins from './common/mixins';

const SearchForm = styled.form`
    position: relative;
    padding: 0 1em 1em;
    margin: 0;
    width: 100%;
    box-sizing: border-box;

    label {
        ${mixins.visuallyhidden()}
    }

    input,
    button {
        border-radius: 0;
        font-size: 1em;
        border: 0;
    }

    input {
        cursor: pointer;
        border: 1px solid $nav-search-border;
        background-color: #333;  // $nav-search-bg;
        color: #ccc;  // $nav-search-color;
        padding: 0.8em 2.5em 0.8em 1em;
        font-weight: 600;

        &:hover {
            background-color: hsla(0,0%,39.2%,.15);  // $nav-search-hover-bg;
        }

        &:active,
        &:focus {
            background-color: #hsla(0,0%,39.2%,.15);  // $nav-search-focus-bg;
            color: #fff;  // $nav-search-focus-color;
        }

        &::placeholder {
            color: #ccc;  // $color-menu-text;
        }
    }

    button {
        background-color: transparent;
        position: absolute;
        top: 0;
        right: 1em;
        bottom: 0;
        padding: 0;
        width: 3em;

        &:hover {
            background-color: rgba(100, 100, 100, 0.15);  // $nav-item-hover-bg;
        }

        &:active {
            background-color: #1a1a1a;  // $nav-item-active-bg;
        }

        &:before {
            font-family: wagtail;
            font-weight: 200;
            text-transform: none;
            content: map-get($icons, 'search');
            display: block;
            height: 100%;
            line-height: 3.3em;
            padding: 0 1em;
        }
    }
`;

interface SearchInputProps {
    searchUrl: string;
    navigate(url: string): void;
}

export const SearchInput: React.FunctionComponent<SearchInputProps> = ({searchUrl, navigate}) => {
    const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        navigate(searchUrl + '?q=' + encodeURIComponent(e.target.value))
    };

    return (
        <SearchForm action={searchUrl} method="get">
            <div>
                <label htmlFor="menu-search-q">{gettext('Search')}</label>
                <input type="text" id="menu-search-q" name="q" placeholder={gettext('Search')} onChange={onChangeSearchInput} />
                <button className="button" type="submit">{gettext('Search')}</button>
            </div>
        </SearchForm>
    );
}
