# To run the ps to setup brs solutions
# Prerequisite: need to do the following git operation under folder C:\EHBs
# git clone http://tfs-app-01.reisys.com:8080/tfs/HRSA/PostAwardGit/_git/HAB-Essentials

Write-Output "Setup started at $(Get-Date)"

$BasePath = "Y:\WorkSpace\"
$SolutionSetupPath = $BasePath + "HAB-Essentials\"
$ToolPath = $SolutionSetupPath + "Executables"

######################################################
# Please specify the branches for each BRS Solutions:

$HabPlatformName = "HAB-Platformv4.18.10"
$HabPlatformUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-Platformv4.18.10"
$HabPlatformBranch = "dev/DME/feature/Shiva-Copy"

$CATInfrastructure6Name = "CAT-Infrastructure6_prod"
$CATInfrastructure6Url = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/CAT-Infrastructure"
$CATInfrastructure6Branch = "releases/6.9.10"

$CATInfrastructure7Name = "CAT-Infrastructure7_redesign"
$CATInfrastructure7Url = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/CAT-Infrastructure"
$CATInfrastructure7Branch = "releases/7.11.0"

$HABIntergation7Name = "HAB-Integration7_aetc"
$HABIntergation7Url = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-Integration"
$HABIntegration7Branch = "releases/7.8.0"

$HABIntergation8Name = "HAB-Integration8_rsredesign"
$HABIntergation8Url = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-Integration"
$HABIntegration8Branch = "dev/DME/8.24.0"

$HABIntergation9Name = "HAB-Integration9_adr"
$HABIntergation9Url = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-Integration"
$HABIntegration9Branch = "releases/9.10.0"

$RSRName = "HAB-RSR"
$RSRUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-RSR"
$RSRBranch = "dev/DME/16.26.0"

$PTRName = "HAB-PTR"
$PTRUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-PTR"
$PTRBranch = "releases/9.5.0"

$ADRName = "HAB-ADR"
$ADRUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-ADR"
$ADRBranch = "releases/10.9.10"

$AETCName = "HAB-AETC"
$AETCUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-AETC"
$AETCBranch = "releases/15.12.10"

$HATName = "HAB-HAT"
$HATUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-HAT"
$HATBranch = "releases/4.16.0"

$WindowsServicesName = "HAB-WindowsServices"
$WindowsServicesUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-WindowsServices"
$WindowsServicesBranch = "releases/2.19.0"

$HIVQMName = "HAB-HIVQM"
$HIVQMUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-HIVQM"
$HIVQMBranch = "releases/3.11.10"

$EHBGatewayName = "CAT-EHBGateway"
$EHBGatewayUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/CAT-EHBGateway"
$EHBGatewayBranch = "dev/DME/feature/Mani"

$HABBRSServiceName = "HAB-BRSService"
$HABBRSServiceUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-BRSService"
$HABBRSServiceBranch = "master"

$HABPTRModernName = "HAB-PTRModern"
$HABPTRModernUrl = "https://ehbads.hrsa.gov/ads/EHBs/EHBs/_git/HAB-PTRModern"
$HABPTRModernBranch = "master"
######################################################

# 1. skip the verification of strong names
$NETFXPath = "C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.6.1 Tools"
if((Test-Path -Path $NETFXPath) -eq $False) {
    Write-Host "The path: $NETFXPath does not exist, please check again before proceeding." -ForegroundColor "Red"
    return;
}
Set-Location $NETFXPath
cmd /c "sn -Vr *,677fce62a3a80367"

####################################################################################

# 2. Install all dlls in $SolutionSetupPath\ExternalDependencies\ to GAC using the tool Rei.GacUtil.exe 
$ExternalDependenciesPath = $SolutionSetupPath + "ExternalDependencies"
Set-Location $ToolPath
$InstallCommand = "Rei.GacUtil.exe -i " + $ExternalDependenciesPath
cmd /c $InstallCommand

####################################################################################

# 3. Copy CrossCutting and Foundation configurations to Y:\ Drive
$CrossCuttingPath = $SolutionSetupPath + "CrossCutting\";
$FoundationPath = $SolutionSetupPath + "Foundation\";
Write-Host "Copying CrossCutting and Foundation to Y:\ drive"
Copy-Item -Path "$CrossCuttingPath" -Destination "Y:\" -Recurse -Force 
Copy-Item -Path "$FoundationPath" -Destination "Y:\" -Recurse -Force 

