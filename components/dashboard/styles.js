import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topContainer: {
    width: "100%",
    position: "absolute",
    top: "8%",
    left: "8%",
    backgroundColor: "transparent",
  },
  topTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 30,
    textDecorationLine: "underline",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  bottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: "5%",
    backgroundColor: "transparent",
  },
  bottomPinContainer: {
    width: "100%",
    position: "absolute",
    bottom: "0%",
    backgroundColor: "transparent",
  },
  bottomNav: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  bottomPinNav: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 8,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  sideContainer: {
    position: "absolute",
    top: "8%",
    right: 0,
  },
  sidePinContainer: {
    position: "absolute",
    top: "8%",
    // left: 0,
    padding: 5,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 50,
  },
  sidePinNav: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 8,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  shadowBtn: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.5,
    shadowRadius: 13.97,

    elevation: 20,
  },
  marker_icon: {
    height: 35,
    width: 35,
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 200,
  },
  userCallout: {
    width: 100,
    height: 100,
  },
  locationName: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    marginBottom: 1,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  image: {
    width: 120,
    height: 80,
  },

  bottomSheetContainer: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  headerBottomSheet: {
    backgroundColor: "#ffffff",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panel: {
    padding: 20,
    height: 300,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 24,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    paddingTop: 10,
    height: 70,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  pinHeaderText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 13,
    textAlign: "center",
    textDecorationLine: "underline",
    // fontWeight: '900',
    // textShadowColor: 'rgba(0, 0, 0, 0.8)',
    // textShadowOffset: { width: 0, height: 0 },
    // textShadowRadius: 2,
  },
  searchInput: {
    width: "80%",
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "white",
    borderColor: "transparent",
    fontFamily: "Montserrat",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    borderRadius: 15,
  },
  buttonTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
    textAlign: "center",
  },
});

export default styles;
