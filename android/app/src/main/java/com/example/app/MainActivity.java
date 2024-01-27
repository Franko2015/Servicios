package com.example.app;

import android.Manifest;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import java.util.List;

import pub.devrel.easypermissions.AppSettingsDialog;
import pub.devrel.easypermissions.EasyPermissions;

public class MainActivity extends BridgeActivity implements EasyPermissions.PermissionCallbacks {
  private static final int REQUEST_INTERNET_PERMISSION = 100;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState); // Ajusta el layout según tu configuración

    requestPermissions();
  }

  private void requestPermissions() {
    if (!EasyPermissions.hasPermissions(this, Manifest.permission.ACCESS_NETWORK_STATE, Manifest.permission.INTERNET)) {
      EasyPermissions.requestPermissions(
        this,
        "DEBE DAR ACCESO A INTERNET PARA UNA MEJOR EXPERIENCIA EN LA APP",
        REQUEST_INTERNET_PERMISSION,
        Manifest.permission.ACCESS_NETWORK_STATE,
        Manifest.permission.INTERNET
      );
    }
  }

  @Override
  public void onPermissionsGranted(int requestCode, List<String> perms) {
    // Acciones cuando se otorgan los permisos
  }

  @Override
  public void onPermissionsDenied(int requestCode, List<String> perms) {
    if (EasyPermissions.somePermissionPermanentlyDenied(this, perms)) {
      new AppSettingsDialog.Builder(this).build().show();
    } else {
      requestPermissions();
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
  }
}