####################################################################################

# 4. Install all dlls in Themes and Scripts to GAC
Set-Location $ToolPath
$ScriptPath = $SolutionSetupPath + "Scripts\"
$ThemesPath = $SolutionSetupPath + "Themes\"
$ScriptCommand = "Rei.GacUtil.exe -i " + $ScriptPath
$ThemesCommand = "Rei.GacUtil.exe -i " + $ThemesPath
cmd /c $ScriptCommand
cmd /c $ThemesCommand

####################################################################################

# 5. Add HRSA NuGet package url to user level \%AppData%\NuGet\NuGet.Config
Set-Location $SolutionSetupPath
./nuget.exe sources add -Name "HRSA NuGet" -Source "https://ehbnrm.hrsa.gov/nexus/repository/DEV_DME/"

####################################################################################

# 6. clone project: CAT-Infrastructure/HAB-Integration/RSR/PTR/ADR/AETC/HAT/WindowsServices/HIVQM/EHBGateway
# Time elapsed for clone solutions  00:12:01.6985472

$StopWatch = [Diagnostics.Stopwatch]::StartNew()

# HAB-Platform
Write-Host "Checking $HabPlatformName into $BasePath..."
Set-Location $BasePath
git clone -b $HabPlatformBranch $HabPlatformUrl $BasePath$HabPlatformName

#CAT-Infrastructure6
Write-Host "Checking $CATInfrastructure6Name into $BasePath..."
Set-Location $BasePath
git clone -b $CATInfrastructure6Branch $CATInfrastructure6Url $BasePath$CATInfrastructure6Name

#CAT-Infrastructure7
Write-Host "Checking $CATInfrastructure7Name into $BasePath..."
Set-Location $BasePath
git clone -b $CATInfrastructure7Branch $CATInfrastructure7Url $BasePath$CATInfrastructure7Name

#HAB-Integration7
Write-Host "Checking $HABIntergation7Name into $BasePath..."
Set-Location $BasePath
git clone -b $HABIntegration7Branch $HABIntergation7Url $BasePath$HABIntergation7Name

#HAB-Integration8
Write-Host "Checking $HABIntergation8Name into $BasePath..."
Set-Location $BasePath
git clone -b $HABIntegration8Branch $HABIntergation8Url $BasePath$HABIntergation8Name

#HAB-Integration9
Write-Host "Checking $HABIntergation9Name into $BasePath..."
Set-Location $BasePath
git clone -b $HABIntegration9Branch $HABIntergation9Url $BasePath$HABIntergation9Name

# RSR
Write-Host "Checking $RSRName into $BasePath..."
Set-Location $BasePath
git clone -b $RSRBranch $RSRUrl $BasePath$RSRName

# HAB-PTR
Write-Host "Checking $PTRName into $BasePath..."
Set-Location $BasePath
git clone -b $PTRBranch $PTRUrl $BasePath$PTRName

# HAB-ADR
Write-Host "Checking $ADRName into $BasePath..."
Set-Location $BasePath
git clone -b $ADRBranch $ADRUrl $BasePath$ADRName

# HAB-AETC
Write-Host "Checking $AETCName into $BasePath..."
Set-Location $BasePath
git clone -b $AETCBranch $AETCUrl $BasePath$AETCName

# HAB-HAT
Write-Host "Checking $HATName into $BasePath..."
Set-Location $BasePath
git clone -b $HATBranch $HATUrl $BasePath$HATName

# HAB-WindowsServices
Write-Host "Checking $WindowsServicesName into $BasePath..."
Set-Location $BasePath
git clone -b $WindowsServicesBranch $WindowsServicesUrl $BasePath$WindowsServicesName

# HIVQM
Write-Host "Checking $HIVQMName into $BasePath..."
Set-Location $BasePath
git clone -b $HIVQMBranch $HIVQMUrl $BasePath$HIVQMName

# EHBGateway
Write-Host "Checking $EHBGatewayName into $BasePath..."
Set-Location $BasePath
git clone -b $EHBGatewayBranch $EHBGatewayUrl $BasePath$EHBGatewayName

