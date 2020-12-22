import React from 'react';
import styled from 'styled-components';
import { WagtailPageAPI } from '../../wagtailapi/admin';

const PublicationStatusWrapper = styled.span`
    background: #333;  // $color-grey-1
    text-transform: uppercase;
    letter-spacing: 0.03rem;
    font-size: 10px;
`;

interface PublicationStatusProps {
    status: WagtailPageAPI['meta']['status'];
}

/**
 * Displays the publication status of a page in a pill.
 */
const PublicationStatus: React.FunctionComponent<PublicationStatusProps> = ({ status }) => (
    <PublicationStatusWrapper className={`o-pill${status.live ? ' c-status--live' : ''}`}>
        {status.status}
    </PublicationStatusWrapper>
);

export default PublicationStatus;
