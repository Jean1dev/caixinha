import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
import api from '../../services/api'
import RNFS from 'react-native-fs'
import FIleViewer from 'react-native-file-viewer'

export default class Box extends Component {

  state = {
    box: {
      files: [
        {
          "_id": "5cb242552395654e5488ba49",
          "title": "IMG_0005.JPG",
          "path": "97eec3fb1e9f2842d45634ffe9d03759-IMG_0005.JPG",
          "createdAt": "2019-04-13T20:11:01.215Z",
          "updatedAt": "2019-04-13T20:11:01.215Z",
          "__v": 0,
          "url": "http://localhost:8080/files/97eec3fb1e9f2842d45634ffe9d03759-IMG_0005.JPG",
          "id": "5cb242552395654e5488ba49"
        },
        {
          "_id": "5cb240492395654e5488ba47",
          "title": "IMG_0001.JPG",
          "path": "fcd2121fb41faca5ae044469d9bf28c3-IMG_0001.JPG",
          "createdAt": "2019-04-13T20:02:17.544Z",
          "updatedAt": "2019-04-13T20:02:17.544Z",
          "__v": 0,
          "url": "http://localhost:8080/files/fcd2121fb41faca5ae044469d9bf28c3-IMG_0001.JPG",
          "id": "5cb240492395654e5488ba47"
        }
      ],
      "_id": "5cb23a4f2395654e5488ba46",
      "title": "HUEHUEHUEHUE",
      "createdAt": "2019-04-13T19:36:47.325Z",
      "updatedAt": "2019-04-13T20:11:01.227Z",
      "__v": 2
    }
  }

  async componentDidMount() {
    this.subscribeToNewFiles()
    const box = await AsyncStorage.getItem('@RocketBox')
    const response = await api.get(`boxes/${box}`)
    this.setState({ box: response.data })
  }

  subscribeToNewFiles = () => {

  }

  openFile = async file => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/${file.title}`
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: path
      })

      await FIleViewer.open(path)
    } catch (err) {

    }
  }

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        <Text style={styles.fileDate}>Ha {item.createdAt}</Text>
      } else if (upload.didCancel) {
        console.log(`usuer cancel`)
      } else {

        const data = new FormData()
        const [prefix, suffix] = upload.fileName.split('.')
        const ext = suffix.toLocaleLowerCase() === 'heic' ? 'jpg' : suffix

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        })

        api.post(`boxes/${this.state.box._id}/files`, data)
      }
    })
  }

  renderItem = ({ item }) => {
    <TouchableOpacity
      onPress={() => { this.openFile }}
      style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#A5CFFF"></Icon>
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>
      <Text style={styles.fileDate}>Ha {item.createdAt}</Text>
    </TouchableOpacity>
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{this.state.box.title}</Text>
        <FlatList
          style={styles.list}
          data={this.state.box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          renderItem={this.renderItem}>

        </FlatList>

        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name="cloud-upload" size={24} color="#FFF"></Icon>
        </TouchableOpacity>
      </View>
    )
  }
}