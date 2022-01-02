import * as React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

const stories = require('../temp.json');

import StoryCard from './StoryCard';

import firebase from 'firebase';
import db from '../config';

export default class StoryFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: true,
      stories: [],
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

   fetchStories = async() =>{
    console.log("hi")
    await db.ref("posts/").on("value",data => {
      let stories = [];
      let details = data.val();
      if(details){
        Object.keys(details).forEach(function(key){
          stories.push({
            key : key,
            value : details[key]
          })
        })
        
      }
      this.setState({stories : stories});
      //console.log(this.state.stories)
      
    },function(error){
      console.log("Read failed "+error.code)
    })
  }

  componentDidMount() {
    this.fetchTheme();
    this.fetchStories();
  }

  renderItem = ({ item: story }) => {
 //   console.log(story);
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };
  render() {
    const {stories} = this.state;
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
                resizeMode: 'contain',
                marginLeft: 10,
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
              Story Telling App
            </Text>
          </View>
        </View>
         {!this.state.stories[0] ? (
            <View style={styles.noStories}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.noStoriesTextLight
                    : styles.noStoriesText
                }
              >
                No Stories Available
              </Text>
            </View>
          ) :
       (<View style={styles.cardContainer}>
          <FlatList
            keyExtractor={(item, index) => item.key}
            renderItem={this.renderItem}
            data={stories}
          />
        </View>)}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(0),
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(0),
  },
  titleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
    paddingLeft: RFValue(20),
  },
  titleContainer: {
    flex: 0.07,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  cardContainer: {
    flex: 0.85,
  },
  noStories: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  noStoriesTextLight: {
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  noStoriesText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  }
});
