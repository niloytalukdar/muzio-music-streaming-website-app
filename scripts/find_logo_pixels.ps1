Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('E:\MUZIO\design-references\muzio-final-approved-ui.png')
for ($y = 0; $y -lt 150; $y += 10) {
    for ($x = 0; $x -lt 400; $x += 15) {
        $c = $bmp.GetPixel($x, $y)
        # Highlight bright pixels (white or colorful neon)
        if ($c.R -gt 150 -or $c.G -gt 150 -or $c.B -gt 150) {
            Write-Host "Bright pixel at x=$x y=$y (R=$($c.R), G=$($c.G), B=$($c.B))"
        }
    }
}
$bmp.Dispose()

