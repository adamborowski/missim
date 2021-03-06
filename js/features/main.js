/**
 *  Entrance of features
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */
'use strict';
import about from './about/main';
import common from './common/main';
import home from './home/main';

export default [about, ...common, home];
