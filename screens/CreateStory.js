import * as React from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  Button,
  Alert,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

import DropDownPicker from 'react-native-dropdown-picker';

import firebase from 'firebase';
import db from '../config';

export default class CreateStory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: 'image_1',
      dropDownHeight: 40,
      lightTheme: true,
      title: '',
      description: '',
      story: '',
      moral: '',
    };
  }

  addStory = async () => {
    if (
      this.state.story &&
      this.state.description &&
      this.state.title &&
      this.state.moral
    ) {
      let story_data = {
        preview_image: this.state.previewImage,
        title: this.state.title,
        description: this.state.description,
        story: this.state.story,
        moral: this.state.moral,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        likes: 0,
      };
      await db
        .ref('posts/' + Math.random().toString(36).slice(2))
        .set(story_data);

      this.props.navigation.navigate('Feed');
    } else {
      Alert.alert('Error', 'All the fields are required', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

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

    this._unsubscribe = this.props.navigation.addListener('tabPress', () => {
      console.log('Am getting called');
      this.setState({
        title: '',
        description: '',
        story: '',
        moral: '',
        previewImage: 'image_1',
      });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    console.log('Code updated');
    let preview_images = {
      image_1: require('../images/story_image_1.png'),
      image_2: require('../images/story_image_2.png'),
      image_3: require('../images/story_image_3.png'),
      image_4: require('../images/story_image_4.png'),
      image_5: require('../images/story_image_5.png'),
    };
    return (
      <SafeAreaView
        style={
          this.state.lightTheme == true
            ? styles.containerLight
            : styles.container
        }>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../images/logo.png')}
              style={{
                height: 60,
                width: 60,
                marginLeft: 10,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View style={styles.titleTextContainer}>
            <Text
              style={
                this.state.lightTheme == true
                  ? styles.titleTextLight
                  : styles.titleText
              }>
              New Story
            </Text>
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <ScrollView>
            <Image
              source={preview_images[this.state.previewImage]}
              style={styles.previewImage}
            />
            <View
              style={{ height: this.state.dropDownHeight, marginBottom: 10 }}>
              {/* Package version shld be ^4.0.4 to support all styles */}
              <DropDownPicker
                items={[
                  { label: 'Image1', value: 'image_1' },
                  { label: 'Image2', value: 'image_2' },
                  { label: 'Image3', value: 'image_3' },
                  { label: 'Image4', value: 'image_4' },
                  { label: 'Image5', value: 'image_5' },
                ]}
                defaultValue={this.state.previewImage}
                containerStyle={{
                  height: 40,
                  borderRadius: 20,
                  marginLeft: 10,
                  marginRight: 10,
                }}
                onOpen={() => this.setState({ dropDownHeight: 170 })}
                onClose={() => this.setState({ dropDownHeight: 40 })}
                style={{ backgroundColor: 'transparent' }}
                itemStyle={{ justifyContent: 'flex-start' }}
                dropDownStyle={{
                  backgroundColor:
                    this.state.lightTheme == true ? 'white' : '#2f345d',
                }}
                labelStyle={{
                  color: this.state.lightTheme == true ? 'black' : 'white',
                  fontFamily: 'Bubblegum-Sans',
                }}
                arrowColor={this.state.lightTheme == true ? 'black' : 'white'}
                onChangeItem={(item) => {
                  this.setState({ previewImage: item.value });
                }}
              />
            </View>

            <TextInput
              onChangeText={(title) => this.setState({ title: title })}
              placeholder={'Title'}
              placeholderTextColor={
                this.state.lightTheme == true ? 'black' : 'white'
              }
              style={
                this.state.lightTheme == true
                  ? styles.inputFontLight
                  : styles.inputFont
              }
              value={this.state.title}
            />
            <TextInput
              onChangeText={(description) =>
                this.setState({ description: description })
              }
              placeholder={'Description'}
              placeholderTextColor={
                this.state.lightTheme == true ? 'black' : 'white'
              }
              style={[
                this.state.lightTheme == true
                  ? styles.inputFontLight
                  : styles.inputFont,
                styles.extraAlign,
              ]}
              numberOfLines={4}
              multiline={true}
              value={this.state.description}
            />
            <TextInput
              onChangeText={(story) => this.setState({ story: story })}
              placeholder={'Story'}
              placeholderTextColor={
                this.state.lightTheme == true ? 'black' : 'white'
              }
              style={[
                this.state.lightTheme == true
                  ? styles.inputFontLight
                  : styles.inputFont,
                styles.extraAlign,
              ]}
              numberOfLines={20}
              multiline={true}
              value={this.state.story}
            />
            <TextInput
              onChangeText={(moral) => this.setState({ moral: moral })}
              placeholder={'Moral of the story'}
              placeholderTextColor={
                this.state.lightTheme == true ? 'black' : 'white'
              }
              style={[
                this.state.lightTheme == true
                  ? styles.inputFontLight
                  : styles.inputFont,
                styles.extraAlign,
              ]}
              numberOfLines={4}
              multiline={true}
              value={this.state.moral}
            />
            <View style={styles.submitButton}>
              <Button
                color="#841584"
                title="Submit"
                onPress={() => this.addStory()}
              />
            </View>
          </ScrollView>
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
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    flex: 0.07,
  },
  iconContainer: {
    flex: 0.2,
  },
  titleTextContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  titleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  previewImage: {
    width: '93%',
    height: RFValue(250),
    resizeMode: 'contain',
    marginVertical: RFValue(10),
    borderRadius: RFValue(10),
    alignSelf: 'center',
  },
  inputFont: {
    color: 'white',
    borderRadius: RFValue(10),
    borderColor: 'white',
    borderWidth: RFValue(1),
    paddingLeft: RFValue(20),
    margin: RFValue(10),
    // height: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
  },
  inputFontLight: {
    color: 'black',
    borderRadius: RFValue(10),
    borderColor: 'black',
    borderWidth: RFValue(1),
    paddingLeft: RFValue(20),
    margin: RFValue(10),
    // height: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
  },
  extraAlign: {
    marginTop: RFValue(10),
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  fieldContainer: {
    flex: 0.85,
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
