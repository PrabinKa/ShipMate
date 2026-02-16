import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import { getFontSize, rSpacing } from '../../utils';
import Ionicons from '@react-native-vector-icons/ionicons';

interface ScreenHeaderProps {
  label: string;
  onPress: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ label, onPress }) => {
  const { container, headerTextStyle } = styles;
  return (
    <View style={container}>
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <Ionicons name="arrow-back" size={30} color={colors.grayDark} />
      </TouchableOpacity>
      <Text style={headerTextStyle}>{label}</Text>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rSpacing(15),
  },
  headerTextStyle: {
    fontSize: getFontSize(18),
    fontWeight: '500',
    color: colors.grayDark,
    marginLeft: rSpacing(20),
  },
});
