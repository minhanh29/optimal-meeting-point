import { StyleSheet, Dimensions } from "react-native";
import globalStyles from "../../styles"

const styles = StyleSheet.create({
  ...globalStyles,
	searchContainer:{
    position: 'absolute',
    width: '80%',
    shadowColor: "black",
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  locationAddress:{
    marginTop: 5,
  },
  searchContainer:{
    backgroundColor: 'white',
    borderRadius: 15,
    position: 'absolute',
    width: '80%',
    // shadowColor: 'black',
    // shadowOffset: {width:2, height: 2},
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    backgroundColor: 'white',
    borderRadius: 15,
}
});

export default styles;
