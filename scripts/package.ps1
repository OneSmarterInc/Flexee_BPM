$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$zip=Join-Path $root 'Flexee_BPM.zip'
$stage=Join-Path ([System.IO.Path]::GetTempPath()) ('Flexee_BPM-'+[guid]::NewGuid())
New-Item -ItemType Directory -Path $stage | Out-Null
$target=Join-Path $stage 'Flexee_BPM'
New-Item -ItemType Directory -Path $target | Out-Null
Get-ChildItem -LiteralPath $root -Force | Where-Object {$_.Name -notin @('node_modules','dist','files','.bpm-data','.git','.env') -and $_.Extension -ne '.zip'} | ForEach-Object {Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse}
Compress-Archive -LiteralPath $target -DestinationPath $zip -Force
Remove-Item -LiteralPath $stage -Recurse -Force
Write-Output "Created $zip"
