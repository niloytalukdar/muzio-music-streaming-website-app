Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('E:\MUZIO\design-references\muzio-final-approved-ui.png')
# Logo is between x=35..185 and y=25..75
$rect = [System.Drawing.Rectangle]::FromLTRB(36, 26, 185, 75)
$cropped = $img.Clone($rect, $img.PixelFormat)
$cropped.Save('E:\MUZIO\frontend\public\muzio-logo-real.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$cropped.Dispose()
Write-Host "REAL_LOGO_SAVED"

