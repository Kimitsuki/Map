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
  list: {
    height: height,
    marginTop: 25,
  },
  listSearch: {
    position: 'absolute',
    marginTop: 80,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  address: {
    fontSize: 12
  },
  circle: {
    marginTop: 35,
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBlue: {
    marginTop: 35,
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#5ec3f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: 'white',
    padding: 10,
    paddingRight: 20,
    zIndex: 1,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 10,
    backgroundColor: '#5ec3f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5ec3f2',
  },
  infoAddress: {
    fontSize: 14,
    color: 'black',
  },
  direct: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: '#5ec3f2',
    alignItems: 'center',
    justifyContent: 'center',
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