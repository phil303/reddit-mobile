import './styles.less';

import React from 'react';
import { connect } from 'react-redux';

import cx from 'lib/classNames';
import * as overlayMenuActions from 'app/actions/overlayMenu';

import {
  OVERLAY_MENU_CSS_CLASS,
  OVERLAY_MENU_CSS_TOP_NAV_MODIFIER,
} from 'app/constants';

const T = React.PropTypes;

const stopClickPropagation = (e) => {
  e.stopPropagation();
};

export const OverlayMenu = props => {
  const className = cx(OVERLAY_MENU_CSS_CLASS, {
    [OVERLAY_MENU_CSS_TOP_NAV_MODIFIER]: !props.fullscreen,
  });

  return (
    <nav className={ className } onClick={ props.closeOverlayMenu }>
      <ul className='OverlayMenu-ul list-unstyled' onClick={ stopClickPropagation }>
        { props.children }
      </ul>
    </nav>
  );
};

OverlayMenu.propTypes = {
  fullscreen: T.bool,
  closeOverlayMenu: T.func,
};

OverlayMenu.defaultProps = {
  fullscreen: false,
  closeOverlayMenu: () => {},
};

const mapDispatchProps = (dispatch) => ({
  closeOverlayMenu: () => dispatch(overlayMenuActions.closeOverlayMenu()),
});

export default connect(null, mapDispatchProps)(OverlayMenu);
