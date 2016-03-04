import React, { Component, Image, LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/base";

const Search = (props) => {
  return (
      <TouchableOpacity
          activeOpacity={ 0.75 }
          style={styles.crumbIconPlaceholder}
          onPress={() => { }}>
        <Icon name="search" style={styles.crumbIconSearch}/>
      </TouchableOpacity>
  )
}


export default Search