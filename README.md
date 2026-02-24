# BRS Solutions Setup 1.0

#### Prerequisites:
* Please make sure you have TFS access to "EHBs" and "PostAwardGit" projects, request access if you don't have
* Please set up IIS(Internet Information Services (IIS) Manager) on local

Please do the following git command under `C:\EHBs` folder (create one if not existed):
* git clone http://tfs-app-01.reisys.com:8080/tfs/HRSA/PostAwardGit/_git/HAB-Essentials
* git checkout develop  
---

###### Under the `C:\EHBs\HAB-Essentials` directory:
* There are config files as well as dlls to be used to set up the brs solutions;  
* Find the powershell script file `SetupBRS.ps1` under the current directory:
  * update the branch to desired ones if needed for the repositories to be set up (section located at the top of the ps file)
  * default branch for all solutions:  
    * $CATInfrastructureBranch = "releases/5.3.0"  
    * $HABIntegrationBranch = "releases/6.0.0"  
    * $RSRBranch = "releases/12.0.0"  
    * $PTRBranch = "releases/3.1.15"  
    * $ADRBranch = "releases/8.0.0"  
    * $AETCBranch = "releases/13.1.15"  
    * $RegLoginBranch = "releases/1.3.0"  
    * $HATBranch = "releases/3.0.5"  
    * $WindowsServicesBranch = "releases/1.3.0"  
  * execute the ps script as **administrator**, no extra parameter needed.    
---

###### Basically the powershell script will conduct the following `10` steps:
1. Skip the verification of strong names
2. Install all dlls in $SolutionSetupPath\ExternalDependencies\ to GAC using the tool Rei.GacUtil.exe 
3. Copy CrossCutting and Foundation configurations to Y:\ Drive
4. Copy CAT configuration folder to C:\EHBs\
5. Install all dlls in Themes and Scripts to GAC
6. Add Platform 4.1.x Dependencies nuget package url to user level \%AppData%\NuGet\NuGet.Config
7. Clone project: CAT-Infrastructure/HAB-Integration/RSR/PTR/ADR/AETC/RegLogin/HAT/WindowsServices/HIVQM
8. Execute batch file "setupIIS_NewPlatform_PostAwardGit.bat"
9. Build the solutions: RegLogin/RSR
10. Replace web.config across all solutions  
---