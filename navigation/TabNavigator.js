import * as React from 'react';

import { StyleSheet } from 'react-native';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CreateStory from '../screens/CreateStory';
import StoryFeed from '../screens/StoryFeed';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { RFValue } from 'react-native-responsive-fontsize';

import firebase from 'firebase';

import db from '../config';

const Tab = createMaterialBottomTabNavigator();
export default class TabNavigator extends React.Component {
   constructor() {
    super();
    this.state = {
      lightTheme: true,
    };
  }

  fetchTheme = async () => {
    let theme;
    await db
      .ref('users/' + firebase.auth().currentUser.uid)
      .on('value', (data) => {
        theme = data.val().current_theme;
        this.setState({
          lightTheme: theme === 'light' ? true : false,
        });
      });
  };

  componentDidMount() {
    this.fetchTheme();
  }

  render(){
  return (
    <Tab.Navigator
      labeled={false}
      barStyle={this.state.lightTheme
            ? styles.tabBarLight
            : styles.tabBar}
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Feed') {
              iconName = focused ? 'home' : 'home-outline';
            }
            if (route.name === 'Create') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }

            return (
              <Ionicons
                name={iconName}
                size={30}
                color={color}
                style={styles.icons}
              />
            );
          },
          headerShown: false,
        };
      }}
      activeColor="#ee8249"
      inactiveColor="grey">
      <Tab.Screen name="Feed" component={StoryFeed}/>
      <Tab.Screen name="Create" component={CreateStory}/>
    </Tab.Navigator>
  );
  }
};


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#2f345d',
    borderTopLeftRadius: RFValue(30),
    borderTopRightRadius: RFValue(30),
    height: '8%',
    overflow: 'hidden', //to cause rounding corners
    position: 'absolute', //Required to make sure it does not have white background near rounded corners
  },
  tabBarLight: {
    backgroundColor: "#eaeaea",
    height: "8%",
    borderTopLeftRadius: RFValue(30),
    borderTopRightRadius: RFValue(30),
    overflow: "hidden",
    position: "absolute"
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30),
  },
});
