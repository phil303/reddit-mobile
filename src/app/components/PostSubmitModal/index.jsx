import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Anchor } from '@r/platform/components';

import Modal, { BUTTON } from '../Modal';
import './styles.less';

const T = React.PropTypes;

const SELECT_COMMUNITY = 'Select a community';
const TITLE_PLACEHOLDER = 'Add an interesting title';
const TITLE_TEXT = {
  text: 'Text',
  link: 'Link',
  image: 'Image',
};

class PostSubmitModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
  }

  static propTypes = {
    submissionType: T.oneOf(Object.keys(TITLE_TEXT)),
  };

  static defaultProps = {
    submissionType: 'text',
  };

  render() {
    const { submissionType } = this.props;
    const showImageForm = submissionType === 'image';
    const title = TITLE_TEXT[submissionType];

    return (
      <Modal exitTo='/' titleText={ title } action={ BUTTON } buttonText='POST'>
        <div className='PostSubmitModal'>

          { this.renderCommunityButton() }

          <div className='PostSubmitModal__title'>
            <input placeholder={ TITLE_PLACEHOLDER } />
          </div>

          <div className='PostSubmitModal__content'>
            { this.chooseContentInput(submissionType) }
          </div>
        </div>
      </Modal>
    );
  }

  chooseContentInput() {
    switch (this.props.submissionType) {
      case 'text':
        return this.renderTextInput();
      case 'link':
        return this.renderLinkInput();
      case 'image':
        return this.renderImageProgress();
      default:
        return this.renderTextInput();
    }
  }

  renderTextInput() {
    return (
      <div className='PostSubmitModal__content-text'>
        <textarea
          rows='5'
          onChange={ this.handleTextAreaChange }
          placeholder='Add your text...' />
      </div>
    );
  }

  renderLinkInput() {
    return (
      <div className='PostSubmitModal__content-link'>
        <input placeholder='Paste your link here...' />
      </div>
    );
  }

  renderImageForm() {
    return (
      <div className='PostSubmitModal__content-image'></div>
    );
  }

  renderCommunityButton() {
    const { community: { name, iconUrl } } = this.props;

    const style = iconUrl ? { backgroundImage: `url(${iconUrl})` } : null;
    const text = name ? name : SELECT_COMMUNITY;

    return (
      <div className='PostSubmitModal__community'>
        <div className='PostSubmitModal__community-snoo-icon'>
          <div className='PostSubmitModal__community-snoo' style={ style }></div>
        </div>
        <Anchor href='/submit/to_community'>
          <div className='PostSubmitModal__community-text'>
            { text }
            { name ? null : <div className='icon icon-nav-arrowdown'></div> }
          </div>
        </Anchor>
      </div>
    );
  }

  handleTextAreaChange(e) {
    const { target } = e.nativeEvent;
    const { scrollHeight } = target;
    const { height } = target.getBoundingClientRect();
    target.style.height = scrollHeight > height ? scrollHeight : height;
  }
}


const mapStateToProps = createSelector(
  state => state.platform.currentPage,
  state => state.posting,
  state => state.subreddits,
  (pageParams, posting, subreddits) => {
    const { queryParams: { type: submissionType } } = pageParams;

    const communityMetaData = subreddits[posting.community];
    const iconUrl = communityMetaData ? communityMetaData.iconImage : null;

    return { submissionType, community: { name: posting.community, iconUrl } };
  }
);

export default connect(mapStateToProps)(PostSubmitModal);
