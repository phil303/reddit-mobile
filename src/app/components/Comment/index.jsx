/* eslint-disable no-return-assign */
import './styles.less';

import React from 'react';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { models } from '@r/api-client';

import mobilify from 'lib/mobilify';
import * as commentActions from 'app/actions/comment';
import { DEFAULT_COMMENT_REQUEST } from 'app/reducers/moreCommentsRequests';
import cx from 'lib/classNames';
import CommentsList from 'app/components/CommentsList';
import CommentHeader from './CommentHeader';
import CommentTools from './CommentTools';
import CommentReplyForm from './CommentReplyForm';
import RedditLinkHijacker from 'app/components/RedditLinkHijacker';


const T = React.PropTypes;

const LOAD_MORE_COMMENTS = 'More Comments';
const LOADING_MORE_COMMENTS = 'Loading...';
const NESTING_STOP_LEVEL = 6;

const COLLAPSE_ANIMATION = { stiffness: 500, damping: 40 };
const FADE_ANIMATION = { stiffness: 200, damping: 40 };

class Comment extends React.Component {
  componentWillMount() {
    // Set initial collapse state for the component
    this.currentlyCollapsed = this.props.commentCollapsed;
    this.shouldAnimate = false;
  }

  componentWillUpdate(nextProps) {
    // Before this starts animating, measure its current height since it could
    // have changed (via children expanding/collapsing or other means)
    this.commentBaseHeight = this.commentBase.getBoundingClientRect().height;

    // Detect when the user has asked the comments to collapse or expand
    this.shouldAnimate = this.currentlyCollapsed !== nextProps.commentCollapsed;
    if (this.shouldAnimate) {
      this.currentlyCollapsed = nextProps.commentCollapsed;
    }
  }

  render() {
    const {
      comment,
      authorType,
      nestingLevel,
      isTopLevel,
      preview,
      commentCollapsed,
      highlightedComment,
      onToggleCollapse,
    } = this.props;

    const commentClasses = cx('Comment', { 'in-comment-tree': !preview });

    return (
      <div className={ commentClasses }>
        <div className='Comment__header' id={ comment.id }>
          <CommentHeader
            id={ comment.id }
            author={ comment.author }
            authorType={ authorType }
            topLevel={ isTopLevel }
            dots={ Math.max(nestingLevel - NESTING_STOP_LEVEL, 0) }
            flair={ comment.authorFlairText }
            created={ comment.createdUTC }
            gildCount={ comment.gilded }
            collapsed={ commentCollapsed }
            highlight={ comment.id === highlightedComment }
            stickied={ comment.stickied }
            onToggleCollapse={ onToggleCollapse }
          />
        </div>
        { this.renderCommentBase() }
      </div>
    );
  }

  renderCommentBase() {
    const { commentCollapsed } = this.props;

    if (this.shouldAnimate) {
      const startHeight = commentCollapsed ? this.commentBaseHeight : 0;
      const startOpacity = commentCollapsed ? 1 : 0;

      const endHeight = commentCollapsed ? 0 : this.commentBaseHeight;
      const endOpacity = commentCollapsed ? 0 : 1;

      const startStyle = { height: startHeight, opacity: startOpacity };
      const interpolateTo = {
        opacity: spring(endOpacity, FADE_ANIMATION),
        height: spring(endHeight, COLLAPSE_ANIMATION),
      };

      return (
        <Motion defaultStyle={ startStyle } style={ interpolateTo }>
          { style => this._renderCommentBase(style) }
        </Motion>
      );
    }

    // Generally render without React-Motion
    const style = { height: commentCollapsed ? 0 : this.commentBaseHeight };
    return this._renderCommentBase(style);
  }

  _renderCommentBase(_style) {
    // Use the height if it's measured and not equal to the total height of
    // the comments. If it's equal to the total height, (which means the
    // animation has finished, use `auto` so any new height changes are
    // naturally accounted for.
    const { height } = _style;
    const shouldUseHeight = height !== null && height !== this.commentBaseHeight;
    const style = shouldUseHeight ? _style : { ..._style, height: 'auto' };

    return (
      <div style={ style } className='Comment__base-mask'>
        <div className='Comment__base' ref={ comp => this.commentBase = comp }>
          <RedditLinkHijacker>
            <div
              className='Comment__body'
              dangerouslySetInnerHTML={ { __html: mobilify(this.props.comment.bodyHTML) } }
            />
          </RedditLinkHijacker>

          { !this.props.isUserActivityPage ? renderFooter(this.props) : null }
        </div>
      </div>
    );
  }
}

function renderFooter(props) {
  const {
    commentDeleted,
    commentReplying,
    commentingDisabled,
    comment,
    preview,
  } = props;

  return [
    !commentDeleted ? renderTools(props) : null,
    !preview && commentReplying && !commentingDisabled ? renderCommentReply(props) : null,
    !preview && comment.replies.length ? renderReplies(props) : null,
  ];
}


