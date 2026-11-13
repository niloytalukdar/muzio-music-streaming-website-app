Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('E:\MUZIO\design-references\muzio-final-approved-ui.png')
# Target only the logo icon and word
# In 1672x941 layout, the logo mark is roughly at x=18..60, y=18..60, and text 'muzio' next to it up to x=180
$rect = [System.Drawing.Rectangle]::FromLTRB(16, 14, 185, 66)
$cropped = $img.Clone($rect, $img.PixelFormat)
$cropped.Save('E:\MUZIO\frontend\public\muzio-logo-exact.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$cropped.Dispose()
Write-Host "EXACT_LOGO_CROPPED"

