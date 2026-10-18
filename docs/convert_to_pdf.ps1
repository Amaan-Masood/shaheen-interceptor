$pptxPath = "S:\Projects\Ai builder cup 2026\docs\SHAHEEN_INTERCEPTOR_PITCH_DECK.pptx"
$pdfPath = "S:\Projects\Ai builder cup 2026\docs\SHAHEEN_INTERCEPTOR_PITCH_DECK.pdf"

$pptApp = New-Object -ComObject PowerPoint.Application
$pres = $pptApp.Presentations.Open($pptxPath, 2, 1, 0)
$pres.SaveAs($pdfPath, 32)
$pres.Close()
$pptApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pres) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptApp) | Out-Null
Write-Output "PDF generated at: $pdfPath"
