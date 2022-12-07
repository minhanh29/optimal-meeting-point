import { StyleSheet, Dimensions } from "react-native";
import globalStyles from "../../styles";

const styles = StyleSheet.create({
  ...globalStyles,
  container: {
    flex: 1,
    backgroundColor: '#EDF4F7',
  },
  friendsWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {

  },
});

export default styles;
