import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

interface TitleProps {
  label: string;
  icon: string;
}

const Title = (props: TitleProps): JSX.Element => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <Text
        style={{
          color: '#000',
          fontWeight: '600',
          fontSize: 18,
          marginRight: 5,
        }}>
        {props.label}
      </Text>
      <Icon name={props.icon} size={25} />
    </View>
  );
};

export default Title;
