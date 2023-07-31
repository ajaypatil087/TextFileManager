import {Button} from '@react-native-material/core';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {api} from './Util';
import SimpleConfirmModal from './common/SimpleConfirmModal';

interface EditorProps {
  navigation?: any;
  route?: any;
}

interface EditorState {
  open: boolean;
  text: string;
}

const Editor = (props: EditorProps): JSX.Element => {
  const {fileName} = props.route.params;
  const [state, setState] = useState<EditorState>({
    open: false,
    text: '',
  });
  let textLength = 0;

  useEffect(() => {
    getFileText();
  }, []);

  async function getFileText() {
    try {
      const res = await api.get(`/readfile/${fileName}`);
      if (res.status === 200) {
        const data = res.data;
        textLength = data.length;
        setState({...state, text: data});
      }
    } catch (er) {
      console.warn(er);
    }
  }

  async function writeFileText() {
    try {
      if (textLength != state.text.length) {
        await api.put(`/write`, {
          fileName,
          newContent: state.text,
        });
      }
    } catch (er) {
      console.warn(er);
    }
  }

  const handleClear = async () => {
    try {
      await api.put('/clearcontent', {fileName});
      setState({...state, text: '', open: false});
    } catch (er) {
      console.warn(er);
    }
  };

  return (
    <View style={styles.layout}>
      <View style={styles.fileNameContainer}>
        <Text style={styles.fileName}>{fileName}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Add text content here..."
          value={state.text}
          onChangeText={text => setState({...state, text: text})}
        />
      </View>
      <View style={styles.actionBtnContainer}>
        <Button
          title="Clear"
          color="red"
          onPress={() => setState({...state, open: true})}
        />
        <Button
          title="Save"
          color="green"
          onPress={writeFileText}
          disabled={textLength === state.text.length || state.text.length === 0}
        />
      </View>
      <SimpleConfirmModal
        open={state.open}
        msg="Do you want to clear whole content?"
        confirmLabel="Clear"
        confirmFunc={handleClear}
        cancelFunc={() => setState({...state, open: false})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    backgroundColor: 'lightgrey',
    height: '100%',
  },
  fileNameContainer: {
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 10,
    height: '80%',
  },
  input: {
    backgroundColor: '#fff',
    maxHeight: '100%',
  },
  actionBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly',
  },
  fileName: {
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default Editor;
