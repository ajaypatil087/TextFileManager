import {Button} from '@react-native-material/core';
import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';

interface SimpleConfirmModalProp {
  open: boolean;
  msg: string;
  confirmLabel: string;
  cancelLabel?: string;
  target?: any;
  confirmFunc: (target?: any) => void;
  cancelFunc: () => void;
}

const SimpleConfirmModal = (props: SimpleConfirmModalProp): JSX.Element => {
  const handleConfirm = () => {
    if (props.target) {
      props.confirmFunc(props.target);
    } else {
      props.confirmFunc();
    }
  };

  return (
    <Modal
      visible={props.open}
      transparent={true}
      animationType="fade"
      onRequestClose={props.cancelFunc}>
      <View style={styles.modalLayout}>
        <View style={styles.modalContainer}>
          <View style={styles.messageContainer}>
            <Text style={styles.msg}>{props.msg}</Text>
          </View>
          <View style={styles.actionBtnContainer}>
            <Button
              title={props.cancelLabel || 'Cancel'}
              color={'red'}
              titleStyle={{color: 'white'}}
              style={styles.actionBtn}
              onPress={props.cancelFunc}
            />
            <Button
              title={props.confirmLabel}
              color={'green'}
              style={styles.actionBtn}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalLayout: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
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
  messageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msg: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SimpleConfirmModal;
