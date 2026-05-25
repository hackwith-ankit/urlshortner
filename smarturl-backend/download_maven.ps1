$url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
$zip = "C:\Users\HP\Desktop\Url Shortner\maven.zip"
$dest = "C:\Users\HP\Desktop\Url Shortner\.maven"

Write-Host "Downloading Maven from $url..."
Invoke-WebRequest -Uri $url -OutFile $zip

Write-Host "Extracting to $dest..."
if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}
Expand-Archive -Path $zip -DestinationPath $dest -Force

Write-Host "Cleaning up zip..."
Remove-Item $zip -Force

Write-Host "Maven installed successfully under $dest!"
