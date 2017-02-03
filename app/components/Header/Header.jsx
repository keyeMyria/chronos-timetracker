import React, { PropTypes } from 'react';

import Avatar from '../Avatar/Avatar';
import ProjectPickerWrapper from '../../containers/ProjectPickerWrapper';
import Flex from '../Base/Flex/Flex';

const Header = ({ avatarUrls, username, logout, screenshotsEnabled }) =>
  <Flex column className="header">
    <Flex row>
      <Avatar avatarUrls={avatarUrls} />
      <Flex column centered>
        <span className="username">
          {username}
        </span>
        <a title={`screenshots ${screenshotsEnabled ? 'enabled' : 'disabled'}`}>
          <span
            className={`fa fa-camera ${screenshotsEnabled ? 'enabled' : 'disabled'}`}
          />
          {!screenshotsEnabled &&
            <span className="intersect" />
          }
        </a>
        <a title="logout">
          <span
            className="fa fa-sign-out" onClick={logout}
          />
        </a>
      </Flex>
    </Flex>
    <ProjectPickerWrapper />
  </Flex>;

Header.propTypes = {
  avatarUrls: PropTypes.object,
  screenshotsEnabled: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;