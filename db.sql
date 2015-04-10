SET NAMES utf8;
SET time_zone = '+00:00';

CREATE TABLE `sessions` (
  `sid` varchar(32) NOT NULL,
  `uid` int(11) DEFAULT NULL,
  `oid` text NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` text,
  `openid` text,
  `email` text,
  `first_login` tinyint(1) NOT NULL,
  UNIQUE KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

