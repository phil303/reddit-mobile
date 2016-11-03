import './Message.less';
import React from 'react';
import { Anchor } from '@r/platform/components';

import formatElapsedTime from 'lib/formatElapsedTime';
import RedditLinkHijacker from 'app/components/RedditLinkHijacker';

const T = React.PropTypes;

const SEPARATOR = ' \u2022 ';

export default function MessagesMessage(props) {
  const { message } = props;

  return (
    <div className='MessagesMessage'>
      <div className='MessagesMessage__header'>
        <div className='MessagesMessage__title'>
          <Anchor
            className='MessagesMessage__titleLink'
            href={ message.cleanPermalink }
          >
            { message.subject }
          </Anchor>
        </div>
        <div className='MessagesMessage__subtitle'>
          <Anchor
            className='MessagesMessage__authorLink'
            href={ `/user/${ message.author }` }
          >
            { message.author }
          </Anchor>
          { SEPARATOR }
          { formatElapsedTime(message.createdUTC) }
        </div>
        <Anchor
          className='MessagesMessage__link icon icon-nav-arrowforward'
          href={ message.cleanPermalink }
        />
      </div>
      <RedditLinkHijacker>
        <div
          className='MessagesMessage__body'
          dangerouslySetInnerHTML={ { __html: message.bodyHTML } }
        />
      </RedditLinkHijacker>
    </div>
  );
}

MessagesMessage.propTypes = {
  message: T.object.isRequired,
};
