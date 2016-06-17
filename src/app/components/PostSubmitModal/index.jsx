import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Anchor } from '@r/platform/components';

import Modal, { BUTTON } from '../Modal';
import './styles.less';

const T = React.PropTypes;

const TITLE_PLACEHOLDER = 'Add an interesting title';
const TITLE_TEXT = {
  text: 'Text',
  link: 'Link',
  image: 'Image',
};

class PostSubmitModal extends React.Component {
  constructor() {
    super();
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

          <div className='PostSubmitModal__community'>
            <div className='PostSubmitModal__community-snoo-icon'>
              <div className='PostSubmitModal__community-snoo'></div>
            </div>
            <Anchor href='/submit/to_community'>
              <div className='PostSubmitModal__community-text'>
                Select a community
                <div className='icon icon-nav-arrowdown'></div>
              </div>
            </Anchor>
          </div>

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

  handleTextAreaChange(e) {
    const { target } = e.nativeEvent;
    const { scrollHeight } = target;
    const { height } = target.getBoundingClientRect();
    target.style.height = scrollHeight > height ? scrollHeight : height;
  }
}


const mapStateToProps = createSelector(
  state => state.platform.currentPage,
  pageParams => {
    const { queryParams: { type: submissionType } } = pageParams;
    return { submissionType };
  }
);

export default connect(mapStateToProps)(PostSubmitModal);
