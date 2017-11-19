import React ,{Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
    CameraRoll,
    TextInput,
    Button,
    KeyboardAvoidingView

} from 'react-native'
import ImagePicker from 'react-native-image-picker';

import { TextInputMask } from 'react-native-masked-text';


let FileUpload = require('NativeModules').FileUpload;

export default class Upload extends Component {
    static navigationOptions = {
        title: 'My Profile',
    };
  constructor(props){
    super(props);

    this.state = {
      avatarSource: null,
      imgBase64: '',
    };

  }


  selectPhotoTapped() {
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
      else {
        let source, temp;
        temp = response.data;
        source = {uri: response.uri.replace('file://', ''), isStatic: true};

        this.setState({
          avatarSource: source,
          imgBase64: temp,
        });
      }
    });
  }

  upload(){
    console.log("click");
    let obj = {
        uploadUrl: 'http://pttkht.esy.es/uphinhanh.php',
        method: 'POST', // default 'POST',support 'POST' and 'PUT'
        headers: {
          'Accept': 'application/json',
        },
        fields: {
          'img': this.state.imgBase64,
        },
        files: [

        ]

    };
    FileUpload.upload(obj, function(err, result) {
      console.log('upload:', err, result);
      if (err === null){
        Alert.alert(
          'Thong Bao',
          'Upload thanh cong',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]
        )
      }else{
        Alert.alert(
          'Thong Bao',
          err,
          [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        )
      }

    })
  }



    //
    // updateText(){
    //     this.setState({myText: 'My Changed Text'})
    //
    //
    // }


  render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.avatar} source={this.state.avatarSource} />
            }
            </View>
          </TouchableOpacity>

          {/*<TouchableOpacity>*/}
            {/*<TextInput onChangeText={(text) => this.setState({text})}*/}
                       {/*value={this.state.text}/>*/}

            {/*<Text> </Text>*/}
          {/*</TouchableOpacity>*/}


          <Text style={styles.titleUsername} >User name: {this.state.text}</Text>

          <KeyboardAvoidingView>

          <TextInput
              style={styles.username}
              placeholder="New Login"
              onChangeText={(typedText) => {
                  this.setState({text: typedText});
              }
              }
              value={this.state.text}
          />

              <Button title="Save"/>

          </KeyboardAvoidingView>


        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  avatarContainer: {
    marginTop: 30,
    borderColor: '#3498db',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 90,
      borderWidth: 1,
      width: 180,
      height: 180
  },

    titleUsername:{
      paddingTop: 30,
        paddingBottom: 30,

    },

    username:{
      paddingLeft: 10,
        fontSize: 15,
    borderWidth:1,
        height:30,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',

    }

});
