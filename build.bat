set KEYSTORE=..\papers.jks
call ..\key.bat
@cordova build android --release -- --keystore="../papers.jks" --password=%KP% --storePassword=%SP% --alias=%AL%