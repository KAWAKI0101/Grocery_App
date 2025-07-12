import { CommonActions, createNavigationContainerRef, StackActions } from "@react-navigation/native";


export const navigationRef = createNavigationContainerRef()

export async function navigate(routeName: string, params?: object) {
    navigationRef.isReady()
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.navigate(routeName, params))
    }
}

export async function replace(routeName: string, params?: object) {
    navigationRef.isReady()
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(routeName, params))
    }else{
        console.warn("❗ Navigation not ready (replace)", routeName);
    }
}

export function resetAndNavigate(routeName: string) {
  if (navigationRef?.current?.getCurrentRoute()) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  } else {
    console.warn('❗ NavigationRef not ready, cannot navigate to:', routeName);
  }
}


export async function goBack() {
    navigationRef.isReady()
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.goBack())
    }
}

export async function push(routeName: string, params?: object) {
    navigationRef.isReady()
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(routeName, params))
    }
}

export async function prepareNavigation() {
    navigationRef.isReady()
}