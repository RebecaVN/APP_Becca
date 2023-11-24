import Toast from "react-native-toast-message";

const showToastError = (title, description) => {
    Toast.show({
        type: 'error',
        position: 'top',
        text1: title,
        text2: description,
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 40,
    });
  };

export default showToastError;