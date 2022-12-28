import { StyleSheet, Dimensions } from "react-native";
import globalStyles from "../../styles"

const styles = StyleSheet.create({
  ...globalStyles,
  searchContainer: {
    position: 'absolute',
    width: '80%',
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  locationAddress: {
    marginTop: 5,
    width: '100%',
  },
  searchContainer: {
    borderRadius: 15,
    width: '95%',
    // shadowColor: 'black',
    // shadowOffset: {width:2, height: 2},
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    backgroundColor: 'white',
    flex: 1,
    padding: 8,
    borderRadius: 8,
    marginLeft: 30,
    marginRight: 30,
    height: '50%'
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },

  iconStyle: {
    color: "#EE6548",
    padding: 6,
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
  },
  titleText: {
    fontWeight: "bold",
    width: '100%',
  },
  dropDownList: {
    height: '50%',
  },
  bottomContainer: {
    position: "absolute",
    bottom: 10,
    width: '90%',
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',

  },
  cardContainer: {
    width: "100%",
    borderRadius: 15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowColor: "black",
    padding: 17,
    backgroundColor: "white",
    elevation: 4,
  },
  locationContent: {
    width: '85%',
  },
  searchHolder: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  iconImg: {
    marginLeft: 15,
  },
  searchInput: {
    width: "80%",
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "white",
    borderColor: 'transparent',
    fontFamily: "Montserrat",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    borderRadius: 15,
  },
});

export default styles;
