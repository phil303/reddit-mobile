import React from 'react';

import take from 'lodash/array/take';
import filter from 'lodash/collection/filter';

import formatNumber from '../../../lib/formatNumber';
import mobilify from '../../../lib/mobilify';
import NSFWFlair from '../NSFWFlair';

import BaseComponent from '../BaseComponent';
import Loading from '../Loading';
import PostContent from './PostContent';
import { cleanPostHREF } from './postUtils';

const T = React.PropTypes;

const NUM_LINKS = 3;

export default class RelevantContent extends BaseComponent {
  static propTypes = {
    feature: T.object.isRequired,
    relevant: T.object.isRequired,
    isSelfText: T.bool.isRequired,
    width: T.number.isRequired,
    subredditName: T.string,
    subreddit: T.object,
    listingId: T.string
  };

  constructor(props) {
    super(props);

    this.renderPostList = this.renderPostList.bind(this);
    this.goToSubreddit = this.goToSubreddit.bind(this);
    this.goToPost = this.goToPost.bind(this);
  }

  goToSubreddit(e, { url, id, name, linkName, linkIndex }) {
    e.preventDefault();
    const { app, isSelfText } = this.props;
    // Send event
    app.emit('click:experiment', {
      experimentName: 'relevancy_mweb',
      linkIndex,
      linkName,
      refererPageType: isSelfText ? 'self' : 'link',
      refererUrl: window.location.href,
      targetFullname: id,
      targetUrl: url,
      targetName: name,
      targetType: 'subreddit'
    });

    app.redirect(url);
  }

  goToPost(e, url, id, linkIndex) {
    e.preventDefault();
    const { app, isSelfText } = this.props;
    // Send event
    app.emit('click:experiment', {
      experimentName: 'relevancy_mweb',
      linkIndex,
      linkName: `top post ${linkIndex}`,
      refererPageType: isSelfText ? 'self' : 'link',
      refererUrl: window.location.href,
      targetFullname: id,
      targetUrl: url,
      targetType: 'link'
    });

    app.redirect(url);
  }

  renderPostList(posts) {
    const { width } = this.props;

    return posts.map((post, i) => {
      const linkExternally = post.disable_comments;
      const url = cleanPostHREF(mobilify(linkExternally ? post.url : post.cleanPermalink));
      const { id, title, name } = post;
      // Make sure we always have an image to show
      // Link to the comment thread instead of external content
      const postWithFallback = {
        preview: {},
        ...post,
        thumbnail: post.thumbnail || '/img/placeholder-thumbnail.svg',
        cleanUrl: '#'
      };
      return (
        <article ref='rootNode' className='Post' key={ id }>
          <div className='Post__header-wrapper' onClick={ e => this.goToPost(e, url, name, i + 1) }>
            <PostContent
              post={ postWithFallback }
              single={ false }
              compact={ true }
              expandedCompact={ false }
              onTapExpand={ false }
              width={ width }
              toggleShowNSFW={ false }
              showNSFW={ false }
              editing={ false }
              toggleEditing={ false }
              saveUpdatedText={ false }
              forceHTTPS={ this.forceHTTPS }
              isDomainExternal={ this.externalDomain }
              renderMediaFullbleed={ true }
              showLinksInNewTab={ false }
            />
            <header className='PostHeader size-compact m-thumbnail-margin'>
              <div className='PostHeader__post-descriptor-line-overflow'>
              <a
                className={ `PostHeader__post-title-line-blue ${post.visited ? 'm-visited' : ''}` }
                href='#'
                onClick={ e => this.goToPost(e, url, name, i + 1) }
                target={ linkExternally ? '_blank' : null }>
                { title }
              </a></div>
              <a
                className='PostHeader__post-title-line'
                href='#'
                onClick={ e => this.goToPost(e, url, name, i + 1) }
                target={ linkExternally ? '_blank' : null }>
                { post.ups } upvotes in r/{ post.subreddit }
              </a>
            </header>
          </div>
        </article>
    )});
  }

  render() {
    const {
      feature,
      relevant,
      width,
      subredditName,
      subreddit,
      listingId
    } = this.props;

    if (feature.enabled('experimentRelevancyTop')) {
      // Show top posts from this subreddit
      const topLinks = relevant.topLinks;
      const predicate = (link =>
          !link.over_18 &&
          link.id !== listingId &&
          !link.stickied);
      let links = take(filter(topLinks, predicate), NUM_LINKS);
      let postList = this.renderPostList(links);
      return (
        <div className='RelevantContent container' key='relevant-container'>
          <div className='RelevantContent-header'>
            <span className='RelevantContent-row-spacer'>
              <span className='RelevantContent-icon icon-bar-chart orangered-circled'></span>
            </span>
            <span className='RelevantContent-row-text'>Top Posts in r/{ subredditName }</span>
          </div>
          { postList }
          <a
            className='RelevantContent-action'
            href='#'
            onClick={ e => this.goToSubreddit(e, {
              url: subreddit.url,
              id: subreddit.name,
              name: subreddit.title,
              linkName: 'top 25 posts',
              linkIndex: NUM_LINKS + 1
            }) }>
              See top 25 Posts
          </a>
        </div>
      );
    }

    if (feature.enabled('experimentRelevancyRelated') ||
        feature.enabled('experimentRelevancyEngaging')) {
      // Show related or popular/engaging subreddits
      const communities = relevant.communities;

      let relevanceTitle = 'Popular Communities';
      let demonym = 'users';
      let icon = 'snoo';
      let iconColor = 'orangered-circled'; 
      let linkType = 'engaging';
      if (feature.enabled('experimentRelevancyRelated')) {
        relevanceTitle = 'Gaming Communities';
        demonym = 'gamers';
        icon = 'gaming';
        iconColor = 'mint-circled'; 
        linkType = 'related';
      }

      return (
        <div className='RelevantContent container' key='relevant-container'>
          <div className='RelevantContent-header'>
            <span className='RelevantContent-row-spacer'>
              <span className={ `RelevantContent-icon icon-${icon} ${iconColor}` }></span>
            </span>
            <span className='RelevantContent-row-text'>{ relevanceTitle }</span>
          </div>
          { communities.map((c, i) => {
              const clickData = {
                url: c.url,
                id: c.name,
                name: c.title,
                linkName: `${linkType} subreddit ${i + 1}`,
                linkIndex: i + 1
              };
              return (
                <div className='SearchPage__community' key={ c.id }>
                  <div className='CommunityRow'>
                    <a className='CommunityRow__icon' href='#' onClick={ e => this.goToSubreddit(e, clickData) }>
                      { c.icon_img
                        ? <img className='CommunityRow__iconImg' src={ c.icon_img }/>
                        : <div className='CommunityRow__iconBlank'/> }
                    </a>
                    <a className='CommunityRow__details' href='#' onClick={ e => this.goToSubreddit(e, clickData) }>
                      <div className='CommunityRow__name'>
                        The { c.display_name } Community
                      </div>
                      <div className='CommunityRow__counts'>
                        Join { formatNumber(c.subscribers) } r/{c.display_name} { demonym }
                      </div>
                      <div>
                        Visit this community
                      </div>
                    </a>
                  </div>
                </div>);
              }) }
        </div>
      );
    }

    return null;
  }
}
