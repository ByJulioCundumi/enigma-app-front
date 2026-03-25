// Generar archivo ABB
//comando - eas build -p android --profile preview
const ABB = {
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "android": {
        "buildType": "app-bundle"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {
      "android":{
        "buildType":"apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}

// Generar APK
//comando - eas build -p android --profile preview
const APK = {
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {}
  }
}


