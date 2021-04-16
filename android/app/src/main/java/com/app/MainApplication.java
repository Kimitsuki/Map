package com.app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.reactnativecommunity.picker.RNCPickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import com.airbnb.android.react.maps.MapsPackage;
import com.rnfs.RNFSPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new GeolocationPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new SafeAreaContextPackage(),
            new RNScreensPackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new MapsPackage(),
            new RNCPickerPackage(),
            new RNFSPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
