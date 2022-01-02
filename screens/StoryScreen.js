import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

import * as Speech from 'expo-speech';

import firebase from 'firebase';
import db from '../config';

export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakerColor: 'gray',
      speakerIcon: 'volume-high-outline',
      lightTheme: true,
      is_liked: this.props.route.params.is_liked,
      likes: this.props.route.params.likes,
    };
  }

  likeAction = () => {
    if (this.state.is_liked) {
     db.ref('posts')
        .child(this.props.route.params.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: this.state.likes - 1, is_liked: false });
    } else {
        db.ref('posts')
        .child(this.props.route.params.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: this.state.likes + 1, is_liked: true });
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
  }

  initiateTTS = async (title, author, story, moral) => {
    const current_icon = this.state.speakerIcon;
    this.setState({
      speakerIcon:
        current_icon === 'volume-high-outline'
          ? 'volume-high'
          : 'volume-high-outline',
    });
    const current_color = this.state.speakerColor;
    this.setState({
      speakerColor: current_color === 'gray' ? '#ee8249' : 'gray',
    });

    if (current_color === 'gray') {
      Speech.speak(`${title} by ${author}`);
      Speech.speak(story);
      Speech.speak(`Moral of the story is ${moral}`);
    } else {
      Speech.stop();
    }
  };

  componentWillUnmount() {
    Speech.stop();
  }

  render() {
    let images = {
      image_1: require('../images/story_image_1.png'),
      image_2: require('../images/story_image_2.png'),
      image_3: require('../images/story_image_3.png'),
      image_4: require('../images/story_image_4.png'),
      image_5: require('../images/story_image_5.png'),
    };
    if (!this.props.route.params) {
      this.props.navigation.navigate('Home');
    } else {
      return (
        <SafeAreaView
          style={
            this.state.lightTheme == true
              ? styles.containerLight
              : styles.container
          }>
          <View style={styles.titleContainer}>
            <View style={styles.appIcon}>
              <Image
                source={require('../images/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.lightTheme == true
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                Storytelling App
              </Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView
              style={
                this.state.lightTheme == true
                  ? styles.storyCardLight
                  : styles.storyCard
              }>
              <Image
                source={images[this.props.route.params.story.preview_image]}
                style={styles.image}></Image>

              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text
                    style={
                      this.state.lightTheme == true
                        ? styles.storyTitleTextLight
                        : styles.storyTitleText
                    }>
                    {this.props.route.params.story.title}
                  </Text>
                  <Text
                    style={
                      this.state.lightTheme == true
                        ? styles.storyAuthorTextLight
                        : styles.storyAuthorText
                    }>
                    {this.props.route.params.story.author}
                  </Text>
                  <Text
                    style={
                      this.state.lightTheme == true
                        ? styles.storyAuthorTextLight
                        : styles.storyAuthorText
                    }>
                    {this.props.route.params.story.created_on}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      this.initiateTTS(
                        this.props.route.params.story.title,
                        this.props.route.params.story.author,
                        this.props.route.params.story.story,
                        this.props.route.params.story.moral
                      )
                    }>
                    <Ionicons
                      name={this.state.speakerIcon}
                      color={this.state.speakerColor}
                      size={RFValue(30)}
                      style={{ margin: RFValue(15) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text
                  style={
                    this.state.lightTheme == true
                      ? styles.storyTextLight
                      : styles.storyText
                  }>
                  {this.props.route.params.story.story}
                </Text>
                <Text
                  style={
                    this.state.lightTheme == true
                      ? styles.moralTextLight
                      : styles.moralText
                  }>
                  Moral - {this.props.route.params.story.moral}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={
                    this.state.is_liked
                      ? styles.likeButtonLiked
                      : styles.likeButtonDisliked
                  }
                  onPress={() => {
                    this.likeAction();
                  }}>
                  <Ionicons
                    name={'heart'}
                    size={RFValue(30)}
                    color={this.state.lightTheme == true ? 'black' : 'white'}
                  />
                  <Text
                    style={
                      this.state.lightTheme == true
                        ? styles.likeTextLight
                        : styles.likeText
                    }>
                    {this.state.likes}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
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
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  storyContainer: {
    flex: 1,
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: '#2f345d',
    borderRadius: RFValue(20),
  },
  image: {
    width: '100%',
    alignSelf: 'center',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: 'contain',
  },
  dataContainer: {
    flexDirection: 'row',
    padding: RFValue(20),
  },
  titleTextContainer: {
    flex: 0.8,
  },
  storyTitleText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'white',
  },
  storyAuthorText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'white',
  },
  iconContainer: {
    flex: 0.2,
  },
  storyTextContainer: {
    padding: RFValue(20),
  },
  storyText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(15),
    color: 'white',
  },
  moralText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(20),
    color: 'white',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: RFValue(10),
  },
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(30),
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: 'row',
    borderColor: '#eb3948',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  likeTextLight: {
    color: 'black',
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  storyTitleTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'black',
  },
  storyAuthorTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'black',
  },
  storyTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(15),
    color: 'black',
  },
  moralTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(20),
    color: 'black',
  },
});
