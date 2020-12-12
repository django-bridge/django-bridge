import React from 'react';

interface SearchInputProps {
    searchUrl: string;
    navigate(url: string): void;
}

export const SearchInput: React.FunctionComponent<SearchInputProps> = ({searchUrl, navigate}) => {
    const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        navigate(searchUrl + '?q=' + encodeURIComponent(e.target.value))
    };

    return (
        <form className="nav-search" action={searchUrl} method="get">
            <div>
                <label htmlFor="menu-search-q">{gettext('Search')}</label>
                <input type="text" id="menu-search-q" name="q" placeholder={gettext('Search')} onChange={onChangeSearchInput} />
                <button className="button" type="submit">{gettext('Search')}</button>
            </div>
        </form>
    );
}
