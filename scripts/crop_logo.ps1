Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile('E:\MUZIO\design-references\muzio-final-approved-ui.png')
# Top left sidebar branding area
$rect = [System.Drawing.Rectangle]::FromLTRB(10, 10, 240, 75)
$cropped = $img.Clone($rect, $img.PixelFormat)
$cropped.Save('E:\MUZIO\frontend\public\muzio-brand-official.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$cropped.Dispose()
Write-Host "CROPPED_SUCCESSFULLY"

