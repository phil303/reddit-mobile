import './styles.less';

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { JSForm } from '@r/platform/components';

import cx from 'lib/classNames';
import * as replyActions from 'app/actions/reply';

const T = React.PropTypes;

export class CommentReplyForm extends React.Component {
  static propTypes = {
    onToggleReply: T.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      disableButton: !props.text,
      text: props.text,
    };
  }

  onTextChange = (e) => {
    this.setState({
      text: e.target.value,
      disableButton: !e.target.value,
    });
  }

  render () {
    const { onToggleReply, onSubmitReply, currentContent } = this.props;
    const { disableButton, text } = this.state;
    const buttonClass = cx('Button', { 'm-disabled': disableButton });

    return (
      <JSForm onSubmit={ onSubmitReply } className='CommentReplyForm'>
        <div className='CommentReplyForm__textarea'>
          <textarea
            className='TextField'
            name='text'
            onChange={ this.onTextChange }
            defaultValue={ currentContent }
            value={ text }
          />
        </div>

        <div className='CommentReplyForm__footer'>
          <span
            className='CommentReplyForm__close icon icon-x Button m-linkbutton'
            onClick={ onToggleReply }
          />

          <div className='CommentReplyForm__button'>
            <button type='submit' className={ buttonClass } disabled={ disableButton }>
              ADD COMMENT
            </button>
          </div>
        </div>
      </JSForm>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.replying.content || '',
  currentContent => ({ currentContent }),
);

const mapDispatchToProps = (dispatch, { parentId }) => ({
  onSubmitReply: text => dispatch(replyActions.submit(parentId, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentReplyForm);
