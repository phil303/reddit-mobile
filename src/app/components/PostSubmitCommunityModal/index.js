import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import filter from 'lodash/filter';
import { Anchor } from '@r/platform/components';
import * as platformActions from '@r/platform/actions';

import * as postingActions from '../../actions/posting';
import Modal, { BUTTON } from '../Modal';
import './styles.less';

const COMMUNITY_DEFAULT = 'Search for a community';
const RECENTS_LIMIT = 7;

class PostSubmitCommunityModal extends React.Component {
  constructor(props) {
    super(props);
    this.renderSubredditRow = this.renderSubredditRow.bind(this);
  }

  render() {
    const { recentSubreddits } = this.props;
    return (
      <Modal exitTo='/submit' titleText='Post to a community'>
        <div className='PostSubmitCommunity'>
          <div className='PostSubmitCommunity__search'>
            <div className='icon icon-search'></div>
            <div className='PostSubmitCommunity__search-input'>
              <input placeholder={ COMMUNITY_DEFAULT } />
            </div>
          </div>
          { recentSubreddits.length ?
              this.renderRecentSubreddits(recentSubreddits) : null }
        </div>
      </Modal>
    );
  }

  renderRecentSubreddits() {
    return (
      <div className='PostSubmitCommunity__recents'>
        <div className='PostSubmitCommunity__recents-title'>
          Recently visited
        </div>
        <div className='PostSubmitCommunity__recents-list'>
          { this.props.recentSubreddits.map(this.renderSubredditRow) }
        </div>
      </div>
    );
  }

  renderSubredditRow({ subredditName, iconUrl }) {
    const style = iconUrl ? { backgroundImage: `url(${iconUrl})` } : null;

    return (
      <div
        className='PostSubmitCommunity__recents-row'
        onClick={ () => this.props.onCommunityClick(subredditName) }
        key={ subredditName }
      >
        <div className='PostSubmitCommunity__recents-icon'>
          <div className='PostSubmitCommunity__recents-icon-snoo' style={ style }></div>
        </div>
        <div className='PostSubmitCommunity__recents-name'>
          { `r/${subredditName}` }
        </div>
      </div>
    )
  }
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

const dispatcher = dispatch => ({
  onCommunityClick: communityName => {
    dispatch(postingActions.selectCommunity(communityName));
    dispatch(platformActions.setPage('/submit'));
  },
});

export default connect(mapStateToProps, dispatcher)(PostSubmitCommunityModal);