# HABBRSService
Write-Host "Checking $HABBRSServiceName into $BasePath..."
Set-Location $BasePath
git clone -b $HABBRSServiceBranch $HABBRSServiceUrl $BasePath$HABBRSServiceName

# HABPTRModern
Write-Host "Checking $HABPTRModernName into $BasePath..."
Set-Location $BasePath
git clone -b $HABPTRModernBranch $HABPTRModernUrl $BasePath$HABPTRModernName

$StopWatch.Stop()
Write-Host 'Time elapsed for clone solutions ' $StopWatch.Elapsed

####################################################################################

# 7. Copy PFM configuration folder
Write-Host "Copying Platform configuration folder to $BasePath$HabPlatformName"
$CATConfigPath = $SolutionSetupPath + "CAT\Lib\Platform\"
$pfmConfigPath = $BasePath + $HabPlatformName
Copy-Item -Path "$CATConfigPath" -Destination $pfmConfigPath -Recurse -Force 

####################################################################################

# 8. Execute batch file: setupIIS_NewPlatform_HRSA.bat
$BatchCommand = $SolutionSetupPath + "setupIIS_NewPlatform_HRSA.bat";
cmd /c $BatchCommand

####################################################################################

# 9. Build the solutions: RSR

function buildSolution {
  param (
    [parameter(Mandatory=$TRUE)]
    [string] $path,

    [parameter(Mandatory=$FALSE)]
    [bool] $nuget = $TRUE,

    [parameter(Mandatory=$FALSE)]
    [bool] $clean = $TRUE
  )
  PROCESS {
    $msBuildExe = "C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe"

    if($nuget) {
        Write-Host "Restoring Nuget Packages" -foregroundcolor Green
        C:/EHBs/HAB-Essentials/nuget.exe restore "$($path)"
    }

    if($clean) {
        Write-Host "Cleaning $($path)" -foregroundcolor Green
        & "$($msBuildExe)" "$($path)" /t:Clean /m
    }

    Write-Host "Building $($path)" -foregroundcolor Green
    & "$($msBuildExe)" "$($path)" /t:Build /m

  }
}

$RSRsolutionPath = $BasePath+"HAB-RSR\RSRSolution.sln"
buildSolution $RSRsolutionPath

####################################################################################

# 10. Replace web.config across all solutions

# Replace Web.config in RSR
Write-Host 'Replace web.config for HAB-RSR solution'
$WebForRSR = $SolutionSetupPath + "WebConfigs\RSR\Web.config"
$RSRWebPath = $BasePath + "HAB-RSR\src\Rsr.Web"
Copy-Item -Path "$WebForRSR" -Destination $RSRWebPath -Force 

# Replace Web.config in HAB-ADR
Write-Host 'Replace web.config for HAB-ADR solution'
$WebForADR = $SolutionSetupPath + "WebConfigs\ADR\Web.config"
$ADRWebPath = $BasePath + "HAB-ADR\src\Adr.Web"
Copy-Item -Path "$WebForADR" -Destination $ADRWebPath -Force 

# Replace Web.config in HAB-PTR
Write-Host 'Replace web.config for HAB-PTR solution'
$WebForPTR = $SolutionSetupPath + "WebConfigs\PTR\Web.config"
$PTRWebPath = $BasePath + "HAB-PTR\src\PTR.Web"
Copy-Item -Path "$WebForPTR" -Destination $PTRWebPath -Force 

# Replace Web.config in HAB-AETC
Write-Host 'Replace web.config for HAB-AETC solution'
$WebForAETC = $SolutionSetupPath + "WebConfigs\AETC\Web.config"
$AETCWebPath = $BasePath + "HAB-AETC\src\Aetc.Web"
Copy-Item -Path "$WebForAETC" -Destination $AETCWebPath -Force 

# Replace Web.config in HAB-HIVQM
Write-Host 'Replace web.config for HAB-HIVQM solution'
$WebForHIVQM = $SolutionSetupPath + "WebConfigs\HIVQM\Web.config"
$HIVQMWebPath = $BasePath + "HAB-HIVQM\src\HIVQM.Web"
Copy-Item -Path "$WebForHIVQM" -Destination $HIVQMWebPath -Force 

