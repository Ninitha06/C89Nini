import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';
import db from '../config';

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: true,
      story_id: this.props.story.key,
      story_data: this.props.story.value,
      is_liked: false,
      likes: this.props.story.value.likes,
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

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref('posts' )
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: this.state.likes - 1, is_liked: false });
    } else {
      firebase
        .database()
        .ref('posts')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: this.state.likes + 1, is_liked: true });
    }
  };

  componentDidMount() {
    this.fetchTheme();

       
  }
  render() {
    let story = this.state.story_data;
    let images = {
      image_1: require('../images/story_image_1.png'),
      image_2: require('../images/story_image_2.png'),
      image_3: require('../images/story_image_3.png'),
      image_4: require('../images/story_image_4.png'),
      image_5: require('../images/story_image_5.png'),
    };
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('StoryScreen', {
            story: story,
            likes : this.state.likes,
            is_liked : this.state.is_liked,
            story_id : this.state.story_id
          })
        }>
        <View
          style={
            this.state.lightTheme == true
              ? styles.storyContainerLight
              : styles.storyContainer
          }>
          <Image
            source={images[story.preview_image]}
            style={styles.storyImage}
          />
          <View style={styles.titleContainer}>
            <Text
              style={
                this.state.lightTheme == true
                  ? styles.titleTextLight
                  : styles.titleText
              }>
              {story.title}
            </Text>
            <Text
              style={
                this.state.lightTheme == true
                  ? styles.authorTextLight
                  : styles.authorText
              }>
              {story.author}
            </Text>
            <Text
              style={
                this.state.lightTheme == true
                  ? styles.descriptionLight
                  : styles.description
              }>
              {story.description}
            </Text>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={
                this.state.is_liked
                  ? styles.likeButtonLiked
                  : styles.likeButtonDisliked
              }
              onPress={() => this.likeAction()}>
              <Ionicons
                name="heart"
                color={this.state.lightTheme == true ? 'black' : 'white'}
                size={RFValue(30)}
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
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  storyContainer: {
    backgroundColor: '#2f345d',
    borderRadius: RFValue(20),
    margin: RFValue(10),
  },
  storyContainerLight: {
    backgroundColor: 'white',
    borderRadius: RFValue(20),
    margin: RFValue(10),
  },
  storyImage: {
    width: '95%',
    height: RFValue(250),
    borderRadius: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'white',
  },
  titleTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'black',
  },
  authorText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'white',
  },
  authorTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'black',
  },
  description: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(10),
    color: 'white',
  },
  descriptionLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(10),
    color: 'black',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',   
    flexDirection: 'row',
    borderColor: '#eb3948',
    borderWidth: 2,
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    marginLeft: RFValue(5),
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginTop: 6,
  },
  likeTextLight: {
    marginLeft: RFValue(5),
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginTop: 6,
    color: 'black',
  },
});
