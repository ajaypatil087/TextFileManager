import {FAB} from '@react-native-material/core';
import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {api} from '../Util';

interface MusicPlayerState {
  list: string[];
  isPlaying: boolean;
}

const RenderList = (props: {index: number; name: string}): JSX.Element => {
  return (
    <TouchableOpacity style={styles.listRow}>
      <Text style={styles.listText}>
        {props.index}. {props.name}
      </Text>
    </TouchableOpacity>
  );
};

const Music = (): JSX.Element => {
  const [state, setState] = useState<MusicPlayerState>({
    list: [],
    isPlaying: false,
  });

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    try {
      const res = await api.get('/songlist');
      if (res.status === 200) {
        const list = res.data.res;
        setState({...state, list});
      }
    } catch (er) {
      console.warn(er);
    }
  }

  const play = async () => {
    try {
      setState({ ...state, isPlaying: true });
    } catch (er) {
      console.warn(er); 
    }
  };

  const pause = () => {
    setState({ ...state, isPlaying: false });
  };

  return (
    <View style={styles.Layout}>
      <Animated.ScrollView style={styles.listLayout}>
        {state.list.map((song, index) => (
          <RenderList index={index + 1} name={song} key={index} />
        ))}
      </Animated.ScrollView>
      <View style={styles.playerLayout}>
        <View style={styles.songNameContainer}>
          <Text style={styles.songName}>Song Name</Text>
        </View>
        <View style={styles.playerActions}>
          <FAB icon={<Icon name="stepbackward" size={20} />} />
          <FAB icon={<Icon name={state.isPlaying ? "pause" : "caretright"} size={20} />} onPress={state.isPlaying ? pause : play} />
          <FAB icon={<Icon name="stepforward" size={20} />} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Layout: {
    height: '100%',
  },
  listLayout: {
    height: '82%',
  },
  listRow: {
    padding: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  listText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
  },
  playerLayout: {
    height: '18%',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  playerActions: {
    display: 'flex',
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-around',
  },
  songNameContainer: {
    padding: 15,
  },
  songName: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default Music;