# Replace App.config in HAB-HIVQM/
Write-Host 'Replace web.config for HAB-HIVQM solution'
$AppForHIVQM = $SolutionSetupPath + "WebConfigs\HIVQM\App.config"
$HIVQMAppPath = $BasePath + "HAB-HIVQM\src\HIVQMAsynchronousService"
Copy-Item -Path "$AppForHIVQM" -Destination $HIVQMAppPath -Force 

## Replace Web.config in CAT-EHBGateway
#Write-Host 'Replace web.config for CAT-EHBGateway solution'
#$WebForEHBGateway = $SolutionSetupPath + "WebConfigs\EHBGateway\Web.config"
#$EHBGatewayWebPath = $BasePath + "CAT-EHBGateway\src\EHBGateway.Web"
#Copy-Item -Path "$WebForEHBGateway" -Destination $EHBGatewayWebPath -Force 

# Replace Web.config in HAB-HAT
Write-Host 'Replace web.config for HAB-HAT solution'
$WebForHAT = $SolutionSetupPath + "WebConfigs\HAT\Web.config"
$HATWebPath = $BasePath + "HAB-HATsrc\hat.Web"
Copy-Item -Path "$WebForHAT" -Destination $HATWebPath -Force 

####################################################################################

# 11. Replace log4net.config across all solutions

# Replace log4net.config in RSR
Write-Host 'Replace log4net.config for HAB-RSR solution'
$logForRSR = $SolutionSetupPath + "log4netConfigs\RSR\log4net.config"
$RSRWebPath = $BasePath + "HAB-RSR\src\Rsr.Web"
Copy-Item -Path "$logForRSR" -Destination $RSRWebPath -Force 

# Replace log4net.config in HAB-ADR
Write-Host 'Replace log4net.config for HAB-ADR solution'
$logForADR = $SolutionSetupPath + "log4netConfigs\ADR\log4net.config"
$ADRWebPath = $BasePath + "HAB-ADR\src\Adr.Web"
Copy-Item -Path "$logForADR" -Destination $ADRWebPath -Force 

# Replace log4net.config in HAB-PTR
Write-Host 'Replace log4net.config for HAB-PTR solution'
$logForPTR = $SolutionSetupPath + "log4netConfigs\PTR\log4net.config"
$PTRWebPath = $BasePath + "HAB-PTR\src\PTR.Web"
Copy-Item -Path "$logForPTR" -Destination $PTRWebPath -Force 

# Replace log4net.config in HAB-AETC
Write-Host 'Replace log4net.config for HAB-AETC solution'
$logForAETC = $SolutionSetupPath + "log4netConfigs\AETC\log4net.config"
$AETCWebPath = $BasePath + "HAB-AETC\src\Aetc.Web"
Copy-Item -Path "$logForAETC" -Destination $AETCWebPath -Force 

# Replace log4net.config in HAB-HIVQM
Write-Host 'Replace log4net.config for HAB-HIVQM solution'
$logForHIVQM = $SolutionSetupPath + "log4netConfigs\HIVQM\log4net.config"
$HIVQMWebPath = $BasePath + "HAB-HIVQM\src\HIVQM.Web"
Copy-Item -Path "$logForHIVQM" -Destination $HIVQMWebPath -Force 

## Replace log4net.config in CAT-EHBGateway
#Write-Host 'Replace log4net.config for CAT-EHBGateway solution'
#$logForEHBGateway = $SolutionSetupPath + "log4netConfigs\EHBGateway\log4net.config"
#$EHBGatewayWebPath = $BasePath + "CAT-EHBGateway\src\EHBGateway.Web"
#Copy-Item -Path "$logForEHBGateway" -Destination $EHBGatewayWebPath -Force 

# Replace log4net.config in HAB-HAT
Write-Host 'Replace log4net.config for HAB-HAT solution'
$logForHAT = $SolutionSetupPath + "log4netConfigs\HAT\log4net.config"
$HATWebPath = $BasePath + "HAB-HAT\src\HAT.Web"
Copy-Item -Path "$logForHAT" -Destination $HATWebPath -Force 
#############To DO###############


# Replace Web.config in HAB-Integration

# Replace Web.config in HAB-WindowsServices

####################################################################################

Write-Output "Setup completed at $(Get-Date)"
