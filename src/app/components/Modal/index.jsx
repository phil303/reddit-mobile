import React from 'react';
import { Anchor } from '@r/platform/components';

import './styles.less';

const T = React.PropTypes;

export const BUTTON = 'BUTTON';

const Modal = props => {
  return (
    <div className='Modal'>
      <div className='Modal__menubar'>
        <Anchor href={ props.exitTo } className='Modal__menubar-close'>
          <span className='icon icon-nav-close icon-large'></span>
        </Anchor>
        <span className='Modal__menubar-text'>{ props.titleText }</span>
        <div className='Modal__menubar-action'>
          { chooseHeaderAction(props) }
        </div>
      </div>
      <div className='Modal__body'>
        { props.children }
      </div>
    </div>
  );
};

const chooseHeaderAction = props => {
  switch (props.action) {
    case BUTTON:
      return renderModalButton(props.buttonText, props.isReady);
    default:
      return null;
  }
}

const renderModalButton = (text, isReady) => {
  let className = 'Modal__menubar-button';
  if (isReady) {
    className += ' ready';
  }
  return <div className={ className }>{ text }</div>;
};


Modal.propTypes = {
  action: T.oneOf([BUTTON]),
  exitTo: T.string,
  titleText: T.string,
  buttonText: T.string,
};

Modal.defaultProps = {
  type: '',
  exitTo: '',
  titleText: '',
  buttonText: '',
};

export default Modal;