function renderTools(props) {
  const {
    user,
    comment,
    currentPage,
    commentReplying,
    onToggleEditForm,
    onDeleteComment,
    onToggleSaveComment,
    commentingDisabled,
    votingDisabled,
  } = props;

  return (
    <div className='Comment__toolsContainer clearfix'>
      <div className='Comment__tools'>
        <CommentTools
          id={ comment.name }
          score={ comment.score }
          scoreHidden={ comment.scoreHidden }
          voteDirection={ comment.likes }
          commentAuthor={ comment.author }
          username={ user ? user.name : null }
          saved={ comment.saved }
          currentPage = { currentPage }
          replying={ commentReplying }
          permalinkUrl={ comment.cleanPermalink }
          onEdit={ onToggleEditForm }
          onDelete={ onDeleteComment }
          onToggleSave={ onToggleSaveComment }
          commentingDisabled={ commentingDisabled }
          votingDisabled={ votingDisabled }
        />
      </div>
    </div>
  );
}


function renderCommentReply(props) {
  const { savedReplyContent, comment, currentPage } = props;
  return (
    <CommentReplyForm
      currentPage={ currentPage }
      parentId={ comment.name }
      savedReply={ savedReplyContent }
    />
  );
}


function renderReplies(props) {
  const { op, nestingLevel, comment } = props;

  const className = cx('Comment__replies', {
    'm-no-indent': nestingLevel >= NESTING_STOP_LEVEL,
  });

  return (
    <div className={ className }>
      <CommentsList
        op={ op }
        commentRecords={ comment.replies }
        parentComment={ comment }
        nestingLevel={ nestingLevel + 1 }
      />

      { comment.loadMoreIds.length ? renderMoreCommentsButton(props) : null }

    </div>
  );
}

function renderMoreCommentsButton(props) {
  const { comment, moreCommentStatus, onLoadMore } = props;

  const loadingText = moreCommentStatus.loading
    ? LOADING_MORE_COMMENTS
    : `${LOAD_MORE_COMMENTS} (${comment.numReplies})`;

  return (
    <div className='Comment__loadMore' onClick={ onLoadMore }>
      <div className='icon icon-caron-circled' />
      <span className='Comment__loadMore-text'>{ loadingText }</span>
    </div>
  );
}


Comment.propTypes = {
  // start props passed in via state selector
  comment: T.instanceOf(models.CommentModel).isRequired,
  commentReplying: T.bool.isRequired,
  currentPage: T.object.isRequired,
  highlightedComment: T.string,
  isEditing: T.bool.isRequired,
  moreCommentStatus: T.object.isRequired,
  user: T.object.isRequired,
  // start props passed in via dispatch selector
  onDeleteComment: T.func.isRequired,
  onToggleEditForm: T.func.isRequired,
  onToggleSaveComment: T.func.isRequired,
  reportComment: T.func.isRequired,
  // start props passed in via merge selector
  authorType: T.string.isRequired,
  commentCollapsed: T.bool.isRequired,
  isTopLevel: T.bool.isRequired,
  onLoadMore: T.func.isRequired,
  onToggleCollapse: T.func.isRequired,
  // start props passed in via parent component
  commentId: T.string.isRequired,
  nestingLevel: T.number,
  op: T.string,
  preview: T.bool,
  isUserActivityPage: T.bool,
};


Comment.defaultProps = {
  authorType: '',
  highlightedComment: '',
  nestingLevel: 0,
  op: null,
  preview: false,
};


const selector = createSelector(
  state => state.user,
  state => state.platform.currentPage,
  (state, props) => state.comments[props.commentId],
  (state, props) => state.moreCommentsRequests[props.commentId] || DEFAULT_COMMENT_REQUEST,
  (state, props) => state.collapsedComments[props.commentId] || false,
  (state, props) => state.platform.currentPage.queryParams.commentReply === props.commentId,
  (state, props) => state.editingComment === props.commentId,

  (user, currentPage, comment, moreCommentStatus, commentCollapsed, commentReplying, isEditing) => {

    return {
      user,
      currentPage,
      comment,
      commentCollapsed,
      commentReplying,
      isEditing,
      moreCommentStatus,
      highlightedComment: currentPage.urlParams.commentId,
    };
  },
);


const mapDispatchToProps = (dispatch, { commentId }) => ({
  onToggleEditForm: () => dispatch(commentActions.toggleEditForm(commentId)),
  onDeleteComment: () => dispatch(commentActions.del(commentId)),
  onToggleSaveComment: () => dispatch(commentActions.toggleSave(commentId)),
  reportComment: reason => dispatch(commentActions.report(commentId, reason)),
  onLoadMore: comment => dispatch(commentActions.loadMore(comment)),
  onToggleCollapse: commentCollapsed => dispatch(commentActions.toggleCollapse(commentId, !commentCollapsed)),
});


function determineAuthorType(comment, user, op) {
  if (comment.distinguished) {
    return comment.distinguished;
  } else if (user && user.name === comment.author) {
    return 'self';
  } else if (comment.author === op) {
    return 'op';
  }

  return '';
}


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { comment, user, commentCollapsed } = stateProps;
  const isCollapsible = !ownProps.preview && !ownProps.isUserActivityPage;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    commentCollapsed: isCollapsible && stateProps.commentCollapsed,
    isTopLevel: isCollapsible && ownProps.nestingLevel === 0,
    authorType: determineAuthorType(comment, user, ownProps.op),
    onLoadMore: () => dispatchProps.onLoadMore(comment),
    onToggleCollapse: () => {
      if (isCollapsible) {
        dispatchProps.onToggleCollapse(commentCollapsed);
      }
    },
  };
};

export default connect(selector, mapDispatchToProps, mergeProps)(Comment);
