import {
  AppRegistry
} from 'react-native';

import { StackNavigator } from 'react-navigation'

import App from './app/app'
import Upload from './app/Upload'

const Navigation = StackNavigator({
  App: { screen: App },
    Upload: {screen: Upload},
});

AppRegistry.registerComponent('rncameraroll', () => Navigation);
