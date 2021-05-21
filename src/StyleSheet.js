import { StyleSheet, Dimensions } from 'react-native';

let { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  findingBox: {
    position: 'absolute',
    width: width,
    height: 50,
    marginTop: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  itemBox: {
    width: width,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderTopColor: 'black',
    borderWidth: 1,
    padding: 5,
    paddingLeft: 10
  },
  historyBox: {
    width: width,
    height: 40,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderTopColor: 'black',
    borderWidth: 1,
    padding: 5,
    paddingLeft: 12.5,
    alignItems: 'center',
  },
  itemList: {
    width: width,
    backgroundColor: 'white',
    borderColor: 'white',
    borderTopColor: 'black',
    borderWidth: 1,
    height: 70,
    padding: 5,
    paddingLeft: 10
  },
  listSearch: {
    position: 'absolute',
    marginTop: 80,
    maxHeight: height / 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  address: {
    fontSize: 12
  },
  circleBlue: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: '#5ec3f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#5ec3f2',
  },
  info: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: 'transparent',
    padding: 5,
  },
  button: {
    width: 100,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5ec3f2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  infoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5ec3f2',
    paddingRight: 10,
  },
  infoAddress: {
    fontSize: 12,
    color: 'black',
    paddingRight: 10,
  },
  bigInfoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5ec3f2',
  },
  bigInfoAddress: {
    fontSize: 14,
    color: 'black',
  },
  bigBoldInfoAddress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  list: {
    height: height - 255,
  },
  listFavorites: {
    height: height - 130,
  },
  headerBackground: {
    width: '100%',
    height: 80,
    backgroundColor: '#5ec3f2',
  },
  bigWhite: {
    color: 'white',
    fontSize: 22,
    marginTop: 30,
    marginLeft: 20
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },
  map: {
    width: width,
    height: height,
    position: 'relative',
  },
});