import './Message.less';
import React from 'react';
import { Anchor } from '@r/platform/components';

import formatElapsedTime from 'lib/formatElapsedTime';
import RedditLinkHijacker from 'app/components/RedditLinkHijacker';

const T = React.PropTypes;

const SEPARATOR = ' \u2022 ';

export default function MessageThreadMessage(props) {
  const { message } = props;

  return (
    <div className='MessageThreadMessage'>
      <div className='MessageThreadMessage__title'>
        <Anchor
          className='MessageThreadMessage__authorLink'
          href={ `/user/${ message.author }` }
        >
          { message.author }
        </Anchor>
        { SEPARATOR }
        { formatElapsedTime(message.createdUTC) }
      </div>
      <RedditLinkHijacker>
        <div
          className='MessageThreadMessage__body'
          dangerouslySetInnerHTML={ { __html: message.bodyHTML } }
        />
      </RedditLinkHijacker>
    </div>
  );
}

MessageThreadMessage.propTypes = {
  message: T.object.isRequired,
};
