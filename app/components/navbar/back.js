import React, { Component, Image, LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/base";

const AngleLeft = (props) => {

  return (
    <TouchableOpacity
      activeOpacity={ 0.75 }
      style={styles.crumbIconPlaceholder}
      onPress={()=>{props.navigator.pop()}}>
      <Icon name="angle-left" style={styles.crumbIconAngle}/>
    </TouchableOpacity>
  )
}


export default AngleLeft
