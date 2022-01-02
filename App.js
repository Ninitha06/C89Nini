import 'react-native-gesture-handler';
import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import DrawerNavigator from './navigation/DrawerNavigator';

import * as Font from 'expo-font';
import {AppLoading} from 'expo-app-loading';

import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';

const customFonts = {
  "Bubblegum-Sans" : require('./fonts/BubblegumSans-Regular.ttf')
}

const Stack = createStackNavigator();
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
    };
  }

  loadFonts = async () => {
    await Font.loadAsync(customFonts);
    this.setState({
      fontsLoaded: true,
    });
  };

  componentDidMount(){
    this.loadFonts();
  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Dashboard" component={DrawerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
}
