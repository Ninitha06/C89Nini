import * as React from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import db from '../config';
import firebase from 'firebase';

import * as Google from 'expo-google-app-auth';

import { RFValue } from 'react-native-responsive-fontsize';

export default class LoginScreen extends React.Component {
  onSignIn = async(googleUser) => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
  
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        //Ninitha - this credential part has changes.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        //this part is additional where we create entry in firebase - Ninitha
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(async(result) => {
            if (result.additionalUserInfo.isNewUser) {
              await db.ref('users/' + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: 'dark',
                })
            }
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      }
    });
  };

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };
  
  signInWithGoogleAsync = async () => {
    try {
        const result = await Google.logInAsync({
        behaviour: 'web',
        androidClientId:
          '593654992946-fcq0cnmpc2glhh1r5t4kbbsg4ag318e8.apps.googleusercontent.com',
        iosClientId:
          '593654992946-fvorju6kkbgspafmbpc97gh4n0sui6j4.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Image source={require('../images/logo.png')} style={styles.icon} />
          <Text style={styles.titleText}>{'StoryTelling\nApp'}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.signInWithGoogleAsync()}
            style={styles.button}>
            <Image
              source={require('../images/google_icon.png')}
              style={styles.gicon}
            />
            <Text style={styles.gText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cloudContainer}>
          <Image
            source={require('../images/cloud.png')}
            style={styles.cloudImg}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: 'contain',
  },
  titleText: {
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    textAlign: 'center',
  },
  gicon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: 'contain',
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: RFValue(250),
    height: RFValue(50),
    borderRadius: RFValue(30),
  },
  gText: {
    fontSize: RFValue(20),
    fontFamily: 'Bubblegum-Sans',
    color: 'black',
  },
  cloudContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
  },
  cloudImg: {
    position: 'absolute',
    bottom: RFValue(-5),
    // height : 90,
    width: '100%',
    resizeMode: 'contain',
  },
});
