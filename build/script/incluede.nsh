!macro customInstall
  WriteRegStr HKCR "icb-helper" "URL Protocol" "$INSTDIR\icb-helper.exe"
  WriteRegStr HKCR "icb-helper" "" "URL:icb-helper Protocol Handler"
  WriteRegStr HKCR "icb-helper\shell\open\command" "" '"$INSTDIR\icb-helper.exe" "%1"'
!macroend

