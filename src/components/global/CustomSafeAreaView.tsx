import { FC, ReactNode } from "react"
import { SafeAreaView, StyleSheet, ViewStyle, View } from "react-native"


interface CustomSafeAreaViewProps{
    children: ReactNode,
    style?: ViewStyle | ViewStyle[]
}

const CustomSafeAreaView:FC<CustomSafeAreaViewProps> = ({children,style = {} }) => {
    if (typeof children === "string") {
    console.warn("⚠️ Found raw string child in CustomSafeAreaView:", children);
  }
  return (
      <SafeAreaView style={[styles.container, style]}>
      <View style={[styles.container, style]} >
        {children}
      </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    }
})

export default CustomSafeAreaView;