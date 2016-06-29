import CommentsPageHandler from './handlers/CommentsPage';
import CommunityGotoActionHandler from './handlers/CommunityGotoAction';
import PostsFromSubredditHandler from './handlers/PostsFromSubreddit';
import Login from './handlers/Login';
import OverlayMenuCompactToggleHandler from './handlers/OverlayMenuCompactToggle';
import OverlayMenuThemeToggleHandler from './handlers/OverlayMenuThemeToggle';
import SavedAndHiddenHandler from './handlers/SavedAndHidden';
import SearchPageHandler from './handlers/SearchPage';
import SubredditAboutPageHandler from './handlers/SubredditAboutPage';
import ToggleSubredditSubscriptionHandler from './handlers/ToggleSubredditSubscription';
import UserActivityHandler from './handlers/UserActivity';
import UserProfilerHandler from './handlers/UserProfile';
import DirectMessage from './handlers/DirectMessage';
import Messages from './handlers/Messages';
import Vote from './handlers/Vote';
import WikiPageHandler from './handlers/WikiPage';
import { PostSubmitHandler, PostSubmitCommunityHandler } from './handlers/PostSubmit';

export default [
  ['/', PostsFromSubredditHandler],
  ['/r/:subredditName', PostsFromSubredditHandler],
  ['/u/:user/m/:multi', PostsFromSubredditHandler],
  ['/r/:subredditName/comments/:postId/comment/:commentId', CommentsPageHandler],
  ['/r/:subredditName/comments/:postId/:postTitle/:commentId', CommentsPageHandler],
  ['/r/:subredditName/comments/:postId/:postTitle?', CommentsPageHandler],
  ['/search', SearchPageHandler],
  ['/r/:subredditName/search', SearchPageHandler],
  ['/r/:subredditName/about', SubredditAboutPageHandler],
  ['/r/:subredditName/(w|wiki)/:path(.*)?', WikiPageHandler],
  ['/(help|w|wiki)/:path(.*)?', WikiPageHandler],
  ['/comments/:postId/:postTitle?', CommentsPageHandler],
  ['/comments', CommentsPageHandler],
  ['/u/:userName/activity', UserActivityHandler],
  ['/u/:userName/gild', UserProfilerHandler],
  ['/u/:userName/:savedOrHidden(saved|hidden)', SavedAndHiddenHandler],
  ['/u/:userName', UserProfilerHandler],
  ['/login', Login],
  ['/message/compose', DirectMessage],
  ['/message/:mailType', Messages],
  ['/submit', PostSubmitHandler],
  ['/submit/to_community', PostSubmitCommunityHandler],

  // actions
  ['/vote/:thingId', Vote],
  ['/actions/community-goto', CommunityGotoActionHandler],
  ['/actions/overlay-compact-toggle', OverlayMenuCompactToggleHandler],
  ['/actions/overlay-theme-toggle', OverlayMenuThemeToggleHandler],
  ['/actions/toggle-subreddit-subscription', ToggleSubredditSubscriptionHandler],
];
