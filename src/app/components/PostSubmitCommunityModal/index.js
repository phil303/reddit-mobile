import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import filter from 'lodash/filter';
import { Anchor } from '@r/platform/components';

import Modal, { BUTTON } from '../Modal';
import './styles.less';

const COMMUNITY_DEFAULT = 'Search for a community';
const RECENTS_LIMIT = 7;

const PostSubmitCommunityModal = (props) => {
  const { recentSubreddits } = props;
  return (
    <Modal exitTo='/submit' titleText='Post to a community'>
      <div className='PostSubmitCommunity'>
        <div className='PostSubmitCommunity__search'>
          <div className='icon icon-search'></div>
          <div className='PostSubmitCommunity__search-input'>
            <input placeholder={ COMMUNITY_DEFAULT } />
          </div>
        </div>
        { recentSubreddits.length ? renderRecentSubreddits(recentSubreddits) : null }
      </div>
    </Modal>
  );
}

const renderRecentSubreddits = (recentSubreddits) => {
  return (
    <div className='PostSubmitCommunity__recents'>
      <div className='PostSubmitCommunity__recents-title'>
        Recently visited
      </div>
      <div className='PostSubmitCommunity__recents-list'>
        { recentSubreddits.map(renderSubredditRow) }
      </div>
    </div>
  );
};

const renderSubredditRow = ({ subredditName, iconUrl }) => {
  const style = iconUrl ? { backgroundImage: `url(${iconUrl})` } : null;

  return (
    <div className='PostSubmitCommunity__recents-row'>
      <div className='PostSubmitCommunity__recents-icon'>
        <div className='PostSubmitCommunity__recents-icon-snoo' style={ style }></div>
      </div>
      <div className='PostSubmitCommunity__recents-name'>
        { `r/${subredditName}` }
      </div>
    </div>
  );
}


const mapStateToProps = createSelector(
  state => state.recentSubreddits.slice(0, RECENTS_LIMIT),
  state => state.subreddits,
  (recentSubreddits, subreddits) => {
    return {
      recentSubreddits: recentSubreddits.map(subredditName => {
        const subredditMetaData = subreddits[subredditName];
        const iconUrl = subredditMetaData ? subredditMetaData.iconImage : null;
        return { subredditName, iconUrl };
      }),
    };
  },
);

export default connect(mapStateToProps)(PostSubmitCommunityModal);
