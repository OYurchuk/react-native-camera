import React from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Button,
  CameraRoll,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native'

import ActionButton from 'react-native-action-button';
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';



const { width } = Dimensions.get('window');

class App extends React.Component {
  static navigationOptions = {
    title: 'App',
      tintColor: "#bbb"
  };



  state = {
    modalVisible: false,
    photos: [],
    index: null
  };

  setIndex = (index) => {
    if (index === this.state.index) {
      index = null
    }
    this.setState({ index })
  };

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All',
    })
    .then(r => this.setState({ photos: r.edges }))
  };

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  avatar = () =>{
      const { navigate } = this.props.navigation;
      navigate('Upload')
  };

  share = () => {
    const image = this.state.photos[this.state.index].node.image.uri;
    RNFetchBlob.fs.readFile(image, 'base64')
    .then((data) => {
      let shareOptions = {
        title: "React Native Share",
        message: "Check out this photo!",
        url: `data:image/jpg;base64,${data}`,
        subject: "Check out this photo!"
      };

      Share.open(shareOptions)
        .then((res) => console.log('res:', res))
        .catch(err => console.log('err', err))
    })
  };

    addPhoto() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source, temp;
                // You can display the image using either:
                //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                temp = response.data;

                //Or:
                // if (Platform.OS === 'android') {
                //   source = {uri: response.uri, isStatic: true};
                // } else {
                source = {uri: response.uri.replace('file://', ''), isStatic: true};
                // }

                this.setState({
                    avatarSource: source,
                    imgBase64: temp,
                });
            }
        });
    }


  render() {
    // console.log('state :', this.state);

    return (
      <View style={styles.container}>
        <Button
          title='View Photos'
          onPress={() => { this.toggleModal(); this.getPhotos() }}
        />

        <Button
            title='Update avatar & login'
            onPress={this.avatar}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('closed')}
        >
          <View style={styles.modalContainer}>
            <Button
              title='Close'
              onPress={this.toggleModal}
            />
            <ScrollView
              contentContainerStyle={styles.scrollView}>
              {
                this.state.photos.map((p, i) => {
                  return (
                    <TouchableHighlight
                      style={{opacity: i === this.state.index ? 0.5 : 1}}
                      key={i}
                      underlayColor='transparent'
                      onPress={() => this.setIndex(i)}
                    >
                      <Image
                        style={{
                          width: width/2,
                          height: width/2
                        }}
                        source={{uri: p.node.image.uri}}
                      />

                    </TouchableHighlight>
                  )
                })
              }
            </ScrollView>
            {
              this.state.index !== null  && (
                <View style={styles.shareButton}>
                  <Button
                      title='Share'
                      onPress={this.share}
                    />

                </View>
              )
            }

              <ActionButton
                  buttonColor="#3498db"
                  onPress={this.addPhoto}
                     />



          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  shareButton: {
    position: 'absolute',
    width,
    padding: 10,
    bottom: 0,
    left: 0
  }
});

export default App