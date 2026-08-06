@ECHO OFF

REM If you want to use old TFS way of pointing to Platform use this file

set appcmd="%systemroot%\system32\inetsrv\appcmd"

REM ----Dev Project Paths----
set projectRootPath=Y:\WorkSpace
set projectRsrHrsaPath=%projectRootPath%\HAB-RSR
set projectPtrHrsaPath=%projectRootPath%\HAB-PTR
set projectHatHrsaPath=%projectRootPath%\HAB-HAT
set projectHivqmHrsaPath=%projectRootPath%\HAB-HIVQM
set projectAdrHrsaPath=%projectRootPath%\HAB-ADR
set projectAetcHrsaPath=%projectRootPath%\HAB-AETC
set projectEhbGatewayHrsaPath=%projectRootPath%\CAT-EHBGateway
REM set projectRegLoginHrsaPath=%projectRootPath%\HAB-RegLogin

set platformPath=%projectRootPath%\HAB-Platformv4.19.40\Platform\v4.19.40
set platformRsrHrsaPath=%platformPath%
set platformPtrHrsaPath=%platformPath%
set platformHatHrsaPath=%platformPath%
set platformHivqmHrsaPath=%platformPath%
set platformAdrHrsaPath=%platformPath%
set platformAetcHrsaPath=%platformPath%


REM set projectPath=Y:\WorkSpace
REM set platformPath=%projectPath%\HAB-Platformv4.9.55\Platform\v4.9.55
REM set platformRsrHrsaPath=%projectRootPath%\HAB-Platformv4.9.55\Platform\v4.9.55
REM set platformPtrHrsaPath=%projectRootPath%\HAB-Platformv4.9.55\Platform\v4.9.55
REM set platformHatHrsaPath=%projectRootPath%\HAB-Platformv4.9.55\Platform\v4.9.55
REM set platformHivqmHrsaPath=%projectRootPath%\HAB-Platformv4.9.55\Platform\v4.9.55
REM set platformAdrHrsaPath=%projectRootPath%\HAB-Platformv4.9.55\Platform\v4.9.55
REM set platformAetcHrsaPath=%projectRootPath%\HAB-Platformv4.9.55\Platform\v4.9.55

REM HAB
set RsrHrsaAppPath=%projectRsrHrsaPath%\src\Rsr.Web
set PtrHrsaAppPath=%projectPtrHrsaPath%\src\PTR.Web
set hatHrsaAppPath=%projectHatHrsaPath%\src\Hat.Web
set hivqmHrsaAppPath=%projectHivqmHrsaPath%\src\HIVQM.Web
set adrHrsaAppPath=%projectAdrHrsaPath%\src\Adr.Web
set aetcHrsaAppPath=%projectAetcHrsaPath%\src\Aetc.Web
set ehbgatewayHrsaAppPath=%projectEhbGatewayHrsaPath%\Grants\EHBGateway\Hrsa.Grants.Common.EhbGateway.RemoteFacade\src

ECHO.
ECHO Setting Up Application Pools
ECHO.

%appcmd% add apppool /name:RsrAppPool /managedRuntimeVersion:v4.0 /managedPipelineMode:Classic
%appcmd% add apppool /name:PtrAppPool /managedRuntimeVersion:v4.0 /managedPipelineMode:Classic
%appcmd% add apppool /name:HatAppPool /managedRuntimeVersion:v4.0 /managedPipelineMode:Classic
%appcmd% add apppool /name:HivqmAppPool /managedRuntimeVersion:v4.0 /managedPipelineMode:Classic
%appcmd% add apppool /name:adrAppPool /managedRuntimeVersion:v4.0 /managedPipelineMode:Classic
%appcmd% add apppool /name:aetcAppPool /managedRuntimeVersion:v4.0 /managedPipelineMode:Classic
%appcmd% add apppool /name:EhbGatewayAppPool /managedRuntimeVersion:v4.0 /managedPipelineMode:Classic

ECHO.
ECHO Setting Up Applications
ECHO.

REM HUB
%appcmd% add vdir /app.name:"Default Web Site/" /path:/HAB /physicalPath:"%projectRootPath%"

%appcmd% add app /site.name:"Default Web Site" /path:/hab/RsrInternal /physicalPath:"%platformRsrHrsaPath%\AppInternal" /applicationPool:RsrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/RsrExternal /physicalPath:"%platformRsrHrsaPath%\AppExternal" /applicationPool:RsrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/RsrInternal/App /physicalPath:"%RsrHrsaAppPath%" /applicationPool:RsrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/RsrExternal/App /physicalPath:"%RsrHrsaAppPath%" /applicationPool:RsrAppPool

%appcmd% add app /site.name:"Default Web Site" /path:/hab/PtrInternal /physicalPath:"%platformPtrHrsaPath%\AppInternal" /applicationPool:PtrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/PtrExternal /physicalPath:"%platformPtrHrsaPath%\AppExternal" /applicationPool:PtrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/PtrInternal/App /physicalPath:"%PtrHrsaAppPath%" /applicationPool:PtrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/PtrExternal/App /physicalPath:"%PtrHrsaAppPath%" /applicationPool:PtrAppPool

%appcmd% add app /site.name:"Default Web Site" /path:/hab/HatInternal /physicalPath:"%platformHatHrsaPath%\AppInternal" /applicationPool:HatAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/HatExternal /physicalPath:"%platformHatHrsaPath%\AppExternal" /applicationPool:HatAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/HatInternal/App /physicalPath:"%hatHrsaAppPath%" /applicationPool:HatAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/HatExternal/App /physicalPath:"%hatHrsaAppPath%" /applicationPool:HatAppPool

%appcmd% add app /site.name:"Default Web Site" /path:/hab/HivqmInternal /physicalPath:"%platformHivqmHrsaPath%\AppInternal" /applicationPool:HivqmAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/HivqmExternal /physicalPath:"%platformHivqmHrsaPath%\AppExternal" /applicationPool:HivqmAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/HivqmInternal/App /physicalPath:"%hivqmHrsaAppPath%" /applicationPool:HivqmAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/HivqmExternal/App /physicalPath:"%hivqmHrsaAppPath%" /applicationPool:HivqmAppPool

%appcmd% add app /site.name:"Default Web Site" /path:/hab/AdrInternal /physicalPath:"%platformAdrHrsaPath%\AppInternal" /applicationPool:adrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/AdrExternal /physicalPath:"%platformAdrHrsaPath%\AppExternal" /applicationPool:adrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/AdrInternal/App /physicalPath:"%adrHrsaAppPath%" /applicationPool:adrAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/AdrExternal/App /physicalPath:"%adrHrsaAppPath%" /applicationPool:adrAppPool
 
%appcmd% add app /site.name:"Default Web Site" /path:/hab/AetcInternal /physicalPath:"%platformAetcHrsaPath%\AppInternal" /applicationPool:aetcAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/AetcExternal /physicalPath:"%platformAetcHrsaPath%\AppExternal" /applicationPool:aetcAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/AetcInternal/App /physicalPath:"%aetcHrsaAppPath%" /applicationPool:aetcAppPool
%appcmd% add app /site.name:"Default Web Site" /path:/hab/AetcExternal/App /physicalPath:"%aetcHrsaAppPath%" /applicationPool:aetcAppPool

%appcmd% add app /site.name:"Default Web Site" /path:/EhbGateway /physicalPath:"%ehbgatewayHrsaAppPath%" /applicationPool:EhbGatewayAppPool

REM PAUSE
