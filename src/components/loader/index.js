import React, { View, Component } from "react-native";
import Progress from "react-native-progress";
import styles from "./style";

export const LoaderMini = (props) => {
  return <View style={styles.loaderMini}></View>
}

const Loader = (props) => {
  return (
    <View style={styles.loader}>
      <Progress.Circle size={60} indeterminate={true}/>
    </View>
  )
}

export default Loader;
