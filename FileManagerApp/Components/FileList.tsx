import {Button, FAB, IconButton, TextInput} from '@react-native-material/core';
import {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SimpleConfirmModal from './common/SimpleConfirmModal';
import {api} from './Util';

interface FileListProps {
  navigation?: any;
}

interface FileListState {
  addFileModal: boolean;
  data: string[];
  deleteModal: boolean;
  dialogMsg: string;
  dialogTarget: string;
  modalInput: string;
}

const ListItem = (props: {
  item: string;
  index: number;
  navigation: any;
  deleteDialog: (fileName: string) => void;
}): JSX.Element => {
  const handleFileClick = () => {
    props.navigation.navigate('Editor', {
      fileName: props.item,
    });
  };
  return (
    <View style={styles.listItem}>
      <TouchableOpacity style={{width: '85%'}} onPress={handleFileClick}>
        <Text style={styles.fileName}>
          {`${props.index + 1}. ${props.item}`}{' '}
        </Text>
      </TouchableOpacity>
      <IconButton
        onPress={() => props.deleteDialog(props.item)}
        icon={props => <Icon name="delete" color="red" size={20} />}
      />
    </View>
  );
};

const AddModal = (props: {
  open: boolean;
  text: string;
  close: () => void;
  confirmFunc: () => void;
  setText: (text: string) => void;
}): JSX.Element => {
  return (
    <Modal
      visible={props.open}
      transparent={true}
      animationType="fade"
      onRequestClose={props.close}>
      <View style={styles.modalLayout}>
        <View style={styles.modalFormContainer}>
          <View>
            <TextInput
              value={props.text}
              onChangeText={text => props.setText(text)}
              variant="outlined"
              label="File Name"
              placeholder="File Name..."
            />
          </View>
          <View style={styles.actionBtnContainer}>
            <Button
              title="Cancel"
              color={'red'}
              titleStyle={{color: 'white'}}
              style={styles.actionBtn}
              onPress={props.close}
            />
            <Button
              title={'Add'}
              color={'green'}
              style={styles.actionBtn}
              onPress={props.confirmFunc}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FileList = (props: FileListProps): JSX.Element => {
  const scrolling = useRef(new Animated.Value(0)).current;
  const [state, setState] = useState<FileListState>({
    addFileModal: false,
    data: [],
    deleteModal: false,
    dialogMsg: '',
    dialogTarget: '',
    modalInput: '',
  });

  useEffect(() => {
    getFileList();
  }, []);

  async function getFileList() {
    try {
      const res = await api.get('/filelist');
      if (res.status === 200) {
        const data = res.data.res;
        setState({...state, data: data});
      }
    } catch (er) {
      console.warn(er);
    }
  }

  const handleDelete = (fileName: string) => {
    setState({
      ...state,
      deleteModal: true,
      dialogMsg: `Do You Want to Delete ${
        state.data[state.data.indexOf(fileName)]
      } ?`,
      dialogTarget: fileName,
    });
  };

  const addFile = async () => {
    try {
      const text = state.modalInput;
      if (text.length > 0) {
        const res = await api.post('/create', {fileName: text});
        if (res.status === 200) {
          const data = res.data.res;
          setState({...state, modalInput: '', data, addFileModal: false});
          return;
        }
      }
    } catch (er) {
      console.warn(er);
    }
  };

  const deleteFile = async () => {
    try {
      const res = await api.delete(`/delete/${state.dialogTarget}`);
      if (res.status === 200) {
        const data = res.data.res;
        setState({
          ...state,
          data,
          deleteModal: false,
          dialogMsg: '',
          dialogTarget: '',
          modalInput: '',
        });
        return;
      }
    } catch (er) {
      console.warn(er);
    }
  };

  const setText = (text: string) => {
    setState({...state, modalInput: text});
  };

  return (
    <View style={styles.layout}>
      <Animated.ScrollView
        style={styles.listLayout}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrolling}}}],
          {useNativeDriver: true},
        )}>
        {state.data.map((val, index) => (
          <ListItem
            item={val}
            index={index}
            key={index}
            deleteDialog={handleDelete}
            navigation={props.navigation}
          />
        ))}
      </Animated.ScrollView>
      <View style={styles.floatBtnContainer}>
        <FAB
          icon={<Icon name="playcircleo" size={25} />}
          style={styles.musicBtn}
          onPress={() => props.navigation.navigate('Music')}
        />
        <FAB
          style={styles.addBtn}
          icon={<Icon name="addfile" color={'white'} size={25} />}
          onPress={() => setState({...state, addFileModal: true})}
        />
      </View>
      <AddModal
        open={state.addFileModal}
        close={() => setState({...state, addFileModal: false})}
        confirmFunc={addFile}
        text={state.modalInput}
        setText={setText}
      />
      <SimpleConfirmModal
        open={state.deleteModal}
        msg={state.dialogMsg}
        confirmLabel={'Delete'}
        cancelFunc={() =>
          setState({...state, deleteModal: false, dialogMsg: ''})
        }
        confirmFunc={deleteFile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    backgroundColor: 'lightgrey',
    height: '100%',
    padding: 5,
  },
  listLayout: {
    padding: 10,
    height: '85%',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  fileName: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    paddingLeft: 10,
  },
  modalLayout: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFormContainer: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
  },
  actionBtnContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 30,
  },
  actionBtn: {
    width: '40%',
    color: 'white',
  },
  floatBtnContainer: {
    position: 'absolute',
    display: 'flex',
    bottom: 20,
    right: 10
  },
  musicBtn: {
    backgroundColor: 'yellow',
    marginBottom: 15
  },
  addBtn: {
    backgroundColor: 'green',
  },
});

export default FileList;
