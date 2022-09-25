/* eslint-disable react/prop-types */

import React from 'react';

import Icon from '../common/Icon';

interface PageCountProps {
    page: {
        id: number;
        children: {
            count: number;
        }
    }
}

const PageCount: React.FunctionComponent<PageCountProps> = ({ page }) => {
    const count = page.children.count;

    return (
        <a
            href={`${wagtailConfig.ADMIN_URLS.PAGES}${page.id}/`}
            className="c-explorer__see-more"
        >
            {gettext('See all')}
            <span>{` ${count} ${count === 1 ? gettext('Page').toLowerCase() : gettext('Pages').toLowerCase()}`}</span>
            <Icon name="arrow-right" />
        </a>
    );
};

export default PageCount;
