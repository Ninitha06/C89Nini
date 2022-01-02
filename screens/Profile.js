import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Switch,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import db from '../config';

import firebase from 'firebase';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      isEnabled: false,
      light_theme: true,
      profile_image: '',
      name: '',
    };
  }

  toggleSwitch = () => {
    var newState = this.state.light_theme ? 'dark' : 'light';
    console.log('Triggered ' + newState);
    db.ref('users/' + firebase.auth().currentUser.uid).update({
      current_theme: newState,
    });

    this.setState({
      light_theme: this.state.light_theme ? false : true,
      isEnabled: !this.state.isEnabled ? true : false,
    });
  };

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    let theme, name, image;
    await db
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (data) {
        theme = data.val().current_theme;
        name = `${data.val().first_name} ${data.val().last_name}`;
        image = data.val().profile_picture;
      });
    this.setState({
      light_theme: theme === 'light' ? true : false,
      isEnabled: theme === 'light' ? false : true,
      name: name,
      profile_image: image,
    });
  };

  render() {
    return (
      <SafeAreaView
        style={
          this.state.light_theme == true
            ? styles.containerLight
            : styles.container
        }>
        <View style={styles.appTitle}>
          <View style={styles.appIcon}>
            <Image
              source={require('../images/logo.png')}
              style={styles.iconImage}></Image>
          </View>
          <View style={styles.appTitleTextContainer}>
            <Text
              style={
                this.state.light_theme == true
                  ? styles.titleTextLight
                  : styles.titleText
              }>
              Storytelling App
            </Text>
          </View>
        </View>
        <View style={styles.screenContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: this.state.profile_image }}
              style={styles.profileImage}></Image>
            <Text
              style={
                this.state.light_theme == true
                  ? styles.nameTextLight
                  : styles.nameText
              }>
              {this.state.name}
            </Text>
          </View>
          <View style={styles.themeContainer}>
            <Text
              style={
                this.state.light_theme
                  ? styles.themeTextLight
                  : styles.themeText
              }>
              Dark Theme
            </Text>
            <Switch
              style={{
                transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
              }}
              trackColor={{
                false: '#767577',
                true: this.state.light_theme ? '#eee' : 'white',
              }}
              thumbColor={this.state.isEnabled ? '#ee8249' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch()}
              value={this.state.isEnabled}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  screenContainer: {
    flex: 0.93,
  },
  profileImageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70),
  },
  nameText: {
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    marginTop: RFValue(10),
  },
  themeContainer: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: RFValue(20),
  },
  themeText: {
    color: 'white',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
    marginRight: RFValue(15),
  },
  nameTextLight: {
    marginTop: RFValue(10),
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    color: 'black',
  },
  themeTextLight: {
    color: 'black',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
    marginRight: RFValue(15),
  },
  titleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
